// src/AdminPanel/components/SellerPayments.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { categories } from "../../service/dummyCategories";

// Local storage keys
const SELLERS_KEY = "lanta_sellers";
const ORDERS_KEY = "lanta_orders";
const WITHDRAWALS_KEY = "lanta_withdrawals";

export default function SellerPayments() {
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Enrich sellers with brands from categories
  const enrichSellersWithBrands = (list) =>
    list.map((seller) => {
      const brands = categories
        .flatMap((cat) => cat.products)
        .filter((p) => p.brand.toLowerCase().includes(seller.name.toLowerCase()))
        .map((p) => p.brand);
      return { ...seller, brands: [...new Set(brands)] };
    });

  // Load data from localStorage
  useEffect(() => {
    const storedSellers = JSON.parse(localStorage.getItem(SELLERS_KEY)) || [];
    const storedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const storedWithdrawals = JSON.parse(localStorage.getItem(WITHDRAWALS_KEY)) || [];

    setSellers(enrichSellersWithBrands(storedSellers));
    setOrders(storedOrders);
    setWithdrawals(storedWithdrawals);
  }, []);

  // Helper to persist data
  const persistData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const calculateTotal = (order) =>
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateProductStatus = (orderId, idx, status) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const items = [...order.items];
        items[idx].status = status;
        return { ...order, items };
      }
      return order;
    });
    setOrders(updatedOrders);
    persistData(ORDERS_KEY, updatedOrders);
  };

  const approveOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order.items.every((i) => i.status === "Delivered")) {
      alert("Some products are not delivered yet!");
      return;
    }

    // Update seller balance
    const updatedSellers = sellers.map((s) =>
      s.name === order.seller ? { ...s, balance: s.balance + calculateTotal(order) } : s
    );
    setSellers(updatedSellers);
    persistData(SELLERS_KEY, updatedSellers);

    // Update order status
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Approved" } : o
    );
    setOrders(updatedOrders);
    persistData(ORDERS_KEY, updatedOrders);

    alert(`Order ${orderId} approved!`);
  };

  const approveWithdrawal = (id) => {
    const withdrawal = withdrawals.find((w) => w.id === id);
    if (!withdrawal) return;

    // Deduct from seller balance
    const updatedSellers = sellers.map((s) =>
      s.name === withdrawal.seller ? { ...s, balance: s.balance - withdrawal.amount } : s
    );
    setSellers(updatedSellers);
    persistData(SELLERS_KEY, updatedSellers);

    // Update withdrawal status
    const updatedWithdrawals = withdrawals.map((w) =>
      w.id === id ? { ...w, status: "Approved" } : w
    );
    setWithdrawals(updatedWithdrawals);
    persistData(WITHDRAWALS_KEY, updatedWithdrawals);

    alert(`Withdrawal ${id} approved!`);
  };

  const filteredSellers = sellers.filter((s) => {
    const term = search.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.brands?.some((b) => b.toLowerCase().includes(term));
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Seller Payments Dashboard</h1>

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
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller ID</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller Name</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Brands</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Balance (₦)</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSellers.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2">{s.id}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.brands?.join(", ") || "-"}</td>
                    <td className={`px-4 py-2 font-semibold ${s.balance < 10000 ? "text-red-600" : "text-gray-900"}`}>
                      ₦{s.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{s.bank}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-2 p-2">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Prev</button>
              <span>{currentPage} / {Math.ceil(filteredSellers.length / pageSize)}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(filteredSellers.length / pageSize)))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next</button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg">No sellers available on the site at this moment.</p>
        )}
      </section>

      {/* Pending Orders */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Seller Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No pending orders at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Products</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Total (₦)</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.seller}</td>
                    <td className="px-4 py-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-1">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <p className="text-sm">{item.name} x{item.quantity}</p>
                            <p className="text-xs text-gray-500">₦{item.price.toLocaleString()}</p>
                            <select value={item.status} onChange={(e) => updateProductStatus(order.id, idx, e.target.value)} className="text-xs mt-1 border px-1 rounded">
                              <option value="Pending">Pending</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2">₦{calculateTotal(order).toLocaleString()}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => approveOrder(order.id)}
                        disabled={!order.items.every(i => i.status === "Delivered")}
                        className={`px-3 py-1 rounded text-white transition ${order.items.every(i => i.status === "Delivered") ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Withdrawals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Withdrawal Requests</h2>
        {withdrawals.length === 0 ? (
          <p className="text-center text-gray-500">No withdrawal requests at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Request ID</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Seller</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Amount (₦)</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Bank</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="px-4 py-2">{w.id}</td>
                    <td className="px-4 py-2">{w.seller}</td>
                    <td className="px-4 py-2">₦{w.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">{w.bank}</td>
                    <td className="px-4 py-2">{w.status}</td>
                    <td className="px-4 py-2">
                      {w.status === "Pending" && (
                        <button
                          onClick={() => approveWithdrawal(w.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}