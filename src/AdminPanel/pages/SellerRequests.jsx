// src/AdminPanel/components/SellerRequests.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { TablePanelSkeleton } from "../../components/LoadingSkeletons";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

export default function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRequests([]);
      setLoading(false);
      setError("Admin login required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/admin/seller-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load seller requests");
      }

      setRequests(data.requests || []);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load seller requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateRequestStatus = async (id, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Admin login required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/seller-requests/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} seller request`);
      }

      setRequests((current) => current.filter((request) => request._id !== id));
    } catch (requestError) {
      setError(requestError.message || `Failed to ${action} seller request`);
    }
  };

  const approveSeller = (id) => updateRequestStatus(id, "approve");
  const declineSeller = (id) => updateRequestStatus(id, "reject");

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Seller Requests</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <TablePanelSkeleton columns={8} rows={5} mobileCards={4} />
      ) : requests.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-lg">
          No new seller requests at this moment
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Store</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">State</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className="px-4 py-2">{req._id}</td>
                    <td className="px-4 py-2">{req.name}</td>
                    <td className="px-4 py-2">{req.email}</td>
                    <td className="px-4 py-2">{req.brandName || "No brand"}</td>
                    <td className="px-4 py-2">{req.phone || "N/A"}</td>
                    <td className="px-4 py-2">{req.state || "N/A"}</td>
                    <td className="px-4 py-2">Pending</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => approveSeller(req._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => declineSeller(req._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
                <p><span className="font-semibold">ID:</span> {req._id}</p>
                <p><span className="font-semibold">Name:</span> {req.name}</p>
                <p><span className="font-semibold">Email:</span> {req.email}</p>
                <p><span className="font-semibold">Store:</span> {req.brandName || "No brand"}</p>
                <p><span className="font-semibold">Phone:</span> {req.phone || "N/A"}</p>
                <p><span className="font-semibold">State:</span> {req.state || "N/A"}</p>
                <p><span className="font-semibold">Status:</span> Pending</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => approveSeller(req._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => declineSeller(req._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex-1"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}