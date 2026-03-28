import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

const sectionClass = "rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur";

const ReportPreviewModal = ({ report, isOpen, onClose }) => {
  const { formatInsightText } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && report ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 210, damping: 20 }}
            className="premium-dark-card max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[32px]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-300">Saved AI Report</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-white">{report.projectName}</h3>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-300">
                  <FileText size={15} />
                  <span>{new Date(report.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-3 text-white"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="max-h-[calc(90vh-110px)] overflow-y-auto px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className={sectionClass}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Summary</p>
                  <p className="mt-3 text-sm leading-7 text-white">{formatInsightText(report.insights?.summary || report.summary)}</p>
                </div>
                <div className={sectionClass}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Pricing Recommendation</p>
                  <p className="mt-3 text-sm leading-7 text-white">{formatInsightText(report.insights?.pricingRecommendation || "No recommendation available.")}</p>
                </div>
                <div className={sectionClass}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Risks</p>
                  <div className="mt-3 space-y-3">
                    {(report.insights?.risks || []).length ? (
                      report.insights.risks.map((risk) => (
                        <p key={risk} className="rounded-2xl border border-rose-400/10 bg-rose-500/10 px-4 py-3 text-sm text-gray-100">
                          {formatInsightText(risk)}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-300">No risks captured for this report.</p>
                    )}
                  </div>
                </div>
                <div className={sectionClass}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Suggestions</p>
                  <div className="mt-3 space-y-3">
                    {(report.insights?.suggestions || []).length ? (
                      report.insights.suggestions.map((suggestion) => (
                        <p key={suggestion} className="rounded-2xl border border-emerald-400/10 bg-emerald-500/10 px-4 py-3 text-sm text-gray-100">
                          {formatInsightText(suggestion)}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-300">No suggestions captured for this report.</p>
                    )}
                  </div>
                  {report.insights?.clientSignal ? (
                    <div className="mt-4 rounded-2xl border border-amber-400/10 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      Client signal: {formatInsightText(report.insights.clientSignal)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ReportPreviewModal;
