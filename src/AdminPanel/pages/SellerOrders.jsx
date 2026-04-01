// src/pages/admin/AdminSellerOrders.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAdminOrders, updateAdminOrderStatus } from "../../api/orders";
import ConfirmationModal from "../../components/ConfirmationModal";

const orderStages = [
  "Pending",
  "Approved",
  "Processing",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Completed"
];

export default function AdminSellerOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const previousOrderCount = useRef(0);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const loadOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const allOrders = await getAdminOrders(token);
    setOrders(allOrders);

    // Notify if new order arrived
    if (previousOrderCount.current && allOrders.length > previousOrderCount.current) {
      openFeedbackModal("New Order Received", "A new order has been received.");
    }
    previousOrderCount.current = allOrders.length;
  };

  useEffect(() => {
    loadOrders().catch((error) => console.error(error));

    const interval = setInterval(() => {
      loadOrders().catch((error) => console.error(error));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateStatus = async (recordId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await updateAdminOrderStatus(recordId, newStatus, token);
      await loadOrders();
    } catch (error) {
      openFeedbackModal("Status Update Failed", error.message || "Unable to update order status.", "danger");
    }
  };

  const isCompleted = (order, stage) => {
    if (!order) return false;
    return orderStages.indexOf(stage) <= orderStages.indexOf(order.status);
  };

  // Filter orders by search input (brand name or order ID or buyer)
  const filteredOrders = orders.filter(
    (o) =>
      o.brand.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Seller Orders Dashboard</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Brand, Order ID, or Buyer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-6">
            No orders found
          </div>
        )}
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
            
            {/* Product & Brand */}
            <div className="flex gap-3 items-center border-b pb-3">
              <img
                src={order.image || "https://via.placeholder.com/100?text=No+Image"}
                alt={order.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-lg">{order.productName}</h3>
                <p className="text-gray-500 text-sm">Brand: {order.brand}</p>
                <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
              </div>
            </div>

            {/* Buyer & Quantity */}
            <div className="flex justify-between text-sm">
              <span>Buyer:</span>
              <span>{order.userName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantity:</span>
              <span>{order.quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span>₦{order.amount}</span>
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
              <div className="text-xs text-gray-500 border-t pt-2">
                <p>Address: {order.shippingAddress.address}</p>
                <p>City: {order.shippingAddress.city}</p>
                <p>State: {order.shippingAddress.state}</p>
                <p>ZIP: {order.shippingAddress.zip}</p>
                <p>Country: {order.shippingAddress.country}</p>
              </div>
            )}

            {/* Status Timeline */}
            <div className="space-y-2 mt-2">
              {orderStages.map((stage) => (
                <div key={stage} className="flex items-start gap-2">
                  <div
                    className={`w-4 h-4 mt-1 rounded-full ${
                      isCompleted(order, stage) ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-medium ${
                        isCompleted(order, stage) ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {stage}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.stageTimestamps?.[stage] &&
                        new Date(order.stageTimestamps[stage]).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Update */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-sm text-gray-500">Update Status</span>
              <select
                value={order.status}
                  onChange={(e) => updateStatus(order.recordId, e.target.value)}
                className="border rounded p-2 text-sm"
              >
                {orderStages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onCancel={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        onConfirm={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        confirmLabel="OK"
        hideCancel
        tone={feedbackModal.tone}
      />
    </div>
  );
}