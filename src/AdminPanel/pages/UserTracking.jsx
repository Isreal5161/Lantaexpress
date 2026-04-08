import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { getAdminOrders, updateAdminOrderStatus } from "../../api/orders";
import ConfirmationModal from "../../components/ConfirmationModal";
import { OrderWorkspaceSkeleton } from "../../components/LoadingSkeletons";

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

export default function UserTracking() {

  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousOrderCount = useRef(0);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  // -------- PRICE RESOLVER (handles backend or localStorage structures) --------
  const resolveOrderAmount = (order) => {

    const qty = Number(order.quantity) || 1;

    const unitPrice =
      order.unitPrice ??
      order.price ??
      order.productPrice ??
      order.itemPrice ??
      order.cost;

    const total =
      order.total ??
      order.totalPrice ??
      order.amount ??
      order.orderTotal;

    if (total) return Number(total);

    if (unitPrice) return Number(unitPrice) * qty;

    return 0;
  };

  const loadOrders = async (showLoader = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (showLoader) {
      setLoading(true);
    }

    try {
      const savedOrders = await getAdminOrders(token);

      const sorted = savedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const active = sorted.filter((o) => !o.received);
      const history = sorted.filter((o) => o.received);

      setActiveOrders(active);
      setHistoryOrders(history);

      if (
        previousOrderCount.current &&
        savedOrders.length > previousOrderCount.current
      ) {
        openFeedbackModal("New Order Received", "A new order has been received.");
      }

      previousOrderCount.current = savedOrders.length;
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders(true).catch((error) => console.error(error));

    const interval = setInterval(() => {
      loadOrders().catch((error) => console.error(error));
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // -------- UPDATE STATUS --------
  const updateStatus = async (recordId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await updateAdminOrderStatus(recordId, newStatus, token);
      await loadOrders();
    } catch (error) {
      openFeedbackModal("Status Update Failed", error.message || "Unable to update order status.", "danger");
    }
  };

  // -------- CLEAR HISTORY --------
  const clearHistory = () => {
    loadOrders().catch((error) => console.error(error));
  };

  const statusColor = (status) => {

    if (status === "Completed")
      return "bg-green-100 text-green-700";

    if (
      status === "Shipped" ||
      status === "In Transit" ||
      status === "Out for Delivery"
    )
      return "bg-blue-100 text-blue-700";

    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-6">Order Tracking Management</h1>
          <OrderWorkspaceSkeleton />
        </div>
      </AdminLayout>
    );
  }

  return (

    <>
    <AdminLayout>

      <h1 className="text-2xl font-bold mb-6">
        Order Tracking Management
      </h1>

      {/* ACTIVE ORDERS */}

      <h2 className="text-xl font-semibold mb-4">
        Active Orders
      </h2>

      {activeOrders.length === 0 ? (

        <div className="bg-gray-100 p-4 rounded">
          No active orders
        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-10">

          {activeOrders.map((order) => (

            <div
              key={order.id}
              className="bg-white border rounded-xl shadow p-4 flex flex-col gap-3"
            >

              {/* Product Image */}

              {order.image && (

                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-full h-40 object-cover rounded-lg"
                />

              )}

              {/* Order ID */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold">{order.id}</span>
              </div>

              {/* User */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User</span>
                <span>{order.userName}</span>
              </div>

              {/* Product */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Product</span>
                <span>{order.productName}</span>
              </div>

              {/* Brand */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Brand</span>
                <span>{order.brand}</span>
              </div>

              {/* Quantity */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantity</span>
                <span>{order.quantity}</span>
              </div>

              {/* Amount (REAL PRICE RESOLVER) */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">
                  ₦{resolveOrderAmount(order).toLocaleString()}
                </span>
              </div>

              {/* Address */}

              {order.shippingAddress && (

                <div className="text-xs text-gray-500 border-t pt-2">

                  <p>
                    Address: {order.shippingAddress.address}
                  </p>

                  <p>
                    City: {order.shippingAddress.city}
                  </p>

                  <p>
                    State: {order.shippingAddress.state}
                  </p>

                  <p>
                    ZIP: {order.shippingAddress.zip}
                  </p>

                  <p>
                    Country: {order.shippingAddress.country}
                  </p>

                </div>

              )}

              {/* Status Update */}

              <div className="flex flex-col gap-2 mt-2">

                <span className="text-sm text-gray-500">
                  Update Status
                </span>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.recordId, e.target.value)
                  }
                  className={`border rounded p-2 text-sm ${statusColor(
                    order.status
                  )}`}
                >

                  {orderStages.map((stage) => (

                    <option key={stage}>
                      {stage}
                    </option>

                  ))}

                </select>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* HISTORY */}

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-semibold">
          Completed Orders History
        </h2>

        {historyOrders.length > 0 && (

          <button
            onClick={clearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Clear History
          </button>

        )}

      </div>

      {historyOrders.length === 0 ? (

        <div className="bg-gray-100 p-4 rounded">
          No completed orders
        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {historyOrders.map((order) => (

            <div
              key={order.id}
              className="bg-white border rounded-xl shadow p-4"
            >

              <p className="font-semibold">
                {order.productName}
              </p>

              <p className="text-sm text-gray-500">
                Order ID: {order.id}
              </p>

              <p className="text-sm text-green-600">
                Completed
              </p>

              <p className="text-xs text-gray-400">
                Received:{" "}
                {order.receivedAt
                  ? new Date(order.receivedAt).toLocaleDateString()
                  : ""}
              </p>

            </div>

          ))}

        </div>

      )}


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
    </AdminLayout>
    </>

  );

}