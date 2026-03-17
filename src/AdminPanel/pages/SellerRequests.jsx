// src/AdminPanel/components/SellerRequests.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";

// Local storage key
const SELLER_REQUESTS_KEY = "lanta_seller_requests";

export default function SellerRequests() {
  const [requests, setRequests] = useState([]);

  // Persist changes to localStorage
  const persistRequests = (data) => {
    localStorage.setItem(SELLER_REQUESTS_KEY, JSON.stringify(data));
  };

  // Load requests from localStorage
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem(SELLER_REQUESTS_KEY)) || [];
    setRequests(storedRequests);

    // TODO: Replace with backend API call when ready
    // fetch("/api/seller-requests")
    //   .then(res => res.json())
    //   .then(data => { setRequests(data); persistRequests(data); });
  }, []);

  const approveSeller = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: "Approved" } : req
    );
    setRequests(updated);
    persistRequests(updated);
    alert(`Seller request ${id} approved!`);
  };

  const declineSeller = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: "Declined" } : req
    );
    setRequests(updated);
    persistRequests(updated);
    alert(`Seller request ${id} declined!`);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Seller Requests</h1>

      {requests.length === 0 ? (
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Documents</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-2">{req.id}</td>
                    <td className="px-4 py-2">{req.name}</td>
                    <td className="px-4 py-2">{req.email}</td>
                    <td className="px-4 py-2">{req.store}</td>
                    <td className="px-4 py-2">{req.phone}</td>
                    <td className="px-4 py-2">{req.documents}</td>
                    <td className="px-4 py-2">{req.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      {req.status === "Pending" && (
                        <>
                          <button
                            onClick={() => approveSeller(req.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => declineSeller(req.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
                <p><span className="font-semibold">ID:</span> {req.id}</p>
                <p><span className="font-semibold">Name:</span> {req.name}</p>
                <p><span className="font-semibold">Email:</span> {req.email}</p>
                <p><span className="font-semibold">Store:</span> {req.store}</p>
                <p><span className="font-semibold">Phone:</span> {req.phone}</p>
                <p><span className="font-semibold">Documents:</span> {req.documents}</p>
                <p><span className="font-semibold">Status:</span> {req.status}</p>
                {req.status === "Pending" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => approveSeller(req.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineSeller(req.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex-1"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}