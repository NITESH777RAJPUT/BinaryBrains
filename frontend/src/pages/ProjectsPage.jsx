import { Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import SectionHeading from "../components/SectionHeading";
import { useToast } from "../context/ToastContext";
import usePortfolioData from "../hooks/usePortfolioData";
import { projectService } from "../services/api";

const ProjectsPage = () => {
  const { pushToast } = useToast();
  const { data, loadPortfolio } = usePortfolioData();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("All");
  const [profitFilter, setProfitFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const clients = useMemo(
    () => ["All", ...new Set((data.projects || []).map((item) => item.project.client))],
    [data.projects]
  );
  const types = useMemo(
    () => ["All", ...new Set((data.projects || []).map((item) => item.project.type))],
    [data.projects]
  );

  const filtered = useMemo(() => {
    return (data.projects || []).filter((item) => {
      const matchesSearch =
        item.project.title.toLowerCase().includes(search.toLowerCase()) ||
        item.project.client.toLowerCase().includes(search.toLowerCase());
      const matchesClient = clientFilter === "All" || item.project.client === clientFilter;
      const matchesProfit =
        profitFilter === "All" || item.metrics.profitabilityStatus === profitFilter;
      const matchesType = typeFilter === "All" || item.project.type === typeFilter;
      return matchesSearch && matchesClient && matchesProfit && matchesType;
    });
  }, [clientFilter, data.projects, profitFilter, search, typeFilter]);

  const handleCreateProject = async (payload) => {
    try {
      setSaving(true);
      await projectService.createProject(payload);
      pushToast({ tone: "success", title: "Project created", description: "Project list updated." });
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
      <SectionHeading
        eyebrow="Projects Workspace"
        title="Browse, search, and filter your work portfolio"
        description="Slice your projects by client, profitability, and type to quickly find which work deserves more focus."
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            New Project
          </button>
        }
      />

      <section className="glass-panel rounded-[30px] p-5">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/60 px-4 py-3 dark:bg-slate-900/60">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by project or client"
              className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white"
            />
          </label>
          {[["Client", clientFilter, setClientFilter, clients], ["Profitability", profitFilter, setProfitFilter, ["All", "profitable", "unprofitable"]], ["Project Type", typeFilter, setTypeFilter, types]].map(
            ([label, value, setter, options]) => (
              <label
                key={label}
                className="rounded-2xl border border-slate-300/80 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  <Filter size={14} />
                  {label}
                </span>
                <select
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                >
                  {options.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-white text-slate-900 hover:bg-teal-500 hover:text-white dark:bg-slate-900 dark:text-white"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            )
          )}
        </div>
      </section>

      {filtered.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <ProjectCard key={item.project._id} item={item} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No projects match these filters"
          description="Try widening the filters or create a new project to populate this workspace."
        />
      )}

      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={saving}
      />
    </PageShell>
  );
};

export default ProjectsPage;
