// src/AdminPanel/components/SellerPayments.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { getAdminSellerPayments, updateAdminPlatformFees, updateAdminWithdrawalStatus } from "../../api/sellerFinance";
import { PageLoadErrorState, TablePanelSkeleton } from "../../components/LoadingSkeletons";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function SellerPayments() {
  const [sellers, setSellers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [feeSettings, setFeeSettings] = useState({ productChargePercent: 0, withdrawalChargePercent: 0 });
  const [savingFees, setSavingFees] = useState(false);

  const loadPayments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setPageError(new Error("Admin login required."));
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPageError(null);
      const data = await getAdminSellerPayments(token);
      setSellers(data.sellers || []);
      setWithdrawals(data.pendingWithdrawals || []);
      setFeeSettings(data.feeSettings || { productChargePercent: 0, withdrawalChargePercent: 0 });
    } catch (error) {
      console.error("Failed to load seller payment data:", error);
      setSellers([]);
      setWithdrawals([]);
      setPageError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredSellers = useMemo(() => sellers.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.sellerName?.toLowerCase().includes(term) ||
      s.contactName?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term)
    );
  }), [search, sellers]);

  const handleWithdrawalAction = async (withdrawalId, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setProcessingId(withdrawalId);
      setError("");
      await updateAdminWithdrawalStatus(withdrawalId, { status }, token);
      const refreshed = await getAdminSellerPayments(token);
      setSellers(refreshed.sellers || []);
      setWithdrawals(refreshed.pendingWithdrawals || []);
      setFeeSettings(refreshed.feeSettings || { productChargePercent: 0, withdrawalChargePercent: 0 });
    } catch (error) {
      console.error(error);
      alert(error.message || `Failed to ${status.toLowerCase()} withdrawal`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveFees = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setSavingFees(true);
      setError("");
      const updated = await updateAdminPlatformFees(feeSettings, token);
      setFeeSettings(updated.feeSettings || { productChargePercent: 0, withdrawalChargePercent: 0 });
      const refreshed = await getAdminSellerPayments(token);
      setSellers(refreshed.sellers || []);
      setWithdrawals(refreshed.pendingWithdrawals || []);
      setFeeSettings(refreshed.feeSettings || updated.feeSettings || { productChargePercent: 0, withdrawalChargePercent: 0 });
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update platform fees");
    } finally {
      setSavingFees(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-w-0 space-y-8">
      <div>
      <h1 className="mb-3 text-2xl font-bold">Seller Payments Dashboard</h1>
      <p className="max-w-4xl text-sm text-gray-500">
        Completed orders increase seller revenue. Revenue becomes withdrawable only after customer receipt is confirmed. Approved withdrawals reduce the seller’s available payout balance.
      </p>
      </div>

      {error && !pageError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? <TablePanelSkeleton columns={7} rows={6} mobileCards={4} /> : pageError ? (
      <PageLoadErrorState error={pageError} onRefresh={loadPayments} />
      ) : (
      <>

      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Platform Fee Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Set the percentage deducted from completed product earnings and the percentage charged on withdrawal requests. Use 0 for free charges.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:max-w-3xl">
          <label className="block text-sm text-gray-700">
            <span className="mb-2 block font-medium">Product earnings charge (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={feeSettings.productChargePercent}
              onChange={(e) => setFeeSettings((current) => ({ ...current, productChargePercent: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm text-gray-700">
            <span className="mb-2 block font-medium">Withdrawal charge (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={feeSettings.withdrawalChargePercent}
              onChange={(e) => setFeeSettings((current) => ({ ...current, withdrawalChargePercent: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveFees}
            disabled={savingFees}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {savingFees ? "Saving..." : "Save Fee Settings"}
          </button>
          <p className="text-sm text-gray-500">
            {Number(feeSettings.productChargePercent) > 0 ? `${feeSettings.productChargePercent}% product charge` : "Free product charge"} and {Number(feeSettings.withdrawalChargePercent) > 0 ? `${feeSettings.withdrawalChargePercent}% withdrawal charge` : "free withdrawal charge"}.
          </p>
        </div>
      </section>

      {/* Seller Balances */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Seller Balances</h2>
        <input
          type="text"
          placeholder="Search by seller or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3 mb-4"
        />

        {filteredSellers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller ID</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller Name</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Email</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Total Revenue</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Pending Balance</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Withdrawable</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Completed Withdrawals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSellers.map((s) => (
                  <tr key={s.sellerId}>
                    <td className="px-4 py-2">{s.sellerId}</td>
                    <td className="px-4 py-2">{s.sellerName}</td>
                    <td className="px-4 py-2">{s.email || "-"}</td>
                    <td className="px-4 py-2 font-semibold text-green-600">{formatCurrency(s.totalRevenue)}</td>
                    <td className="px-4 py-2 font-semibold text-yellow-600">{formatCurrency(s.pendingBalance)}</td>
                    <td className="px-4 py-2 font-semibold text-blue-600">{formatCurrency(s.withdrawableBalance)}</td>
                    <td className="px-4 py-2 font-semibold text-slate-800">{formatCurrency(s.completedWithdrawals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg">No sellers available on the site at this moment.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Seller Finance Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Seller Revenue</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(filteredSellers.reduce((sum, seller) => sum + (seller.totalRevenue || 0), 0))}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Pending Seller Balance</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {formatCurrency(filteredSellers.reduce((sum, seller) => sum + (seller.pendingBalance || 0), 0))}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Withdrawable Balance</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {formatCurrency(filteredSellers.reduce((sum, seller) => sum + (seller.withdrawableBalance || 0), 0))}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Pending Withdrawal Requests</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {formatCurrency(withdrawals.reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0))}
            </p>
          </div>
        </div>
      </section>

      {/* Withdrawals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Withdrawal Requests</h2>
        {withdrawals.length === 0 ? (
          <p className="text-center text-gray-500">No withdrawal requests at the moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Request ID</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Amount (₦)</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Bank</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Requested</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="px-4 py-2">{w.id}</td>
                    <td className="px-4 py-2">
                      <p className="font-medium text-gray-900">{w.sellerName}</p>
                      <p className="text-xs text-gray-500">{w.sellerEmail}</p>
                    </td>
                    <td className="px-4 py-2 font-semibold">{formatCurrency(w.amount)}</td>
                    <td className="px-4 py-2">
                      <p>{w.bankName || w.method}</p>
                      {w.accountNumber ? <p className="text-xs text-gray-500">{w.accountNumber}</p> : null}
                    </td>
                    <td className="px-4 py-2">{new Date(w.requestedAt || w.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">{w.status}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWithdrawalAction(w.id, "Approved")}
                          disabled={processingId === w.id}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleWithdrawalAction(w.id, "Rejected")}
                          disabled={processingId === w.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </>
      )}
      </div>
    </AdminLayout>
  );
}