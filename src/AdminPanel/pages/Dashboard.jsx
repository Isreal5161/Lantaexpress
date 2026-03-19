// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import StatCard from "../components/StatCard";
import { FaUsers, FaShoppingCart, FaStore, FaBoxOpen } from "react-icons/fa";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  const [totalSellers, setTotalSellers] = useState(0);
  const [pendingProducts, setPendingProducts] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [newUsers, setNewUsers] = useState([]);

  const formatPrice = (value) => {
    if (!value) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN"
    }).format(value);
  };

  useEffect(() => {
    // -----------------------------
    // USERS
    // -----------------------------
    const users = JSON.parse(localStorage.getItem("users")) || [
      { name: "John Doe", createdAt: new Date().toISOString() },
      { name: "Aisha Bello", createdAt: new Date().toISOString() },
      { name: "Michael James", createdAt: new Date().toISOString() },
    ];
    setTotalUsers(users.length);
    setNewUsers(users.slice(-5).reverse()); // last 5 users

    // -----------------------------
    // SELLERS
    // -----------------------------
    const sellers = JSON.parse(localStorage.getItem("sellers")) || [];
    setTotalSellers(sellers.length);

    // -----------------------------
    // ORDERS
    // -----------------------------
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    const today = new Date().toISOString().split("T")[0];
    const todaysOrders = orders.filter(o => o.date?.startsWith(today));
    setOrdersToday(todaysOrders.length);
    setRecentOrders(orders.slice(-5).reverse()); // last 5 orders

    // -----------------------------
    // PENDING PRODUCTS
    // -----------------------------
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    setPendingProducts(pendingCount);
  }, []);

  return (
    <AdminLayout>
      <main className="p-6">
        {/* PAGE TITLE */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
          Dashboard Overview
        </h1>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard title="Total Users" value={totalUsers} icon={<FaUsers />} />
          <StatCard title="Orders Today" value={ordersToday} icon={<FaShoppingCart />} />
          <StatCard title="Total Sellers" value={totalSellers} icon={<FaStore />} />
          <StatCard title="Pending Products" value={pendingProducts} icon={<FaBoxOpen />} />
        </div>

        {/* LOWER SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* RECENT ORDERS */}
          <div className="xl:col-span-2 bg-white border shadow-sm p-4 sm:p-6 overflow-hidden">
            <h2 className="font-semibold text-slate-800 mb-4">Recent Orders</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b">
                  <tr>
                    <th className="pb-2 pr-4">Order ID</th>
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-3 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3 pr-4">#{order.id}</td>
                        <td className="pr-4">{order.userName || order.buyer}</td>
                        <td className="pr-4">{formatPrice(order.amount || order.price)}</td>
                        <td className={`font-semibold ${
                          order.status === "Pending" ? "text-yellow-600" :
                          order.status === "Shipped" ? "text-blue-600" :
                          order.status === "Delivered" ? "text-green-600" :
                          "text-red-600"
                        }`}>{order.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* NEW USERS */}
          <div className="bg-white border shadow-sm p-4 sm:p-6">
            <h2 className="font-semibold text-slate-800 mb-4">New Users</h2>
            <ul className="space-y-4">
              {newUsers.length === 0 ? (
                <li className="text-gray-500">No new users</li>
              ) : (
                newUsers.map((user, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-slate-400 text-xs sm:text-sm">{new Date(user.createdAt).toLocaleTimeString()}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}