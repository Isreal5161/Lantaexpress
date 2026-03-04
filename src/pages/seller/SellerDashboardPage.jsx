import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  MdDashboard,
  MdStorefront,
  MdShoppingCart,
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdSettings,
  MdBarChart,
} from "react-icons/md";
import SellerHeader from "../../components/seller/SellerHeader";

const sidebarLinks = [
  { name: "Dashboard", path: "/seller-dashboard", icon: <MdDashboard /> },
  { name: "Products", path: "/seller-dashboard/products", icon: <MdStorefront /> },
  { name: "Orders", path: "/seller-dashboard/orders", icon: <MdShoppingCart /> },
  { name: "Income", path: "/seller-dashboard/income", icon: <MdAttachMoney /> },
  { name: "Withdraw", path: "/seller-dashboard/withdraw", icon: <MdAccountBalanceWallet /> },
  { name: "Analytics", path: "/seller-dashboard/analytics", icon: <MdBarChart /> },
  { name: "Settings", path: "/seller-dashboard/settings", icon: <MdSettings /> },
];

const SellerDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const seller = JSON.parse(localStorage.getItem("currentSeller")) || {
    brandName: "Your Brand",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="p-6 text-center border-b">
          <h1 className="font-bold text-xl">{seller.brandName}</h1>
          <p className="text-gray-500 text-sm">Seller Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-green-200 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-green-100"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden z-40"
        />
      )}

      {/* Right Section */}
      <div className="flex-1 flex flex-col md:ml-64">

        <SellerHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SellerDashboardLayout;