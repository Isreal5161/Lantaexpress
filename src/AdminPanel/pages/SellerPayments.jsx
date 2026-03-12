// src/AdminPanel/components/SellerPayments.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { categories } from "../../service/dummyCategories";

// Sample sellers (local storage fallback)
const mockSellers = [
  { id: "S001", name: "Chinedu Store", balance: 120000, bank: "GTBank - 1234567890" },
  { id: "S002", name: "Ada Boutique", balance: 80000, bank: "Zenith - 9876543210" },
];

// Sample orders from categories
const generateMockOrders = () => [
  {
    id: "O1001",
    seller: "Chinedu Store",
    status: "Pending",
    items: [
      { ...categories[0].products[0], quantity: 2, status: "Pending" }, // Wireless Headphones
      { ...categories[1].products[0], quantity: 1, status: "Pending" }, // Designer Handbag
    ],
  },
  {
    id: "O1002",
    seller: "Ada Boutique",
    status: "Pending",
    items: [
      { ...categories[4].products[2], quantity: 1, status: "Delivered" }, // Tecno Spark 40 Pro+
    ],
  },
];

// Sample withdrawals
const mockWithdrawals = [
  { id: "W001", seller: "Chinedu Store", amount: 50000, status: "Pending", bank: "GTBank - 1234567890" },
];

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

  useEffect(() => {
    const localSellers = JSON.parse(localStorage.getItem("lanta_sellers")) || mockSellers;
    setSellers(enrichSellersWithBrands(localSellers));
    setOrders(generateMockOrders());
    setWithdrawals(mockWithdrawals);

    // TODO: fetch from backend when ready
    // fetch("/api/sellers").then(res => res.json()).then(data => setSellers(enrichSellersWithBrands(data)));
  }, []);

  // Calculate order total
  const calculateTotal = (order) => order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update product status
  const updateProductStatus = (orderId, idx, status) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const items = [...order.items];
          items[idx].status = status;
          return { ...order, items };
        }
        return order;
      })
    );
  };

  // Approve order if all items delivered
  const approveOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order.items.every((i) => i.status === "Delivered")) {
      alert("Some products are not delivered yet!");
      return;
    }
    setSellers((prev) =>
      prev.map((s) => (s.name === order.seller ? { ...s, balance: s.balance + calculateTotal(order) } : s))
    );
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Approved" } : o)));
    alert(`Order ${orderId} approved!`);
  };

  // Approve withdrawal
  const approveWithdrawal = (id) => {
    const withdrawal = withdrawals.find((w) => w.id === id);
    if (!withdrawal) return;
    setSellers((prev) =>
      prev.map((s) =>
        s.name === withdrawal.seller ? { ...s, balance: s.balance - withdrawal.amount } : s
      )
    );
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: "Approved" } : w)));
    alert(`Withdrawal ${id} approved!`);
  };

  // Filter sellers by name or brand
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

        {/* Desktop Table */}
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

          {/* Pagination */}
          <div className="flex justify-end gap-2 p-2">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Prev</button>
            <span>{currentPage} / {Math.ceil(filteredSellers.length / pageSize)}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(filteredSellers.length / pageSize)))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next</button>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          {filteredSellers.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-1">
              <p className="font-semibold">{s.name}</p>
              <p>Brands: {s.brands?.join(", ") || "-"}</p>
              <p>Balance: <span className={`${s.balance < 10000 ? "text-red-600" : ""}`}>₦{s.balance.toLocaleString()}</span></p>
              <p>Bank: {s.bank}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Orders */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Seller Orders</h2>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
              <p><span className="font-semibold">Order ID:</span> {order.id}</p>
              <p><span className="font-semibold">Seller:</span> {order.seller}</p>
              <div className="flex flex-col gap-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
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
              </div>
              <p><span className="font-semibold">Total:</span> ₦{calculateTotal(order).toLocaleString()}</p>
              <button
                onClick={() => approveOrder(order.id)}
                disabled={!order.items.every(i => i.status === "Delivered")}
                className={`px-3 py-1 rounded text-white transition ${order.items.every(i => i.status === "Delivered") ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Withdrawals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Withdrawal Requests</h2>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {withdrawals.map((w) => (
            <div key={w.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
              <p><span className="font-semibold">Request ID:</span> {w.id}</p>
              <p><span className="font-semibold">Seller:</span> {w.seller}</p>
              <p><span className="font-semibold">Amount:</span> ₦{w.amount.toLocaleString()}</p>
              <p><span className="font-semibold">Bank:</span> {w.bank}</p>
              <p><span className="font-semibold">Status:</span> {w.status}</p>
              {w.status === "Pending" && (
                <button
                  onClick={() => approveWithdrawal(w.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2"
                >
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}