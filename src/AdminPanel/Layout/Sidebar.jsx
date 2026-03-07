import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaTruck,
  FaBoxOpen
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-4 sm:p-5 border-b border-green-600">
        <h1 className="text-lg sm:text-xl font-bold truncate">LantaExpress Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-2">
        {[
          { to: "/AdminPanel/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
          { to: "/AdminPanel/users", icon: <FaUsers />, label: "Users" },
          { to: "/AdminPanel/sellers", icon: <FaStore />, label: "Sellers" },
          { to: "/AdminPanel/products", icon: <FaBoxOpen />, label: "Products" },
          { to: "/AdminPanel/logistics", icon: <FaTruck />, label: "Logistics" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-green-600 rounded"
          >
            <span className="text-sm sm:text-base">{item.icon}</span>
            <span className="text-sm sm:text-base">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}