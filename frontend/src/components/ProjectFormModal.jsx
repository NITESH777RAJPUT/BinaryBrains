import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";

const initialState = {
  title: "",
  client: "",
  type: "",
  assignedTo: "",
  pricingType: "Fixed",
  price: "",
  estimatedHours: "",
  thresholdRate: "",
};

const ProjectFormModal = ({ isOpen, onClose, onSubmit, loading, teamMembers = [] }) => {
  const [form, setForm] = useState(initialState);
  const { currency, symbol, convertToBaseAmount } = useCurrency();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      assignedTo: form.assignedTo || undefined,
      price: Number(convertToBaseAmount(form.price)),
      estimatedHours: Number(form.estimatedHours),
      thresholdRate: Number(convertToBaseAmount(form.thresholdRate)),
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
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-md"
        >
          <motion.form
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-300">New Project</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-white">Add a profitability baseline</h3>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                Close
              </motion.button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["title", "Title"],
                ["client", "Client Name"],
                ["type", "Project Type"],
                ["price", `Total Value (${currency} ${symbol})`],
                ["estimatedHours", "Estimated Hours"],
                ["thresholdRate", `Min Rate Threshold (${symbol}/hour)`],
              ].map(([name, label]) => (
                <label key={name} className="premium-label">
                  {label}
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    className="premium-input"
                  />
                </label>
              ))}

              <label className="premium-label">
                Pricing Type
                <select
                  name="pricingType"
                  value={form.pricingType}
                  onChange={handleChange}
                  className="premium-input"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Hourly">Hourly</option>
                </select>
              </label>

              <label className="premium-label">
                Assigned To
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="premium-input"
                >
                  <option value="">Auto-assign to creator</option>
                  {teamMembers.map((member) => (
                    <option key={member._id || member.id} value={member._id || member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
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
