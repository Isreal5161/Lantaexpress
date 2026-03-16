import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaTruck,
  FaBoxOpen,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";

export default function Sidebar() {

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-4 sm:p-5 border-b border-green-600">
        <h1 className="text-lg sm:text-xl font-bold truncate">
          LantaExpress Admin
        </h1>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-2">

        {/* Dashboard */}
        <Link
          to="/AdminPanel/dashboard"
          className="flex items-center gap-3 p-3 hover:bg-green-600 rounded"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        {/* USERS */}
        <div>
          <button
            onClick={() => toggleMenu("users")}
            className="flex items-center justify-between w-full p-3 hover:bg-green-600 rounded"
          >
            <div className="flex items-center gap-3">
              <FaUsers />
              <span>Users</span>
            </div>
            {openMenu === "users" ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openMenu === "users" && (
            <div className="ml-8 mt-1 space-y-1">
               <Link
                to="/AdminPanel/users"
                className="block p-2 hover:bg-green-600 rounded"
              >
                All Users
              </Link>

             

              <Link
                to="/AdminPanel/users/tracking"
                className="block p-2 hover:bg-green-600 rounded"
              >
                Trackings
              </Link>
            </div>
          )}
        </div>

        {/* SELLERS */}
        <div>
          <button
            onClick={() => toggleMenu("sellers")}
            className="flex items-center justify-between w-full p-3 hover:bg-green-600 rounded"
          >
            <div className="flex items-center gap-3">
              <FaStore />
              <span>Sellers</span>
            </div>
            {openMenu === "sellers" ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openMenu === "sellers" && (
            <div className="ml-8 mt-1 space-y-1">

              <Link
                to="/AdminPanel/sellers"
                className="block p-2 hover:bg-green-600 rounded"
              >
                All Sellers
              </Link>

              <Link
                to="/AdminPanel/sellers/orders"
                className="block p-2 hover:bg-green-600 rounded"
              >
                Seller Orders
              </Link>

              <Link
                to="/AdminPanel/sellers/products"
                className="block p-2 hover:bg-green-600 rounded"
              >
                Seller Products
              </Link>

              <Link
                to="/AdminPanel/sellers/payments"
                className="block p-2 hover:bg-green-600 rounded"
              >
                Seller Payments
              </Link>

              <Link
                to="/AdminPanel/sellers/requests"
                className="block p-2 hover:bg-green-600 rounded"
              >
                New Seller Requests
              </Link>

            </div>
          )}
        </div>

        {/* PRODUCTS */}
        <Link
          to="/AdminPanel/products"
          className="flex items-center gap-3 p-3 hover:bg-green-600 rounded"
        >
          <FaBoxOpen />
          <span>Products</span>
        </Link>

        {/* LOGISTICS */}
        <div>
          <button
            onClick={() => toggleMenu("logistics")}
            className="flex items-center justify-between w-full p-3 hover:bg-green-600 rounded"
          >
            <div className="flex items-center gap-3">
              <FaTruck />
              <span>Logistics</span>
            </div>
            {openMenu === "logistics" ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openMenu === "logistics" && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                to="/AdminPanel/logistics"
                className="block p-2 hover:bg-green-600 rounded"
              >
                All Logistics
              </Link>

              <Link
                to="/AdminPanel/logistics/location"
                className="block p-2 hover:bg-green-600 rounded"
              >
                Order Locations
              </Link>

              <Link
                to="/AdminPanel/logistics/requests"
                className="block p-2 hover:bg-green-600 rounded"
              >
                Logistics Requests
              </Link>

            </div>
          )}
        </div>

      </nav>
    </div>
  );
}