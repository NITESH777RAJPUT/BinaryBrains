import { Bell, MoonStar, PanelLeft, Search, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Topbar = ({ onToggleSidebar, alertsCount = 0 }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-panel no-print sticky top-4 z-20 flex items-center justify-between gap-4 rounded-[28px] px-4 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-full bg-slate-900/5 p-3 text-slate-700 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-100"
        >
          <PanelLeft size={18} />
        </button>
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
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full bg-slate-900 px-4 py-3 text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
