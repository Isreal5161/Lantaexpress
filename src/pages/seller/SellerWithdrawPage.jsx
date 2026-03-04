// src/pages/seller/SellerWithdrawPage.jsx
import React, { useState, useEffect } from "react";

const SellerWithdrawPage = () => {
  const [balance, setBalance] = useState(0); // Seller available balance
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [withdrawals, setWithdrawals] = useState([]);

  // Simulate fetching balance and withdrawals from backend
  useEffect(() => {
    // Example: fetch from backend API
    const sellerData = JSON.parse(localStorage.getItem("currentSeller")) || {};
    setBalance(sellerData.balance || 1000); // Default balance for demo

    const pastWithdrawals = JSON.parse(localStorage.getItem("withdrawals")) || [];
    setWithdrawals(pastWithdrawals);
  }, []);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    const newWithdrawal = {
      id: Date.now(),
      amount: parseFloat(amount),
      method,
      date: new Date().toLocaleString(),
      status: "Pending",
    };

    const updatedWithdrawals = [newWithdrawal, ...withdrawals];
    setWithdrawals(updatedWithdrawals);
    localStorage.setItem("withdrawals", JSON.stringify(updatedWithdrawals));
    setBalance(balance - amount);
    alert(`Withdrawal of ₦${amount} requested successfully`);
    setAmount("");
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-gray-800">Withdraw Funds</h2>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
        <div>
          <p className="text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-green-600">₦{balance}</p>
        </div>
        <div className="hidden sm:block">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
            alt="Wallet"
            className="h-12 w-12"
          />
        </div>
      </div>

      {/* Withdrawal Form */}
      <form
        onSubmit={handleWithdraw}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-700">Request Withdrawal</h3>

        <div>
          <label className="block text-gray-600 mb-1">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Withdrawal Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option>Bank Transfer</option>
            <option>PayPal</option>
            <option>Crypto Wallet</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-medium"
        >
          Withdraw
        </button>
      </form>

      {/* Withdrawal History */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Withdrawal History</h3>

        {withdrawals.length === 0 ? (
          <p className="text-gray-500">No withdrawals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Amount (₦)</th>
                  <th className="px-4 py-2 border">Method</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{w.date}</td>
                    <td className="px-4 py-2 border">{w.amount}</td>
                    <td className="px-4 py-2 border">{w.method}</td>
                    <td className={`px-4 py-2 border font-semibold ${
                      w.status === "Pending" ? "text-yellow-600" :
                      w.status === "Completed" ? "text-green-600" : "text-red-600"
                    }`}>{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default SellerWithdrawPage;