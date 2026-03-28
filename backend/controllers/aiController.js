import Project from "../models/Project.js";
import TimeLog from "../models/TimeLog.js";
import { buildProjectScope } from "../middleware/authMiddleware.js";
import { calculateProjectMetrics } from "../utils/analytics.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const buildFallbackInsights = (project, metrics, timeLogs) => {
  const revisionsHours = timeLogs
    .filter((log) => log.type === "Revisions")
    .reduce((sum, log) => sum + log.duration, 0);
  const adminHours = timeLogs
    .filter((log) => log.type === "Admin")
    .reduce((sum, log) => sum + log.duration, 0);
  const nonBillableShare =
    metrics.totalHours > 0 ? (metrics.nonBillableHours / metrics.totalHours) * 100 : 0;

  const risks = [];
  const suggestions = [];

  if (metrics.effectiveRate < metrics.thresholdRate) {
    risks.push("Effective rate is below your minimum profitability threshold.");
    suggestions.push("Raise pricing or tighten scope before taking on more work like this.");
  }

  if (revisionsHours >= Math.max(1, metrics.totalHours * 0.2)) {
    risks.push("Revision time is taking a large share of the project.");
    suggestions.push("Cap revision rounds in the proposal to protect margin.");
  }

  if (adminHours >= Math.max(1, metrics.totalHours * 0.15)) {
    risks.push("Admin work is consuming meaningful time that is not directly billable.");
    suggestions.push("Batch admin work or move recurring tasks into templates.");
  }

  if (metrics.scopeCreepDetected) {
    risks.push("Recent non-billable growth suggests scope creep.");
    suggestions.push("Pause and renegotiate deliverables before more hidden work accumulates.");
  }

  if (!risks.length) {
    risks.push("No major profitability risk detected from the current project data.");
  }

  if (!suggestions.length) {
    suggestions.push("Keep logging time consistently so future AI reviews stay accurate.");
  }

  return {
    summary:
      metrics.profitabilityStatus === "profitable"
        ? `This project is currently profitable at Rs ${metrics.effectiveRate}/hour, with ${nonBillableShare.toFixed(0)}% of time going to non-billable work.`
        : `This project is under pressure at Rs ${metrics.effectiveRate}/hour, below your Rs ${metrics.thresholdRate}/hour threshold.`,
    risks,
    suggestions,
    pricingRecommendation:
      metrics.effectiveRate < metrics.thresholdRate
        ? `Consider increasing the project price by roughly 15-25% for similar ${project.type.toLowerCase()} work.`
        : `Current pricing looks healthy; preserve margin by limiting extra revisions and admin overhead.`,
    clientSignal:
      metrics.profitabilityStatus === "profitable"
        ? `${project.client} currently looks sustainable.`
        : `${project.client} currently looks low-margin unless scope or pricing changes.`,
  };
};

export const analyzeProjectData = async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: "projectId is required" });
  }

  const project = await Project.findOne({ _id: projectId, ...buildProjectScope(req.user) });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLogs = await TimeLog.find({ projectId }).populate("userId", "name email").sort({ createdAt: -1 });
  const metrics = calculateProjectMetrics(project, timeLogs);

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(400).json({ message: "Missing OpenRouter API key" });
  }

  const prompt = `
You are a profitability analyst for freelancers.
Review the following real project data and return JSON with keys:
"summary", "risks", "suggestions", "pricingRecommendation", "clientSignal".
Keep risks and suggestions as arrays of short strings.

Project:
${JSON.stringify(project.toObject(), null, 2)}

Metrics:
${JSON.stringify(metrics, null, 2)}

Time Logs:
${JSON.stringify(
    timeLogs.map((log) => ({
      duration: log.duration,
      type: log.type,
      user: log.userId?.name || "Unknown",
      createdAt: log.createdAt,
      notes: log.notes,
    })),
    null,
    2
  )}
`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Freelancer Profitability Tracker",
      },
      body: JSON.stringify({
        model: req.body.model || "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are concise, data-driven, and practical. Always return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return res.json({
          insights: buildFallbackInsights(project, metrics, timeLogs),
          metrics,
          meta: {
            source: "fallback",
            rateLimited: true,
            message:
              "OpenRouter rate limit reached. Showing local profitability insights instead.",
          },
        });
      }

      return res.status(response.status).json({
        message: data?.error?.message || "OpenRouter request failed",
      });
    }

    const rawContent = data?.choices?.[0]?.message?.content;
    let parsed;

    try {
      parsed = JSON.parse(rawContent);
    } catch (error) {
      parsed = {
        summary: rawContent,
        risks: [],
        suggestions: [],
        pricingRecommendation: "",
        clientSignal: "",
      };
    }

    return res.json({
      insights: parsed,
      metrics,
      meta: {
        source: "openrouter",
        rateLimited: false,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch AI insights",
      error: error.message,
    });
  }
};
