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
import { useSellerAuth } from "../../context/SellerAuthContext";
import { getSellerApprovalLabel, isSellerApproved } from "../../utils/sellerApproval";

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
  const { seller } = useSellerAuth();
  const sellerLogo = seller?.logo || "/lantalogo1.jpg";
  const sellerApproved = isSellerApproved(seller);

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-100">

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-green-50 to-white shadow-lg transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="border-b p-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm">
            <img
              src={sellerLogo}
              alt={seller?.brandName || "Seller logo"}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-green-200"
            />
            <div className="min-w-0 text-left">
              <h1 className="truncate font-extrabold text-xl text-green-700">
                {seller?.brandName || "Your Brand"}
              </h1>
              <p className="text-gray-500 text-sm">Seller Dashboard</p>
              {!sellerApproved && (
                <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                  {getSellerApprovalLabel(seller)}
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((link) => (
            sellerApproved || link.path === "/seller-dashboard" ? (
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
            ) : (
              <div
                key={link.name}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-gray-400"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </div>
            )
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

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <SellerHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboardLayout;