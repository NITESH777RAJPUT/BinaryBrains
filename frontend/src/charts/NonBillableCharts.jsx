import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"];

const NonBillableCharts = ({ breakdown }) => {
  const data = Object.entries(breakdown || {}).map(([name, value]) => ({ name, value }));

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
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
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
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
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

