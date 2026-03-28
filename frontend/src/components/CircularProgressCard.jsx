const CircularProgressCard = ({ value, label, tone = "teal" }) => {
  const safe = Math.max(0, Math.min(100, value));
  const stroke = tone === "rose" ? "#f43f5e" : tone === "amber" ? "#f59e0b" : "#14b8a6";
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="glass-panel rounded-[28px] p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-4 flex items-center gap-5">
        <svg width="110" height="110" viewBox="0 0 110 110" className="shrink-0">
          <circle cx="55" cy="55" r={radius} stroke="rgba(148,163,184,0.22)" strokeWidth="10" fill="none" />
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={stroke}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 55 55)"
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-xl font-semibold dark:fill-white">
            {safe}%
          </text>
        </svg>
        <div>
          <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{safe}%</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Animated progress keeps execution visible.</p>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressCard;

