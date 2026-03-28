import { useEffect, useMemo, useState } from "react";
import ClientAnalysisChart from "../charts/ClientAnalysisChart";
import MonthlyTrendsChart from "../charts/MonthlyTrendsChart";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import StatsCard from "../components/StatsCard";
import { useToast } from "../context/ToastContext";
import { projectService } from "../services/api";

const DashboardPage = () => {
  const { pushToast } = useToast();
  const [data, setData] = useState({
    projects: [],
    portfolioSummary: { clientAnalysis: [] },
    monthlyAnalytics: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setData(response);
    } catch (error) {
      pushToast({ tone: "error", title: "Could not load dashboard", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCreateProject = async (payload) => {
    try {
      setSaving(true);
      await projectService.createProject(payload);
      pushToast({ tone: "success", title: "Project created", description: "Your dashboard has been updated." });
      setModalOpen(false);
      await loadDashboard();
    } catch (error) {
      pushToast({ tone: "error", title: "Project creation failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase();
    return data.projects.filter(
      ({ project }) =>
        project.title.toLowerCase().includes(term) || project.client.toLowerCase().includes(term)
    );
  }, [data.projects, search]);

  const summary = data.portfolioSummary;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel overflow-hidden rounded-[34px] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Portfolio Dashboard</p>
              <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight text-slate-900 dark:text-white">
                Keep your freelance business visually sharp and financially honest.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
                Monitor earnings, effective hourly rate, and hidden effort across every client engagement in one polished workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 no-print">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects or clients"
                className="rounded-full border border-white/20 bg-white/70 px-5 py-3 text-sm text-slate-900 dark:bg-slate-900/60 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <StatsCard label="Total Earnings" value={`Rs ${summary.totalEarnings || 0}`} tone="profit" />
          <StatsCard
            label="Average Hourly Rate"
            value={`Rs ${summary.averageHourlyRate || 0}/h`}
            hint={
              summary.mostProfitableProject
                ? `Best: ${summary.mostProfitableProject.title}`
                : "Create your first project to unlock ranking."
            }
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Most Profitable"
          value={summary.mostProfitableProject?.title || "N/A"}
          hint={
            summary.mostProfitableProject
              ? `Rs ${summary.mostProfitableProject.effectiveRate}/h`
              : "Waiting for project data"
          }
          tone="profit"
        />
        <StatsCard
          label="Least Profitable"
          value={summary.leastProfitableProject?.title || "N/A"}
          hint={
            summary.leastProfitableProject
              ? `Rs ${summary.leastProfitableProject.effectiveRate}/h`
              : "Waiting for project data"
          }
          tone="danger"
        />
        <StatsCard label="Projects" value={data.projects.length} hint="Fixed and hourly work side by side" />
        <StatsCard
          label="Clients"
          value={summary.clientAnalysis?.length || 0}
          hint="Client-wise analysis included"
          tone="warn"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <MonthlyTrendsChart data={data.monthlyAnalytics} />
        <ClientAnalysisChart data={summary.clientAnalysis || []} />
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Project Dashboard</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
              Every project at a glance
            </h2>
          </div>
          {loading ? <p className="text-sm text-slate-500 dark:text-slate-400">Refreshing data...</p> : null}
        </div>

        {filteredProjects.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((item) => (
              <ProjectCard key={item.project._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-[30px] px-5 py-10 text-center text-slate-600 dark:text-slate-300">
            {loading ? "Loading projects..." : "No projects yet. Create one to start tracking profitability."}
          </div>
        )}
      </section>

      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={saving}
      />
    </div>
  );
};

export default DashboardPage;
