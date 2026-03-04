// src/pages/seller/SellerIncomePage.jsx
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const generateDummyIncome = () => {
  const data = [];
  for (let i = 1; i <= 12; i++) {
    data.push({
      month: `Month ${i}`,
      income: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  return data;
};

const SellerIncomePage = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const data = generateDummyIncome();
    setIncomeData(data);
    const total = data.reduce((acc, cur) => acc + cur.income, 0);
    const pending = Math.floor(total * 0.2);
    const completed = total - pending;
    setSummary({ total, pending, completed });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Income Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">₦{summary.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Pending Withdrawals</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">₦{summary.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium">Completed Withdrawals</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">₦{summary.completed}</p>
        </div>
      </div>

      {/* Income Chart */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <h3 className="text-gray-700 font-bold mb-4">Income Over the Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SellerIncomePage;