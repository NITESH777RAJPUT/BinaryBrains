import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = ({ title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-panel rounded-[32px] px-6 py-12 text-center"
  >
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-teal-500 to-amber-400 text-white shadow-xl">
      <Sparkles size={32} />
    </div>
    <h3 className="mt-6 font-display text-3xl font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </motion.div>
);

export default EmptyState;

