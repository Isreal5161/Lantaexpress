// src/AdminPanel/pages/UserOrders.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample mock data for now
  const sampleOrders = [
    {
      id: "ORD001",
      userName: "John Doe",
      productName: "Wireless Earbuds",
      brand: "SoundMax",
      price: 49.99,
      quantity: 2,
      status: "pending",
      description: "Gift for friend",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ORD002",
      userName: "Mary Jane",
      productName: "Smartwatch",
      brand: "TimePro",
      price: 120.0,
      quantity: 1,
      status: "completed",
      description: "Birthday purchase",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">User Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          ⚠️ No orders available yet. Backend not connected.
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
                <span className="font-medium">${order.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Status</span>
                <span
                  className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status === "completed" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Description</span>
                <span className="text-sm">{order.description}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date</span>
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Actions (Optional) */}
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                  View
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}