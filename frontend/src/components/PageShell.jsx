import { motion } from "framer-motion";

const PageShell = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="space-y-8"
  >
    {children}
  </motion.div>
);

export default PageShell;

