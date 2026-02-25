// AccountSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const AccountSidebar = () => {
  const linkClasses = "block px-4 py-2 rounded hover:bg-green-50 font-medium";

  return (
    <aside className="w-56 bg-white shadow-md p-4 hidden md:block">
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/account/profile"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-100 text-green-700" : "text-gray-700"}`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/account/orders"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-100 text-green-700" : "text-gray-700"}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/account/settings"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-100 text-green-700" : "text-gray-700"}`
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AccountSidebar;