const AIInsightsPanel = ({ insights, loading, onAnalyze, error }) => (
  <div className="glass-panel rounded-[30px] p-5">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">AI Insights</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
          OpenRouter profitability review
        </h3>
      </div>
      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading}
        className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Generate Insights"}
      </button>
    </div>

    {error ? <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}

    {insights ? (
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-900/5 p-4 dark:bg-white/5">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Summary</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{insights.summary}</p>
        </div>
        <div className="rounded-2xl bg-slate-900/5 p-4 dark:bg-white/5">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pricing Recommendation</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{insights.pricingRecommendation}</p>
        </div>
        <div className="rounded-2xl bg-slate-900/5 p-4 dark:bg-white/5">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Risks</p>
          <div className="mt-2 space-y-2">
            {(insights.risks || []).map((risk) => (
              <p key={risk} className="text-sm text-slate-700 dark:text-slate-200">- {risk}</p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/5 p-4 dark:bg-white/5">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Suggestions</p>
          <div className="mt-2 space-y-2">
            {(insights.suggestions || []).map((suggestion) => (
              <p key={suggestion} className="text-sm text-slate-700 dark:text-slate-200">- {suggestion}</p>
            ))}
          </div>
          {insights.clientSignal ? (
            <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-200">
              Client signal: {insights.clientSignal}
            </p>
          ) : null}
        </div>
      </div>
    ) : (
      <div className="mt-5 rounded-2xl border border-dashed border-white/20 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
        Generate an AI review to surface scope creep, pricing risks, and better project selection decisions.
      </div>
    )}
  </div>
);

export default AIInsightsPanel;
