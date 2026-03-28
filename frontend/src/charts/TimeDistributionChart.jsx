import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TimeDistributionChart = ({ data }) => (
  <div className="glass-panel rounded-[30px] p-5">
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Time Distribution</p>
    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
      Non-billable categories per project
    </h3>
    <div className="mt-6 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#94a3b833" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Emails" stackId="a" fill="#06b6d4" />
          <Bar dataKey="Calls" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Revisions" stackId="a" fill="#ef4444" />
          <Bar dataKey="Admin" stackId="a" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TimeDistributionChart;
