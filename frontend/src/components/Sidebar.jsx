import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: BriefcaseBusiness },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "AI Insights", to: "/ai-insights", icon: Bot },
  { label: "Settings", to: "/settings", icon: Settings },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`glass-panel fixed inset-y-4 left-4 z-30 hidden overflow-hidden rounded-[32px] border-white/15 transition-all duration-300 lg:flex lg:flex-col ${
        collapsed ? "w-[92px]" : "w-[280px]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className={`overflow-hidden transition-all ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">Freelancer Flow</p>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Profitability OS</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full bg-slate-900/5 p-2 text-slate-700 transition hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
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
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
        >
          <LogOut size={20} />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

