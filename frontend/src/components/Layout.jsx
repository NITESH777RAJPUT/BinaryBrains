import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <Navbar />
      <main className="mt-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout;

