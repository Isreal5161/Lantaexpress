import React from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function Topbar({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 shadow-sm">
      
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-2 sm:gap-4">
        <FaBars
          className="text-slate-600 text-lg sm:hidden cursor-pointer"
          onClick={toggleSidebar}
        />
        <h2 className="text-sm sm:text-lg font-semibold text-slate-800 truncate">
          Admin Dashboard
        </h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-6">
        <FaBell className="text-slate-500 text-lg sm:text-xl cursor-pointer" />
        <div className="flex items-center gap-1 sm:gap-2 cursor-pointer">
          <FaUserCircle className="text-xl sm:text-2xl text-slate-600" />
          <span className="text-xs sm:text-sm font-medium hidden sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}