// src/AdminPanel/pages/UserOrders.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Define possible order statuses (sync with UserTracking)
const orderStages = [
  "Pending",
  "Approved",
  "Picked Up",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage
  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("user_orders")) || [];
    setOrders(savedOrders);
  };

  useEffect(() => {
    loadOrders();
    setLoading(false);

    // Listen to localStorage changes (from UserTracking or other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "user_orders") {
        loadOrders();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update order status
  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));
  };

  // Helper for status badge colors
  const statusColor = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Shipped" || status === "Out for Delivery")
      return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">User Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          ⚠️ No orders available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3"
            >
              {/* Order Info */}
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Order ID</span>
                <span className="font-medium">{order.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">User</span>
                <span className="font-medium">{order.userName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Product</span>
                <span className="font-medium">{order.productName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Brand</span>
                <span className="font-medium">{order.brand}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Price</span>
                <span className="font-medium">
                  ${order.price ? order.price.toFixed(2) : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              {/* Status Dropdown */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-sm text-slate-500">Status</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`w-full border p-2 rounded text-sm ${statusColor(
                    order.status
                  )}`}
                >
                  {orderStages.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Description</span>
                <span className="text-sm">{order.description}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date</span>
                <span className="text-sm">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
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