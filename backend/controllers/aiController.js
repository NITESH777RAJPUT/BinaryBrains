import Project from "../models/Project.js";
import TimeLog from "../models/TimeLog.js";
import { calculateProjectMetrics } from "../utils/analytics.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const analyzeProjectData = async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: "projectId is required" });
  }

  const project = await Project.findOne({ _id: projectId, userId: req.user._id });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLogs = await TimeLog.find({ projectId }).sort({ createdAt: -1 });
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
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch AI insights",
      error: error.message,
    });
  }
};

