import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#14b8a6", "#f97316"];

const BillableSplitChart = ({ data }) => (
  <div className="glass-panel rounded-[30px] p-5">
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Work Mix</p>
    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
      Billable vs non-billable
    </h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BillableSplitChart;

