const StatsCard = ({ label, value, hint, tone = "default" }) => {
  const toneMap = {
    default: "from-white/80 to-white/35 dark:from-white/10 dark:to-white/5",
    profit: "from-emerald-400/35 to-teal-400/10 dark:from-emerald-500/20 dark:to-teal-500/10",
    danger: "from-rose-400/35 to-red-400/10 dark:from-rose-500/20 dark:to-red-500/10",
    warn: "from-amber-300/35 to-amber-100/10 dark:from-amber-500/20 dark:to-amber-400/10",
  };

  return (
    <div className={`glass-panel rounded-[28px] bg-gradient-to-br ${toneMap[tone]} p-5`}>
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</p> : null}
    </div>
  );
};

export default StatsCard;

