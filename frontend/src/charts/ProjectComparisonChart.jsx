import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProjectComparisonChart = ({ data }) => (
  <div className="glass-panel rounded-[30px] p-5">
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Project Comparison</p>
    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
      Effective rate by project
    </h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#94a3b833" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="effectiveRate" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ProjectComparisonChart;

