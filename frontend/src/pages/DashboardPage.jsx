import {
  AlertTriangle,
  ArrowUpRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import BillableSplitChart from "../charts/BillableSplitChart";
import ProfitTrendChart from "../charts/ProfitTrendChart";
import ProjectComparisonChart from "../charts/ProjectComparisonChart";
import CircularProgressCard from "../components/CircularProgressCard";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useToast } from "../context/ToastContext";
import usePortfolioData from "../hooks/usePortfolioData";
import { projectService } from "../services/api";

const DashboardPage = () => {
  const { pushToast } = useToast();
  const { data, loading, loadPortfolio, derived } = usePortfolioData();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const summary = data.portfolioSummary || {};
  const spotlightProject = data.projects?.[0];

  useEffect(() => {
    const seen = JSON.parse(sessionStorage.getItem("tracker_seen_alerts") || "[]");
    const unseen = derived.alerts.filter((alert) => !seen.includes(alert.id));

    unseen.forEach((alert) => {
      const tone = alert.message.toLowerCase().includes("unprofitable") ? "error" : "info";
      pushToast({
        tone,
        title: alert.message.toLowerCase().includes("unprofitable")
          ? "Rate dropped below threshold"
          : "Scope creep detected",
        description: `${alert.projectTitle}: ${alert.message}`,
      });
    });

    if (unseen.length) {
      sessionStorage.setItem(
        "tracker_seen_alerts",
        JSON.stringify([...seen, ...unseen.map((alert) => alert.id)])
      );
    }
  }, [derived.alerts, pushToast]);

  const handleCreateProject = async (payload) => {
    try {
      setSaving(true);
      await projectService.createProject(payload);
      pushToast({ tone: "success", title: "Project created", description: "The dashboard has been refreshed." });
      setModalOpen(false);
      await loadPortfolio();
    } catch (error) {
      pushToast({ tone: "error", title: "Project creation failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <section className="glass-panel overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-700 px-6 py-8 text-white">
        <SectionHeading
          eyebrow="Premium Dashboard"
          title="Turn freelance projects into a live profitability command center."
          description="Monitor money, margin, and hidden work in one vivid dashboard built to feel fast, intentional, and investor-demo ready."
          actions={
            <>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Export PDF
              </button>
            </>
          }
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Focus</p>
            <p className="mt-3 font-display text-3xl font-semibold">
              {spotlightProject?.project?.title || "Build your first profitable project"}
            </p>
            <p className="mt-3 text-sm text-cyan-50/80">
              {spotlightProject
                ? `Current effective rate: Rs ${spotlightProject.metrics.effectiveRate}/h`
                : "Add a project and start logging time to unlock trend intelligence."}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Live Alerts</p>
            <div className="mt-4 space-y-3">
              {derived.alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                  <span className="font-semibold">{alert.projectTitle}:</span> {alert.message}
                </div>
              ))}
              {!derived.alerts.length ? <p className="text-sm text-cyan-50/80">No urgent alerts right now.</p> : null}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Momentum</p>
            <p className="mt-3 text-4xl font-semibold">{data.projects.length}</p>
            <p className="mt-2 text-sm text-cyan-50/80">Active projects being tracked with live metrics.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Earnings"
          value={`Rs ${summary.totalEarnings || 0}`}
          hint="Projected revenue across the portfolio"
          tone="profit"
          icon={BadgeIndianRupee}
        />
        <StatsCard
          label="Avg Hourly Rate"
          value={`Rs ${summary.averageHourlyRate || 0}/h`}
          hint="Average across all tracked projects"
          icon={ArrowUpRight}
        />
        <StatsCard
          label="Total Hours Logged"
          value={`${derived.totalHoursLogged}h`}
          hint={`Billable ${derived.billableHours}h`}
          tone="warn"
          icon={Clock3}
        />
        <StatsCard
          label="Most Profitable"
          value={summary.mostProfitableProject?.title || "N/A"}
          hint={
            summary.mostProfitableProject
              ? `Rs ${summary.mostProfitableProject.effectiveRate}/h`
              : "Waiting for project data"
          }
          tone="profit"
          icon={Sparkles}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ProfitTrendChart data={derived.profitTrend} />
        <div className="grid gap-6">
          <BillableSplitChart data={derived.profitabilityMix} />
          <CircularProgressCard
            value={spotlightProject?.metrics?.progress || 0}
            label="Spotlight project progress"
            tone={
              spotlightProject?.metrics?.profitabilityStatus === "unprofitable" ? "rose" : "teal"
            }
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProjectComparisonChart data={derived.projectComparison} />
        <div className="glass-panel rounded-[30px] p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Warnings</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
            Watch list
          </h3>
          <div className="mt-5 space-y-4">
            {derived.alerts.length ? (
              derived.alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="rounded-2xl bg-amber-400/10 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-amber-400/20 p-2 text-amber-700 dark:text-amber-200">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{alert.projectTitle}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Portfolio is stable"
                description="No threshold drops or scope creep signals are active. Keep tracking time to preserve signal quality."
              />
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Projects"
          title="Premium project cards"
          description="Quick-glance cards surface rate, hours, progress, and profitability status with stronger visual hierarchy."
        />
        {data.projects.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.projects.map((item) => (
              <ProjectCard key={item.project._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No projects yet"
              description="Create your first project to unlock alerts, trend charts, and AI pricing insight."
              action={
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="rounded-full bg-teal-500 px-5 py-3 font-semibold text-white"
                >
                  Add first project
                </button>
              }
            />
          </div>
        )}
      </section>

      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={saving || loading}
      />
    </PageShell>
  );
};

export default DashboardPage;
