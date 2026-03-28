import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CATEGORY_ORDER = ["Calls", "Emails", "Revisions", "Admin"];
const CATEGORY_COLORS = {
  Calls: "#06b6d4",
  Emails: "#f59e0b",
  Revisions: "#ef4444",
  Admin: "#8b5cf6",
};

const NonBillableCharts = ({ breakdown }) => {
  const data = CATEGORY_ORDER.map((name) => ({
    name,
    value: breakdown?.[name] ?? 0,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-panel rounded-[30px] p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Breakdown</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
          Non-billable pie chart
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.map((entry) => (
            <div key={entry.name} className="rounded-2xl bg-slate-900/5 px-4 py-3 text-sm dark:bg-white/5">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.name] }}
                />
                <span className="text-slate-700 dark:text-slate-200">{entry.name}</span>
              </div>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{entry.value}h</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-[30px] p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Breakdown</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
          Non-billable bar chart
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default NonBillableCharts;
