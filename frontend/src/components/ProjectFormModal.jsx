import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const initialState = {
  title: "",
  client: "",
  type: "",
  pricingType: "Fixed",
  price: "",
  estimatedHours: "",
  thresholdRate: "",
};

const ProjectFormModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      price: Number(form.price),
      estimatedHours: Number(form.estimatedHours),
      thresholdRate: Number(form.thresholdRate),
    });
    setForm(initialState);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <motion.form
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            onSubmit={handleSubmit}
            className="glass-panel w-full max-w-2xl rounded-[32px] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">New Project</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                  Add a profitability baseline
                </h3>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="rounded-full bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100"
              >
                Close
              </motion.button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["title", "Title"],
                ["client", "Client Name"],
                ["type", "Project Type"],
                ["price", "Total Value"],
                ["estimatedHours", "Estimated Hours"],
                ["thresholdRate", "Min Rate Threshold (Rs/hour)"],
              ].map(([name, label]) => (
                <label key={name} className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {label}
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 dark:bg-slate-900/60 dark:text-white"
                  />
                </label>
              ))}

              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Pricing Type
                <select
                  name="pricingType"
                  value={form.pricingType}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Hourly">Hourly</option>
                </select>
              </label>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="mt-6 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create Project"}
            </motion.button>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ProjectFormModal;
