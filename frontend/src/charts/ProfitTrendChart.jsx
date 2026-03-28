import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProfitTrendChart = ({ data }) => (
  <div className="glass-panel rounded-[30px] p-5">
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Profit Trend</p>
    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
      Earnings over time
    </h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#94a3b833" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ProfitTrendChart;

