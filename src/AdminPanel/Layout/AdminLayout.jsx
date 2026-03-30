import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { clearAdminSession, getAdminSession, purgeInvalidAdminSession } from "../utils/adminSession";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    if (!purgeInvalidAdminSession()) {
      navigate("/admin/login", { replace: true });
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (!purgeInvalidAdminSession()) {
        navigate("/admin/login", { replace: true });
      }
    }, 60000);

    const { expiresAt } = getAdminSession();
    const timeoutDuration = expiresAt ? Math.max(expiresAt - Date.now(), 0) : 0;
    const timeout = window.setTimeout(() => {
      if (!purgeInvalidAdminSession()) {
        navigate("/admin/login", { replace: true });
      }
    }, timeoutDuration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-100">

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-green-700 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 sm:translate-x-0 sm:static sm:flex sm:flex-col w-48 sm:w-56`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}