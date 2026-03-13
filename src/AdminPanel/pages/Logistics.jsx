// src/AdminPanel/components/Logistics.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";

const shipmentStages = [
  "Pickup Scheduled",
  "Picked Up",
  "Shipped",
  "In Transit",
  "Arrived at Nearest Hub",
  "Out for Delivery",
  "Delivered"
];

export default function Logistics() {
  const [shipments, setShipments] = useState([]);

  // Load approved shipments from localStorage
  const loadShipments = () => {
    const allRequests = JSON.parse(localStorage.getItem("logistics_requests")) || [];

    // Only take approved requests
    const approvedShipments = allRequests
      .filter(r => r.status === "Approved")
      .map(r => ({
        id: r.id,
        product: r.description || "Package", // Use description as product name
        image: r.image || null,
        seller: r.seller || "N/A",
        customer: r.name,
        pickup: r.pickup,
        delivery: r.delivery,
        stage: r.stage || "Pickup Scheduled"
      }));

    setShipments(approvedShipments);
  };

  useEffect(() => {
    loadShipments();

    // Listen for changes in localStorage (approval/decline updates)
    const handleStorageChange = (e) => {
      if (e.key === "logistics_requests") {
        loadShipments();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateStage = (id, newStage) => {
    const updated = shipments.map(item =>
      item.id === id ? { ...item, stage: newStage } : item
    );
    setShipments(updated);

    // Persist stage updates back to localStorage
    const allRequests = JSON.parse(localStorage.getItem("logistics_requests")) || [];
    const updatedRequests = allRequests.map(r => {
      if (r.id === id && r.status === "Approved") {
        return { ...r, stage: newStage };
      }
      return r;
    });
    localStorage.setItem("logistics_requests", JSON.stringify(updatedRequests));
  };

  const statusColor = (stage) => {
    if (stage === "Delivered") return "bg-green-100 text-green-700";
    if (stage === "Out for Delivery") return "bg-blue-100 text-blue-700";
    if (stage === "In Transit") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <AdminLayout>
      <div className="pb-20 md:pb-0">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Logistics Management
        </h1>

        {/* ---------------- MOBILE CARDS ---------------- */}
        <div className="lg:hidden space-y-4">
          {shipments.map(item => (
            <div key={item.id} className="bg-white border rounded-lg shadow p-4">
              <div className="flex gap-3 mb-3">
                {item.image && (
                  <img src={item.image} alt={item.product} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h2 className="font-semibold text-slate-800">{item.product}</h2>
                  <p className="text-xs text-gray-500">Tracking: {item.id}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600"><strong>Customer:</strong> {item.customer}</p>
              <p className="text-sm text-gray-600"><strong>Seller:</strong> {item.seller}</p>
              <p className="text-sm text-gray-600"><strong>Pickup:</strong> {item.pickup}</p>
              <p className="text-sm text-gray-600"><strong>Delivery:</strong> {item.delivery}</p>

              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.stage)}`}>
                  {item.stage}
                </span>
              </div>

              <div className="mt-3">
                <label className="text-xs text-gray-500">Update Shipment Stage</label>
                <select
                  value={item.stage}
                  onChange={(e) => updateStage(item.id, e.target.value)}
                  className="w-full border rounded p-2 text-sm mt-1"
                >
                  {shipmentStages.map(stage => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- DESKTOP TABLE ---------------- */}
        <div className="hidden lg:block bg-white border rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Pickup</th>
                <th className="p-3 text-left">Delivery</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-3 flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.product} className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{item.product}</p>
                      <p className="text-xs text-gray-500">{item.id}</p>
                    </div>
                  </td>
                  <td className="p-3">{item.customer}</td>
                  <td className="p-3">{item.seller}</td>
                  <td className="p-3">{item.pickup}</td>
                  <td className="p-3">{item.delivery}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.stage)}`}>
                      {item.stage}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={item.stage}
                      onChange={(e) => updateStage(item.id, e.target.value)}
                      className="border rounded p-1 text-sm"
                    >
                      {shipmentStages.map(stage => (
                        <option key={stage}>{stage}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}