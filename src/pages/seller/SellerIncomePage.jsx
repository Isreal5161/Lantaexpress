// src/pages/seller/SellerIncomePage.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSellerFinanceSummary } from "../../api/sellerFinance";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const SellerIncomePage = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    pendingBalance: 0,
    withdrawableBalance: 0,
    completedWithdrawals: 0,
    pendingWithdrawalRequests: 0,
    recentSettlements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinance = async () => {
      const token = localStorage.getItem("sellerToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getSellerFinanceSummary(token);
        setIncomeData(data.incomeTrend || []);
        setSummary({
          totalRevenue: data.totalRevenue || 0,
          pendingBalance: data.pendingBalance || 0,
          withdrawableBalance: data.withdrawableBalance || 0,
          completedWithdrawals: data.completedWithdrawals || 0,
          pendingWithdrawalRequests: data.pendingWithdrawalRequests || 0,
          recentSettlements: data.recentSettlements || [],
        });
      } catch (error) {
        console.error("Failed to load seller finance summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFinance();
  }, []);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow">Loading income data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Income Dashboard</h2>
      <p className="text-sm text-gray-500">
        Revenue moves into withdrawable balance only after the customer confirms receipt or the order reaches completed status.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(summary.totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Pending Balance</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{formatCurrency(summary.pendingBalance)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Withdrawable Balance</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(summary.withdrawableBalance)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Completed Withdrawals</h3>
          <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(summary.completedWithdrawals)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 font-bold mb-2">Pending Withdrawal Requests</h3>
          <p className="text-2xl font-bold text-amber-600">{formatCurrency(summary.pendingWithdrawalRequests)}</p>
          <p className="mt-2 text-sm text-gray-500">These requests have been submitted and are awaiting admin approval.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 font-bold mb-4">Recent Settled Orders</h3>
          {summary.recentSettlements.length === 0 ? (
            <p className="text-sm text-gray-500">No completed orders yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.recentSettlements.map((item) => (
                <div key={`${item.id}-${item.receivedAt}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.id}</p>
                    <p className="text-xs text-slate-500">{new Date(item.receivedAt).toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Income Chart */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <h3 className="text-gray-700 font-bold mb-4">Settled Income Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SellerIncomePage;