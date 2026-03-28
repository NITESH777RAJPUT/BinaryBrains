import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  UserCircle2,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: BriefcaseBusiness },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "AI Insights", to: "/ai-insights", icon: Bot },
  { label: "Profile", to: "/profile", icon: UserCircle2 },
  { label: "Settings", to: "/settings", icon: Settings },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 92 : 280 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="glass-panel fixed inset-y-4 left-4 z-30 hidden overflow-hidden rounded-[32px] border-white/15 lg:flex lg:flex-col"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className={`overflow-hidden transition-all ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">Freelancer Flow</p>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Profitability OS</p>
        </div>
        <motion.button
          type="button"
          onClick={onToggle}
          whileTap={{ scale: 0.92 }}
          className="rounded-full bg-slate-900/5 p-2 text-slate-700 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                      : "text-slate-600 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  {!collapsed ? <span className="text-sm font-semibold">{item.label}</span> : null}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-900/5 px-3 py-3 dark:bg-white/5">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-semibold text-white">
              {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
            </div>
          )}
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          ) : null}
        </div>
        <motion.button
          type="button"
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
        >
          <LogOut size={20} />
          {!collapsed ? <span>Logout</span> : null}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
