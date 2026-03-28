import { motion } from "framer-motion";
import { Bell, MoonStar, PanelLeft, Search, SunMedium } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Topbar = ({ onToggleSidebar, alertsCount = 0 }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="glass-panel no-print sticky top-4 z-20 flex items-center justify-between gap-4 rounded-[28px] px-4 py-4">
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={onToggleSidebar}
          whileTap={{ scale: 0.92 }}
          className="rounded-full bg-slate-900/5 p-3 text-slate-700 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-100"
        >
          <PanelLeft size={18} />
        </motion.button>
        <div className="hidden items-center gap-3 rounded-full border border-white/20 bg-white/60 px-4 py-3 dark:bg-slate-900/60 md:flex">
          <Search size={16} className="text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-300">Search projects, clients, and alerts</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
          <span className="inline-flex items-center gap-2">
            <Bell size={16} />
            {alertsCount > 0 ? `${alertsCount} alerts` : "Live dashboard"}
          </span>
        </div>
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="rounded-full bg-slate-900 px-4 py-3 text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </motion.button>
        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-full border border-white/20 bg-white/60 px-3 py-2 dark:bg-slate-900/60"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-semibold text-white">
              {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
            </div>
          )}
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">View profile</p>
          </div>
        </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default Topbar;
