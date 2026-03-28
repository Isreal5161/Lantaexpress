import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import AdminTable from "../components/AdminTable";
import SellerCard from "../components/SellerCard";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [showSellerRequests, setShowSellerRequests] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSellers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setSellers([]);
        setError("Admin login required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [usersRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/admin/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersJson = await usersRes.json();
        const productsJson = await productsRes.json();

        if (!usersRes.ok) {
          throw new Error(usersJson.message || "Failed to load sellers");
        }

        if (!productsRes.ok) {
          throw new Error(productsJson.message || "Failed to load seller products");
        }

        const productCountBySeller = new Map();
        (productsJson || []).forEach((product) => {
          const sellerId = product.seller?._id || product.seller;
          if (!sellerId) return;
          productCountBySeller.set(sellerId.toString(), (productCountBySeller.get(sellerId.toString()) || 0) + 1);
        });

        const mappedSellers = (usersJson.users || [])
          .filter((user) => user.role === "seller")
          .map((seller) => ({
            id: seller._id,
            name: seller.name,
            email: seller.email,
            brand: seller.brandName || "No brand name",
            phone: seller.phone || "N/A",
            status: seller.isVerified ? "Verified" : "Pending",
            totalProducts: productCountBySeller.get(seller._id) || 0,
            balance: 0,
          }));

        setSellers(mappedSellers);
      } catch (err) {
        setSellers([]);
        setError(err.message || "Failed to load sellers");
      } finally {
        setLoading(false);
      }
    };

    loadSellers();
  }, []);

  const handleDelete = () => setError("Delete seller is not connected to a backend endpoint yet.");
  const handleApproveSeller = () => setError("Seller verification is not connected to a backend endpoint yet.");
  const handleRejectSeller = () => setError("Seller rejection is not connected to a backend endpoint yet.");

  const columns = [
    "Seller ID",
    "Name",
    "Brand",
    "Status",
    "Total Products",
    "Balance",
    "Actions",
  ];

  const data = sellers.map((s) => [
    s.id,
    s.name,
    s.brand,
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        s.status === "Verified"
          ? "bg-green-100 text-green-700"
          : s.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {s.status}
    </span>,
    s.totalProducts,
    `₦${s.balance.toLocaleString()}`,
    <div className="flex gap-2">
      <button
        onClick={() => alert("View Seller Subpage coming soon!")}
        className="p-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        View
      </button>
      <button
        onClick={() => handleDelete(s.id)}
        className="p-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
      >
        Delete
      </button>
    </div>,
  ]);

  // Pending verification requests
  const pendingSellers = sellers.filter((s) => s.status === "Pending");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Sellers Management
          </h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search sellers..."
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-64"
            />
            <button
              onClick={() => setShowSellerRequests(true)}
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              New Seller Requests ({pendingSellers.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* DESKTOP TABLE */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10 text-lg">Loading sellers...</p>
        ) : sellers.length > 0 ? (
          <div className="hidden md:block">
            <AdminTable columns={columns} data={data} />
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No sellers available on the site at this moment.
          </p>
        )}

        {/* MOBILE CARDS */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {sellers.map((s) => (
            <SellerCard
              key={s.id}
              seller={s}
              onView={() => alert("View Seller Subpage coming soon!")}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>

        {/* NEW SELLER REQUESTS MODAL */}
        {showSellerRequests && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
            <div className="bg-white w-11/12 max-w-4xl rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
                onClick={() => setShowSellerRequests(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">New Seller Requests</h2>
              {pendingSellers.length > 0 ? (
                <div className="space-y-4">
                  {pendingSellers.map((s) => (
                    <div
                      key={s.id}
                      className="border p-3 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-gray-600">{s.email}</p>
                        <p className="text-sm text-gray-600">{s.brand}</p>
                        <p className="text-sm text-gray-600">{s.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveSeller(s.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSeller(s.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No new seller requests</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}