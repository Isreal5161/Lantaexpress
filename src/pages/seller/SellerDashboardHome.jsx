// src/pages/seller/SellerDashboardHome.jsx
import React from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdStorefront,
  MdPendingActions,
} from "react-icons/md";
import { useSellerAuth } from "../../context/SellerAuthContext";

const SellerDashboardHome = () => {
  const { seller } = useSellerAuth();

  // Placeholder stats - replace with backend data later
  const stats = [
    {
      title: "Total Revenue",
      value: "₦45600.00",
      icon: <MdAttachMoney />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "0",
      icon: <MdShoppingCart />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Products Listed",
      value: "0",
      icon: <MdStorefront />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Pending Orders",
      value: "0",
      icon: <MdPendingActions />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {seller?.brandName || "Seller"}
        </h1>
        <p className="text-gray-500">Here’s an overview of your store.</p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800">
                  {item.value}
                </h3>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg} ${item.color} text-2xl group-hover:scale-110 transition`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Sales Overview Chart */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sales Overview
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Chart coming next step...
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 transition">
                <td className="py-3 font-medium">#LX001</td>
                <td>John Doe</td>
                <td>₦0.00</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 font-medium">#LX002</td>
                <td>Jane Smith</td>
                <td>₦0.00</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboardHome;