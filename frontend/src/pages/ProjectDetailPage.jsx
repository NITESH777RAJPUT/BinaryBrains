import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NonBillableCharts from "../charts/NonBillableCharts";
import AIInsightsPanel from "../components/AIInsightsPanel";
import StatsCard from "../components/StatsCard";
import TimeLogForm from "../components/TimeLogForm";
import TimerWidget from "../components/TimerWidget";
import { useToast } from "../context/ToastContext";
import { aiService, projectService, timeLogService } from "../services/api";

const model = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { pushToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [insights, setInsights] = useState(null);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(id);
      setData(response);
    } catch (error) {
      pushToast({ tone: "error", title: "Could not load project", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const submitTimeLog = async (payload) => {
    try {
      setSaving(true);
      await timeLogService.createTimeLog(payload);
      pushToast({ tone: "success", title: "Time logged", description: "Metrics updated in real time." });
      await loadProject();
    } catch (error) {
      pushToast({ tone: "error", title: "Could not save time log", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAiError("");
      setAiLoading(true);
      const response = await aiService.analyzeProject({ projectId: id, model });
      setInsights(response.insights);
      pushToast({ tone: "success", title: "AI review ready", description: "Fresh recommendations are available." });
    } catch (error) {
      setAiError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const latestAlerts = useMemo(() => data?.metrics?.alerts || [], [data]);

  if (loading) {
    return <div className="glass-panel rounded-[30px] px-5 py-10 text-center">Loading project...</div>;
  }

  if (!data) {
    return <div className="glass-panel rounded-[30px] px-5 py-10 text-center">Project not found.</div>;
  }

  const { project, metrics, timeLogs } = data;

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[34px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/dashboard" className="text-sm font-semibold text-teal-600 dark:text-teal-300">
              Back to dashboard
            </Link>
            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{project.client}</p>
            <h1 className="mt-2 font-display text-5xl font-semibold text-slate-900 dark:text-white">
              {project.title}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              {project.type} | {project.pricingType} pricing | Threshold Rs {project.thresholdRate}/hour
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {latestAlerts.map((alert) => (
              <span
                key={alert}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  alert.includes("unprofitable")
                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-200"
                    : "bg-amber-400/20 text-amber-700 dark:text-amber-200"
                }`}
              >
                {alert}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Effective Rate"
          value={`Rs ${metrics.effectiveRate}/h`}
          tone={metrics.profitabilityStatus === "profitable" ? "profit" : "danger"}
        />
        <StatsCard label="Total Hours" value={`${metrics.totalHours}h`} hint={`Billable ${metrics.billableHours}h`} />
        <StatsCard label="Non-Billable" value={`${metrics.nonBillableHours}h`} hint="Emails, calls, revisions, admin" tone="warn" />
        <StatsCard
          label="Profit Delta"
          value={`Rs ${metrics.profitDelta}/h`}
          hint={`Threshold Rs ${metrics.thresholdRate}/h`}
          tone={metrics.profitDelta >= 0 ? "profit" : "danger"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <TimerWidget projectId={project._id} onLog={submitTimeLog} />
        <TimeLogForm projectId={project._id} onSubmit={submitTimeLog} loading={saving} />
      </section>

      <NonBillableCharts breakdown={metrics.breakdown} />

      <AIInsightsPanel insights={insights} loading={aiLoading} onAnalyze={handleAnalyze} error={aiError} />

      <section className="glass-panel rounded-[30px] p-5">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Time Logs</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
          Latest tracked activity
        </h3>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-slate-900/5 dark:bg-white/5">
              <tr>
                {["Type", "Duration", "Notes", "Date"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {timeLogs.length ? (
                timeLogs.map((log) => (
                  <tr key={log._id} className="text-sm text-slate-700 dark:text-slate-200">
                    <td className="px-4 py-3">{log.type}</td>
                    <td className="px-4 py-3">{log.duration}h</td>
                    <td className="px-4 py-3">{log.notes || "-"}</td>
                    <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No time logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
