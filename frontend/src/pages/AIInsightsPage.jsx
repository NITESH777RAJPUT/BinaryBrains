import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";
import AIInsightsPanel from "../components/AIInsightsPanel";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import ReportPreviewModal from "../components/ReportPreviewModal";
import SavedReportsSection from "../components/SavedReportsSection";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useToast } from "../context/ToastContext";
import usePortfolioData from "../hooks/usePortfolioData";
import useSavedReports from "../hooks/useSavedReports";
import { aiService } from "../services/api";

const model = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini";

const AIInsightsPage = () => {
  const { data } = usePortfolioData();
  const { pushToast } = useToast();
  const { reports, saveReport, deleteReport } = useSavedReports();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [activeReport, setActiveReport] = useState(null);

  const selectedProject = data.projects.find((item) => item.project._id === selectedProjectId);

  const handleAnalyze = async () => {
    if (!selectedProjectId) {
      setError("Select a project before requesting AI insights.");
      return;
    }

    try {
      setError("");
      setInfoMessage("");
      setLoading(true);
      const response = await aiService.analyzeProject({ projectId: selectedProjectId, model });
      setInsights(response.insights);
      if (response.meta?.rateLimited) {
        setInfoMessage(response.meta.message);
      }
      pushToast({ tone: "success", title: "Insight generated", description: "AI review panel updated." });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!insights || !selectedProject) {
      return;
    }

    const report = saveReport({
      projectId: selectedProject.project._id,
      projectName: selectedProject.project.title,
      summary: insights.summary,
      insights,
    });

    setSelectedReportId(report.id);
    pushToast({
      tone: "success",
      title: "Report saved",
      description: `Saved AI report for ${selectedProject.project.title}.`,
    });
  };

  const handleViewReport = (report) => {
    setSelectedReportId(report.id);
    setSelectedProjectId(report.projectId);
    setInsights(report.insights);
    setActiveReport(report);
    setError("");
    setInfoMessage("");
  };

  const handleDeleteReport = (reportId) => {
    deleteReport(reportId);
    if (selectedReportId === reportId) {
      setSelectedReportId("");
    }
    if (activeReport?.id === reportId) {
      setActiveReport(null);
    }
    pushToast({
      tone: "info",
      title: "Report deleted",
      description: "The saved AI report was removed.",
    });
  };

  return (
    <PageShell>
      <SectionHeading
        eyebrow="AI Workspace"
        title="Run pricing and scope analysis on any project"
        description="Select a project, trigger AI review, and surface structured recommendations in a cleaner analyst-style view."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Projects Ready" value={data.projects.length} hint="Projects available for review" icon={Bot} />
        <StatsCard
          label="Insight Engine"
          value="AI Insight Engine"
          hint="Powered by AI"
          tone="warn"
          icon={Sparkles}
        />
        <div className="glass-panel rounded-[28px] p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pick Project</p>
          <select
            value={selectedProjectId}
            onChange={(event) => setSelectedProjectId(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 dark:bg-slate-900/60 dark:text-white"
          >
            <option value="">Select a project</option>
            {data.projects.map((item) => (
              <option key={item.project._id} value={item.project._id}>
                {item.project.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      {data.projects.length ? (
        <AIInsightsPanel
          insights={insights}
          loading={loading}
          onAnalyze={handleAnalyze}
          onSaveReport={handleSaveReport}
          canSaveReport={Boolean(insights && selectedProject)}
          error={error}
          infoMessage={infoMessage}
        />
      ) : (
        <EmptyState
          title="No projects available for AI review"
          description="Once you create a project, you can request pricing and profitability insight here."
        />
      )}

      <SavedReportsSection
        reports={reports}
        selectedReportId={selectedReportId}
        onView={handleViewReport}
        onDelete={handleDeleteReport}
      />

      <ReportPreviewModal report={activeReport} isOpen={Boolean(activeReport)} onClose={() => setActiveReport(null)} />
    </PageShell>
  );
};

export default AIInsightsPage;
