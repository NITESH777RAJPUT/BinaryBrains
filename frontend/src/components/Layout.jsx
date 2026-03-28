import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("tracker_sidebar") === "collapsed");

  useEffect(() => {
    localStorage.setItem("tracker_sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  return (
    <div className="min-h-screen px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
      <div className={`transition-all duration-300 ${collapsed ? "lg:ml-[112px]" : "lg:ml-[300px]"}`}>
        <Topbar onToggleSidebar={() => setCollapsed((current) => !current)} />
        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
