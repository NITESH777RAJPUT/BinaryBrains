import { Link } from "react-router-dom";

const ProjectCard = ({ item }) => {
  const { project, metrics } = item;
  const profitable = metrics.profitabilityStatus === "profitable";

  return (
    <Link
      to={`/projects/${project._id}`}
      className="glass-panel block rounded-[30px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{project.type}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.client}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            profitable
              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-200"
              : "bg-rose-500/20 text-rose-700 dark:text-rose-200"
          }`}
        >
          {profitable ? "Profitable" : "At risk"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Hours</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">{metrics.totalHours}h</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Effective Rate</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">Rs {metrics.effectiveRate}/h</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>{metrics.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-900/10 dark:bg-white/10">
          <div
            className={`h-2 rounded-full ${profitable ? "bg-emerald-500" : "bg-rose-500"}`}
            style={{ width: `${Math.min(metrics.progress, 100)}%` }}
          />
        </div>
      </div>

      {metrics.alerts.length ? (
        <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {metrics.alerts[0]}
        </div>
      ) : null}
    </Link>
  );
};

export default ProjectCard;
