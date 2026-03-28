import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCurrency } from "../context/CurrencyContext";

const ClientAnalysisChart = ({ data }) => {
  const { formatRate } = useCurrency();

  return (
  <div className="glass-panel rounded-[30px] p-5">
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Client Analysis</p>
    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
      Effective rate by client
    </h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="client" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" tickFormatter={(value) => formatRate(value, { maximumFractionDigits: 0, suffix: "" })} />
          <Tooltip formatter={(value) => [formatRate(value), "Effective rate"]} />
          <Bar dataKey="effectiveRate" fill="#14b8a6" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default ClientAnalysisChart;
