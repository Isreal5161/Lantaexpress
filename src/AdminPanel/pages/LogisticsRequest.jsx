// src/AdminPanel/components/LogisticsRequest.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function LogisticsRequest() {
  const [requests, setRequests] = useState([]);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("logistics_requests")) || [];
    setRequests(data);
  }, []);

  const removeRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const approveRequest = (req) => {
    // 1. Add to logistics shipments
    const shipments = JSON.parse(localStorage.getItem("logistics_shipments")) || [];
    const newShipment = {
      ...req,
      status: "Approved",
      stage: "Pickup Scheduled"
    };
    shipments.push(newShipment);
    localStorage.setItem("logistics_shipments", JSON.stringify(shipments));

    // 2. Add to history
    const history = JSON.parse(localStorage.getItem("logistics_history")) || [];
    history.push({ ...req, status: "Approved", stage: "Pickup Scheduled", actionDate: new Date().toISOString() });
    localStorage.setItem("logistics_history", JSON.stringify(history));

    // 3. Remove from requests
    const updatedRequests = requests.filter(r => r.id !== req.id);
    setRequests(updatedRequests);
    localStorage.setItem("logistics_requests", JSON.stringify(updatedRequests));
  };

  const declineRequest = (req, reasonText) => {
    // 1. Add to history with declined reason
    const history = JSON.parse(localStorage.getItem("logistics_history")) || [];
    history.push({
      ...req,
      status: "Declined",
      reason: reasonText,
      actionDate: new Date().toISOString()
    });
    localStorage.setItem("logistics_history", JSON.stringify(history));

    // 2. Remove from requests
    const updatedRequests = requests.filter(r => r.id !== req.id);
    setRequests(updatedRequests);
    localStorage.setItem("logistics_requests", JSON.stringify(updatedRequests));

    // 3. Send simulated notification to user
    const notifications = JSON.parse(localStorage.getItem("user_notifications")) || [];
    notifications.push({
      user: req.name,
      type: "Logistics Request Declined",
      message: `Your logistics request was declined. Reason: ${reasonText}`,
      date: new Date().toISOString()
    });
    localStorage.setItem("user_notifications", JSON.stringify(notifications));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Logistics Requests</h1>

      {/* MOBILE VIEW */}
      <div className="lg:hidden space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white border rounded-lg shadow p-4">
            {req.image && (
              <img src={req.image} className="w-full h-40 object-cover rounded mb-3" />
            )}
            <h2 className="font-semibold">{req.name}</h2>
            <p className="text-sm text-gray-600">Phone: {req.phone}</p>
            <p className="text-sm"><strong>Pickup:</strong> {req.pickup}</p>
            <p className="text-sm"><strong>Delivery:</strong> {req.delivery}</p>
            <p className="text-sm text-gray-500">{req.description}</p>
            <p className="text-xs text-gray-400">{req.date}</p>

            <div className="mt-3 flex flex-col gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => approveRequest(req)}
              >
                Approve
              </button>
              <input
                type="text"
                placeholder="Reason for declining"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border p-2"
              />
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  if (!reason) {
                    alert("Please enter a reason before declining");
                    return;
                  }
                  declineRequest(req, reason);
                  setReason(""); // reset reason
                }}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Pickup</th>
              <th className="p-3 text-left">Delivery</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-t">
                <td className="p-3">{req.name}<p className="text-xs text-gray-500">{req.phone}</p></td>
                <td className="p-3">{req.pickup}</td>
                <td className="p-3">{req.delivery}</td>
                <td className="p-3">{req.description}</td>
                <td className="p-3 text-xs">{req.date}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => approveRequest(req)}
                  >
                    Approve
                  </button>
                  <input
                    type="text"
                    placeholder="Reason for declining"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border p-1"
                  />
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      if (!reason) { alert("Enter reason"); return; }
                      declineRequest(req, reason);
                      setReason("");
                    }}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}