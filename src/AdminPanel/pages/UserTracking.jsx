// src/AdminPanel/pages/UserTracking.jsx
import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../Layout/AdminLayout";

const orderStages = [
  "Pending",
  "Approved",
  "Picked Up",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function UserTracking() {
  const [trackingOrders, setTrackingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousOrderCount = useRef(0);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("user_orders")) || [];
    setTrackingOrders(savedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    if (previousOrderCount.current && savedOrders.length > previousOrderCount.current) {
      alert("📦 New order received!");
    }
    previousOrderCount.current = savedOrders.length;
  };

  useEffect(() => {
    loadOrders();
    setLoading(false);

    const handleStorageChange = (e) => {
      if (e.key === "user_orders") loadOrders();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = trackingOrders.map((order) => {
      if (order.id === orderId) {
        const newTimestamps = { ...order.stageTimestamps };
        if (!newTimestamps[newStatus]) newTimestamps[newStatus] = new Date().toISOString();
        return { ...order, status: newStatus, stageTimestamps: newTimestamps };
      }
      return order;
    });
    setTrackingOrders(updatedOrders);
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));
  };

  const statusColor = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Shipped" || status === "Out for Delivery") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">User Tracking</h1>

      {loading ? (
        <p>Loading tracking orders...</p>
      ) : trackingOrders.length === 0 ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          ⚠️ No tracking orders available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trackingOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3"
            >
              {order.image && (
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Order ID</span>
                <span className="font-medium">{order.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">User</span>
                <span className="font-medium">{order.userName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Contact</span>
                <span className="text-sm">{order.phone || order.contact}</span>
              </div>

              {order.shippingAddress && (
                <div className="flex flex-col text-sm text-slate-500 border-t pt-2 mt-2">
                  <span>Address: {order.shippingAddress.address}</span>
                  <span>City: {order.shippingAddress.city}</span>
                  <span>State: {order.shippingAddress.state}</span>
                  <span>ZIP: {order.shippingAddress.zip}</span>
                  <span>Country: {order.shippingAddress.country}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Product</span>
                <span className="font-medium">{order.productName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Brand</span>
                <span className="font-medium">{order.brand}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              {order.description && (
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Description</span>
                  <span className="text-sm">{order.description}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-sm text-slate-500">Status</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`w-full border p-2 rounded text-sm ${statusColor(order.status)}`}
                >
                  {orderStages.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Expected Delivery</span>
                <span className="text-sm">
                  {order.expectedDelivery
                    ? new Date(order.expectedDelivery).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}