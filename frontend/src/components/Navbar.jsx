import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="glass-panel no-print sticky top-4 z-20 flex flex-col gap-4 rounded-[28px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to="/dashboard" className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
          Freelancer <span className="gradient-title">Profitability Tracker</span>
        </Link>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Follow margin, protect your time, and surface smarter pricing moves.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/dashboard"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            location.pathname === "/dashboard"
              ? "bg-teal-500 text-white"
              : "bg-slate-900/5 text-slate-700 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          }`}
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <div className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          {user?.name}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

