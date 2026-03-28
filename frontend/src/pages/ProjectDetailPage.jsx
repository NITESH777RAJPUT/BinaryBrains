import { ArrowLeft, BriefcaseBusiness, Clock3, TrendingUp, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NonBillableCharts from "../charts/NonBillableCharts";
import AIInsightsPanel from "../components/AIInsightsPanel";
import CircularProgressCard from "../components/CircularProgressCard";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
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
  const [aiInfo, setAiInfo] = useState("");
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
      setAiInfo("");
      setAiLoading(true);
      const response = await aiService.analyzeProject({ projectId: id, model });
      setInsights(response.insights);
      if (response.meta?.rateLimited) {
        setAiInfo(response.meta.message);
        pushToast({
          tone: "info",
          title: "Fallback insights loaded",
          description: "OpenRouter is rate-limited, so local profitability logic was used.",
        });
      } else {
        pushToast({ tone: "success", title: "AI review ready", description: "Fresh recommendations are available." });
      }
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
    <PageShell>
      <section className="glass-panel overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-indigo-950 to-teal-700 p-6 text-white">
        <SectionHeading
          eyebrow="Project Detail"
          title={project.title}
          description={`${project.client} | ${project.type} | ${project.pricingType} pricing`}
          actions={
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              <ArrowLeft size={16} />
              Back to projects
            </Link>
          }
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Status Snapshot</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-cyan-100/80">Effective rate</p>
                <p className="mt-2 text-3xl font-semibold">Rs {metrics.effectiveRate}/h</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-cyan-100/80">Threshold</p>
                <p className="mt-2 text-3xl font-semibold">Rs {metrics.thresholdRate}/h</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Alerts</p>
            <div className="mt-4 space-y-3">
              {latestAlerts.length ? (
                latestAlerts.map((alert) => (
                  <div key={alert} className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                    {alert}
                  </div>
                ))
              ) : (
                <p className="text-sm text-cyan-50/80">This project has no active warnings.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Effective Rate"
          value={`Rs ${metrics.effectiveRate}/h`}
          tone={metrics.profitabilityStatus === "profitable" ? "profit" : "danger"}
          icon={TrendingUp}
        />
        <StatsCard label="Total Hours" value={`${metrics.totalHours}h`} hint={`Billable ${metrics.billableHours}h`} icon={Clock3} />
        <StatsCard label="Non-Billable" value={`${metrics.nonBillableHours}h`} hint="Emails, calls, revisions, admin" tone="warn" icon={TriangleAlert} />
        <StatsCard label="Project Value" value={`Rs ${metrics.price}`} hint={project.client} icon={BriefcaseBusiness} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <TimerWidget projectId={project._id} onLog={submitTimeLog} />
        <TimeLogForm projectId={project._id} onSubmit={submitTimeLog} loading={saving} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <NonBillableCharts breakdown={metrics.breakdown} />
        <div className="grid gap-6">
          <CircularProgressCard
            value={metrics.progress}
            label="Estimated scope progress"
            tone={metrics.profitabilityStatus === "profitable" ? "teal" : "rose"}
          />
          <div className="glass-panel rounded-[30px] p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quick Facts</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-slate-900/5 px-4 py-4 dark:bg-white/5">
                Profit delta: <span className="font-semibold">Rs {metrics.profitDelta}/h</span>
              </div>
              <div className="rounded-2xl bg-slate-900/5 px-4 py-4 dark:bg-white/5">
                Scope creep: <span className="font-semibold">{metrics.scopeCreepDetected ? "Detected" : "Stable"}</span>
              </div>
              <div className="rounded-2xl bg-slate-900/5 px-4 py-4 dark:bg-white/5">
                Estimated rate: <span className="font-semibold">Rs {metrics.estimatedRate}/h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIInsightsPanel
        insights={insights}
        loading={aiLoading}
        onAnalyze={handleAnalyze}
        error={aiError}
        infoMessage={aiInfo}
      />

      <section className="glass-panel rounded-[30px] p-5">
        <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Tracked activity timeline</h3>
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
    </PageShell>
  );
};

export default ProjectDetailPage;
