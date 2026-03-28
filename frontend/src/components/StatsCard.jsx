import { motion } from "framer-motion";

const StatsCard = ({ label, value, hint, tone = "default", icon: Icon, valueClassName = "" }) => {
  const toneMap = {
    default: "from-slate-900 to-slate-800",
    profit: "from-emerald-950 to-slate-900",
    danger: "from-rose-950 to-slate-900",
    warn: "from-amber-950 to-slate-900",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0px 24px 60px rgba(15, 23, 42, 0.35)" }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={`premium-dark-card rounded-[28px] bg-gradient-to-br ${toneMap[tone]} p-5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gray-300">{label}</p>
          <p className={`mt-3 font-display text-3xl font-semibold text-white ${valueClassName}`}>{value}</p>
          {hint ? <p className="mt-2 text-sm text-gray-300">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white shadow-xl backdrop-blur">
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default StatsCard;
