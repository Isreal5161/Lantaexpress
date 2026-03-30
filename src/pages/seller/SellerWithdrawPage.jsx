// src/pages/seller/SellerWithdrawPage.jsx
import React, { useEffect, useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  createSellerWithdrawal,
  getSellerFinanceSummary,
  getSellerWithdrawals,
} from "../../api/sellerFinance";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const SellerWithdrawPage = () => {
  const [summary, setSummary] = useState({
    withdrawableBalance: 0,
    totalRevenue: 0,
    pendingBalance: 0,
    pendingWithdrawalRequests: 0,
    completedWithdrawals: 0,
  });
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feeSettings, setFeeSettings] = useState({
    withdrawalChargePercent: 0,
    productChargePercent: 0,
  });
  const [confirmWithdrawalOpen, setConfirmWithdrawalOpen] = useState(false);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null);

  useEffect(() => {
    const loadFinanceData = async () => {
      const token = localStorage.getItem("sellerToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const [summaryData, withdrawalData] = await Promise.all([
          getSellerFinanceSummary(token),
          getSellerWithdrawals(token),
        ]);

        setSummary({
          withdrawableBalance: summaryData.withdrawableBalance || 0,
          totalRevenue: summaryData.totalRevenue || 0,
          pendingBalance: summaryData.pendingBalance || 0,
          pendingWithdrawalRequests: summaryData.pendingWithdrawalRequests || 0,
          completedWithdrawals: summaryData.completedWithdrawals || 0,
        });
        setFeeSettings(summaryData.feeSettings || { withdrawalChargePercent: 0, productChargePercent: 0 });
        setWithdrawals(withdrawalData || []);
      } catch (error) {
        console.error("Failed to load withdrawal data:", error);
        setError(error.message || "Failed to load withdrawal data.");
      } finally {
        setLoading(false);
      }
    };

    loadFinanceData();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("sellerToken");
    const parsedAmount = Number(amount);

    if (!token) {
      alert("Please log in again.");
      return;
    }

    if (!parsedAmount || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (parsedAmount > summary.withdrawableBalance) {
      alert("Insufficient balance");
      return;
    }

    const chargePercent = Number(feeSettings.withdrawalChargePercent) || 0;
    const chargeAmount = (parsedAmount * chargePercent) / 100;
    const payoutAmount = Math.max(parsedAmount - chargeAmount, 0);

    setPendingWithdrawal({
      amount: parsedAmount,
      method,
      bankName,
      accountName,
      accountNumber,
      chargePercent,
      chargeAmount,
      payoutAmount,
    });
    setConfirmWithdrawalOpen(true);
  };

  const confirmWithdraw = async () => {
    const token = localStorage.getItem("sellerToken");
    if (!token || !pendingWithdrawal) return;

    try {
      setSubmitting(true);
      setError("");
      const data = await createSellerWithdrawal(
        {
          amount: pendingWithdrawal.amount,
          method: pendingWithdrawal.method,
          bankName: pendingWithdrawal.bankName,
          accountName: pendingWithdrawal.accountName,
          accountNumber: pendingWithdrawal.accountNumber,
        },
        token
      );

      const [summaryData, withdrawalData] = await Promise.all([
        getSellerFinanceSummary(token),
        getSellerWithdrawals(token),
      ]);

      setSummary({
        withdrawableBalance: summaryData.withdrawableBalance || 0,
        totalRevenue: summaryData.totalRevenue || 0,
        pendingBalance: summaryData.pendingBalance || 0,
        pendingWithdrawalRequests: summaryData.pendingWithdrawalRequests || 0,
        completedWithdrawals: summaryData.completedWithdrawals || 0,
      });
      setFeeSettings(summaryData.feeSettings || { withdrawalChargePercent: 0, productChargePercent: 0 });
      setWithdrawals(withdrawalData || []);
      alert(data.message || "Withdrawal request submitted successfully");
      setAmount("");
      setBankName("");
      setAccountName("");
      setAccountNumber("");
      setConfirmWithdrawalOpen(false);
      setPendingWithdrawal(null);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to create withdrawal request");
      alert(error.message || "Failed to create withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow">Loading withdrawal data...</div>;
  }

  return (
    <div className="space-y-6">

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800">Withdraw Funds</h2>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Withdrawable Balance</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.withdrawableBalance)}</p>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Pending Balance</p>
            <p className="text-3xl font-bold text-amber-600">{formatCurrency(summary.pendingBalance)}</p>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Completed Withdrawals</p>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(summary.completedWithdrawals)}</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <form
        onSubmit={handleWithdraw}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-700">Request Withdrawal</h3>
        <p className="text-sm text-gray-500">
          Only revenue from completed orders is withdrawable. Orders still in transit remain in pending balance.
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {Number(feeSettings.withdrawalChargePercent) > 0
            ? `Withdrawal charge: ${feeSettings.withdrawalChargePercent}% will be deducted from each payout request.`
            : "Withdrawal charge: Free. No charge will be deducted from your payout request."}
        </div>

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

        {method === "Bank Transfer" && (
          <>
            <div>
              <label className="block text-gray-600 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-medium disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Request Withdrawal"}
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
                  <th className="px-4 py-2 border">Charge / Net Payout</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{new Date(w.requestedAt || w.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 border">{formatCurrency(w.amount)}</td>
                    <td className="px-4 py-2 border">{w.bankName || w.method}</td>
                    <td className="px-4 py-2 border text-sm text-gray-500">
                      {Number(w.chargePercent || 0) > 0 ? `${w.chargePercent}% fee / ${formatCurrency(w.payoutAmount)}` : "Free / full payout"}
                    </td>
                    <td className={`px-4 py-2 border font-semibold ${
                      w.status === "Pending" ? "text-yellow-600" :
                      w.status === "Approved" ? "text-green-600" : "text-red-600"
                    }`}>{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmWithdrawalOpen}
        title="Confirm Withdrawal Request"
        message={pendingWithdrawal
          ? (pendingWithdrawal.chargePercent > 0
            ? `A withdrawal charge of ${pendingWithdrawal.chargePercent}% (${formatCurrency(pendingWithdrawal.chargeAmount)}) will apply. You will receive ${formatCurrency(pendingWithdrawal.payoutAmount)}.`
            : `Withdrawal is free. You will receive the full ${formatCurrency(pendingWithdrawal.amount)}.`)
          : ""}
        onCancel={() => {
          if (submitting) return;
          setConfirmWithdrawalOpen(false);
          setPendingWithdrawal(null);
        }}
        onConfirm={confirmWithdraw}
        confirmLabel="Continue"
        cancelLabel="Cancel"
        loading={submitting}
      />

    </div>
  );
};

export default SellerWithdrawPage;