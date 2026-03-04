// src/layouts/seller/SellerDashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  MdDashboard,
  MdStorefront,
  MdShoppingCart,
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdSettings,
  MdPerson,
} from "react-icons/md";
import SellerHeader from "../../components/seller/SellerHeader";

const sidebarLinks = [
  { name: "Dashboard", path: "/seller-dashboard", icon: <MdDashboard /> },
  { name: "Products", path: "/seller-dashboard/products", icon: <MdStorefront /> },
  { name: "Orders", path: "/seller-dashboard/orders", icon: <MdShoppingCart /> },
  { name: "Income", path: "/seller-dashboard/income", icon: <MdAttachMoney /> },
  { name: "Withdraw", path: "/seller-dashboard/withdraw", icon: <MdAccountBalanceWallet /> },
  { name: "Profile", path: "/seller-dashboard/profile", icon: <MdPerson /> },
  { name: "Settings", path: "/seller-dashboard/settings", icon: <MdSettings /> },
];

const SellerDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const seller = JSON.parse(localStorage.getItem("currentSeller")) || { brandName: "Your Brand" };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-green-50 to-white shadow-lg transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 text-center border-b">
          <h1 className="font-extrabold text-xl text-green-700">{seller.brandName}</h1>
          <p className="text-gray-500 text-sm">Seller Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-green-500 text-white font-semibold shadow-md transform scale-105"
                    : "text-gray-700 hover:bg-green-100 hover:shadow-sm"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden z-40"
        />
      )}

      {/* Right content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <SellerHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerDashboardLayout;