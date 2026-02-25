// AccountHeader.jsx
import React from "react";
import { FaBell } from "react-icons/fa";

const AccountHeader = () => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img
          src="/lantalogo1.jpg"
          alt="Logo"
          className="h-10 w-10 rounded"
        />
        <span className="text-lg font-bold text-gray-900">My Account</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaBell className="text-gray-700 text-lg" />
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default AccountHeader;