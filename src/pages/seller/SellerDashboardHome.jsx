// src/pages/seller/SellerDashboardHome.jsx
import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdStorefront,
  MdPendingActions,
} from "react-icons/md";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://lantaxpressbackend.onrender.com/api";

const SellerDashboardHome = () => {
  const { seller } = useSellerAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    productsListed: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!seller?.email) return;

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("sellerToken");

        const response = await axios.get(`${API_URL}/seller/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        if (data) {
          setStats({
            totalRevenue: data.totalRevenue || 0,
            totalOrders: data.totalOrders || 0,
            productsListed: data.productsListed || 0,
            pendingOrders: data.pendingOrders || 0,
            recentOrders: data.recentOrders || [],
          });
          setChartData(data.dailyRevenue || []);
          return;
        }
      } catch (error) {
        console.warn("Backend not ready, falling back to localStorage", error);
      }

      // -----------------------------
      // Fallback to localStorage
      // -----------------------------
      const allOrders = JSON.parse(localStorage.getItem("user_orders")) || [];
      const sellerOrders = allOrders.filter(o => o.sellerEmail === seller.email);

      const totalRevenue = sellerOrders.reduce((acc, curr) => acc + (curr.amount || curr.price || 0), 0);
      const totalOrders = sellerOrders.length;
      const pendingOrders = sellerOrders.filter(o => o.status === "Pending").length;

      const allProducts = JSON.parse(localStorage.getItem("products")) || [];
      const productsListed = allProducts.filter(p => p.sellerEmail === seller.email).length;

      const recentOrders = sellerOrders.slice(-5).reverse();

      setStats({
        totalRevenue,
        totalOrders,
        productsListed,
        pendingOrders,
        recentOrders,
      });

      const today = new Date();
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
      }).reverse();

      const dailyRevenue = last7Days.map(day => {
        const dayRevenue = sellerOrders
          .filter(o => o.date?.startsWith(day))
          .reduce((acc, curr) => acc + (curr.amount || curr.price || 0), 0);
        return { date: day, revenue: dayRevenue };
      });

      setChartData(dailyRevenue);
    };

    fetchDashboard();
  }, [seller]);

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
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">
                ₦{stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-green-600 text-2xl group-hover:scale-110 transition">
              <MdAttachMoney />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{stats.totalOrders}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-2xl group-hover:scale-110 transition">
              <MdShoppingCart />
            </div>
          </div>
        </div>

        {/* Products Listed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products Listed</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{stats.productsListed}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 text-2xl group-hover:scale-110 transition">
              <MdStorefront />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{stats.pendingOrders}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 text-2xl group-hover:scale-110 transition">
              <MdPendingActions />
            </div>
          </div>
        </div>
      </section>

      {/* Sales Overview Chart */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
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
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 font-medium">#{order.id}</td>
                    <td>{order.userName || order.buyer}</td>
                    <td>₦{(order.amount || order.price || 0).toLocaleString()}</td>
                    <td>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-600" :
                        order.status === "Delivered" ? "bg-green-100 text-green-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboardHome;