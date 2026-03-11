// src/AdminPanel/pages/UserTracking.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { FaShippingFast, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UserTracking() {
  const [trackingOrders, setTrackingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample mock data
  const sampleTrackingOrders = [
    {
      id: "ORD001",
      userName: "John Doe",
      contact: "john@example.com",
      productName: "Wireless Earbuds",
      brand: "SoundMax",
      quantity: 2,
      status: "In Transit",
      expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
    },
    {
      id: "ORD002",
      userName: "Mary Jane",
      contact: "mary@example.com",
      productName: "Smartwatch",
      brand: "TimePro",
      quantity: 1,
      status: "Shipped",
      expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setTrackingOrders(sampleTrackingOrders);
      setLoading(false);
    }, 500);
  }, []);

  const updateStatus = (orderId) => {
    alert(`Update status for order ${orderId} (backend integration coming soon)`);
  };

  const sendNotification = (orderId) => {
    alert(`Send notification to user for order ${orderId}`);
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
                <span className="text-sm text-slate-500">Contact</span>
                <span className="text-sm">{order.contact}</span>
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
                <span className="text-sm text-slate-500">Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Status</span>
                <span
                  className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status === "Delivered" ? <FaCheckCircle /> : <FaShippingFast />}
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Expected Delivery</span>
                <span className="text-sm">
                  {new Date(order.expectedDelivery).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateStatus(order.id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
                >
                  Update Status
                </button>
                <button
                  onClick={() => sendNotification(order.id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Send Notification
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}