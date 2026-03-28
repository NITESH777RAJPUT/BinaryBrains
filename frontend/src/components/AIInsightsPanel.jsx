import { motion } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";

const panelCardClass = "premium-dark-card rounded-2xl p-4";

const AIInsightsPanel = ({ insights, loading, onAnalyze, onSaveReport, canSaveReport, error, infoMessage }) => {
  const { formatInsightText } = useCurrency();

  return (
    <div className="glass-panel rounded-[30px] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">AI Insights</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
            OpenRouter profitability review
          </h3>
        </div>
        <motion.button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-amber-300 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Analyzing..." : "Generate Insights"}
        </motion.button>
      </div>

      {error ? <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}
      {infoMessage ? (
        <div className="mt-4 rounded-2xl bg-amber-400/15 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {infoMessage}
        </div>
      ) : null}

      {insights ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className={panelCardClass}>
            <p className="text-sm font-semibold text-gray-300">Summary</p>
            <p className="mt-2 text-sm text-white">{formatInsightText(insights.summary)}</p>
          </div>
          <div className={panelCardClass}>
            <p className="text-sm font-semibold text-gray-300">Pricing Recommendation</p>
            <p className="mt-2 text-sm text-white">{formatInsightText(insights.pricingRecommendation)}</p>
          </div>
          <div className={panelCardClass}>
            <p className="text-sm font-semibold text-gray-300">Risks</p>
            <div className="mt-2 space-y-2">
              {(insights.risks || []).map((risk) => (
                <p key={risk} className="text-sm text-white">- {formatInsightText(risk)}</p>
              ))}
            </div>
          </div>
          <div className={panelCardClass}>
            <p className="text-sm font-semibold text-gray-300">Suggestions</p>
            <div className="mt-2 space-y-2">
              {(insights.suggestions || []).map((suggestion) => (
                <p key={suggestion} className="text-sm text-white">- {formatInsightText(suggestion)}</p>
              ))}
            </div>
            {insights.clientSignal ? (
              <p className="mt-3 text-sm font-medium text-amber-200">
                Client signal: {formatInsightText(insights.clientSignal)}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-white/20 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
          Generate an AI review to surface scope creep, pricing risks, and better project selection decisions.
        </div>
      )}

      {insights ? (
        <div className="mt-5 flex justify-end">
          <motion.button
            type="button"
            onClick={onSaveReport}
            disabled={!canSaveReport}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save Report
          </motion.button>
        </div>
      ) : null}
    </div>
  );
};

export default AIInsightsPanel;
