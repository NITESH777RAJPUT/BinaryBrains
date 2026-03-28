import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

const ProjectCard = ({ item }) => {
  const { project, metrics } = item;
  const profitable = metrics.profitabilityStatus === "profitable";
  const { formatRate } = useCurrency();

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.015, boxShadow: "0px 26px 60px rgba(15, 23, 42, 0.32)" }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <Link
        to={`/projects/${project._id}`}
        className="premium-dark-card block rounded-[30px] p-5 transition duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-300">{project.type}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-white">{project.title}</h3>
            <p className="mt-2 text-sm text-gray-300">{project.client}</p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              profitable
                ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-200"
                : "border-rose-400/20 bg-rose-500/15 text-rose-200"
            }`}
          >
            {profitable ? "Profitable" : "At risk"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-300">Hours</p>
            <p className="mt-1 font-semibold text-white">{metrics.totalHours}h</p>
          </div>
          <div>
            <p className="text-gray-300">Effective Rate</p>
            <p className="mt-1 font-semibold text-white">{formatRate(metrics.effectiveRate)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
          Assigned to: <span className="font-semibold text-white">{project.assignedTo?.name || "Unassigned"}</span>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-300">
            <span>Progress</span>
            <span>{metrics.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className={`h-2 rounded-full ${profitable ? "bg-emerald-400" : "bg-rose-400"}`}
              style={{ width: `${Math.min(metrics.progress, 100)}%` }}
            />
          </div>
        </div>

        {metrics.alerts.length ? (
          <div className="mt-4 rounded-2xl border border-rose-400/10 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {metrics.alerts[0]}
          </div>
        ) : null}
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
