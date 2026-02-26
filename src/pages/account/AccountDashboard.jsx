// src/pages/account/AccountDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBell,
  FaMapMarkerAlt,
  FaLock,
  FaEnvelope,
  FaCamera,
} from "react-icons/fa";

const AccountDashboard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">

      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-100"
          />
          <button className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full text-white">
            <FaCamera size={12} />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-semibold">Albert Florest</h2>
        <p className="text-gray-500 text-sm">Buyer</p>
      </div>

      {/* Menu Links */}
      <div className="mt-8 space-y-3">
        <MenuLink to="edit-profile" icon={<FaUser />} label="Edit Profile" />
        <MenuLink to="notifications" icon={<FaBell />} label="Notifications" />
        <MenuLink to="shipping" icon={<FaMapMarkerAlt />} label="Shipping Address" />
        <MenuLink to="password" icon={<FaLock />} label="Change Password" />
        <MenuLink to="email" icon={<FaEnvelope />} label="Email Address" />
      </div>
    </div>
  );
};

const MenuLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-green-600">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="text-gray-400">›</span>
  </Link>
);

export default AccountDashboard;