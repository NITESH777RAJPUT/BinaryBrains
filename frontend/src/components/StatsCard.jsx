import { motion } from "framer-motion";

const StatsCard = ({ label, value, hint, tone = "default", icon: Icon }) => {
  const toneMap = {
    default: "from-white/80 via-white/35 to-cyan-100/30 dark:from-white/10 dark:via-white/5 dark:to-cyan-500/10",
    profit: "from-emerald-400/35 via-teal-400/15 to-cyan-300/20 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-cyan-500/10",
    danger: "from-rose-400/35 via-red-400/15 to-orange-200/20 dark:from-rose-500/20 dark:via-red-500/10 dark:to-orange-500/10",
    warn: "from-amber-300/35 via-yellow-200/20 to-orange-100/20 dark:from-amber-500/20 dark:via-amber-400/10 dark:to-orange-400/10",
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`glass-panel rounded-[28px] bg-gradient-to-br ${toneMap[tone]} p-5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
          {hint ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-white/50 p-3 text-slate-800 shadow-lg dark:bg-white/10 dark:text-white">
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default StatsCard;
