// src/pages/seller/SellerDashboardHome.jsx
import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdStorefront,
  MdPendingActions,
  MdAccountBalanceWallet,
  MdOutlinePayments,
} from "react-icons/md";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { DashboardOverviewSkeleton, PageLoadErrorState } from "../../components/LoadingSkeletons";
import { getSellerFinanceSummary } from "../../api/sellerFinance";
import { getSellerApprovalLabel, getSellerApprovalMessage, isSellerApproved } from "../../utils/sellerApproval";

const API_URL = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const SellerDashboardHome = () => {
  const { seller } = useSellerAuth();
  const sellerApproved = isSellerApproved(seller);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    productsListed: 0,
    productsPending: 0,
    pendingOrders: 0,
    recentOrders: [],
    pendingBalance: 0,
    withdrawableBalance: 0,
    completedWithdrawals: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const fetchDashboard = async () => {
    if (!seller?.email) {
      setLoading(false);
      setPageError(null);
      return;
    }

    setLoading(true);
    setPageError(null);

    try {
      const token = localStorage.getItem("sellerToken");

      const response = await axios.get(`${API_URL}/seller/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const financeSummary = await getSellerFinanceSummary(token);
      const data = response.data;

      setStats({
        totalRevenue: financeSummary.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        productsListed: data.productsListed || 0,
        productsPending: data.productsPending || 0,
        pendingOrders: data.pendingOrders || 0,
        recentOrders: data.recentOrders || [],
        pendingBalance: financeSummary.pendingBalance || 0,
        withdrawableBalance: financeSummary.withdrawableBalance || 0,
        completedWithdrawals: financeSummary.completedWithdrawals || 0,
      });
      setChartData(financeSummary.incomeTrend?.length ? financeSummary.incomeTrend : data.dailyRevenue || []);
    } catch (error) {
      console.error("Failed to load seller dashboard:", error);
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        productsListed: 0,
        productsPending: 0,
        pendingOrders: 0,
        recentOrders: [],
        pendingBalance: 0,
        withdrawableBalance: 0,
        completedWithdrawals: 0,
      });
      setChartData([]);
      setPageError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [seller?.email]);

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  if (pageError) {
    return <PageLoadErrorState error={pageError} onRefresh={fetchDashboard} />;
  }

  return (
    <div className="min-w-0 space-y-8">

      {!sellerApproved && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{getSellerApprovalLabel(seller)}</h2>
              <p className="text-sm">{getSellerApprovalMessage(seller)}</p>
            </div>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700">
              Waiting for admin review
            </span>
          </div>
        </section>
      )}

      {/* Welcome */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {seller?.brandName || "Seller"}
        </h1>
        <p className="text-gray-500">Here’s an overview of your store.</p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">
                {formatCurrency(stats.totalRevenue)}
              </h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-green-600 text-2xl group-hover:scale-110 transition">
              <MdAttachMoney />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Balance</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(stats.pendingBalance)}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 text-2xl group-hover:scale-110 transition">
              <MdPendingActions />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Withdrawable</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(stats.withdrawableBalance)}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 text-2xl group-hover:scale-110 transition">
              <MdAccountBalanceWallet />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Withdrawals</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(stats.completedWithdrawals)}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-2xl group-hover:scale-110 transition">
              <MdOutlinePayments />
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

        {/* Pending Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Products</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-800">{stats.productsPending ?? 0}</h3>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 text-2xl group-hover:scale-110 transition">
              <MdPendingActions />
            </div>
          </div>
        </div>
      </section>

      {/* Sales Overview Chart */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
        <div className="min-h-[260px] h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartData[0]?.month ? "month" : "date"} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey={chartData[0]?.income != null ? "income" : "revenue"} stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              No revenue data yet.
            </div>
          )}
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
                    <td>{formatCurrency(order.amount || order.price || 0)}</td>
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