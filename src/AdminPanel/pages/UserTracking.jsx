import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../Layout/AdminLayout";

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

  const [trackingOrders, setTrackingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousOrderCount = useRef(0);

  // Load orders
  const loadOrders = () => {

    const savedOrders = JSON.parse(localStorage.getItem("user_orders")) || [];

    const sorted = savedOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setTrackingOrders(sorted);

    if (
      previousOrderCount.current &&
      savedOrders.length > previousOrderCount.current
    ) {
      alert("📦 New order received!");
    }

    previousOrderCount.current = savedOrders.length;
  };

  useEffect(() => {

    loadOrders();
    setLoading(false);

    const handleStorageChange = (e) => {
      if (e.key === "user_orders") {
        loadOrders();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () =>
      window.removeEventListener("storage", handleStorageChange);

  }, []);

  // Update order status
  const updateStatus = (orderId, newStatus) => {

    const updatedOrders = trackingOrders.map((order) => {

      if (order.id === orderId) {

        const newTimestamps = {
          ...order.stageTimestamps
        };

        if (!newTimestamps[newStatus]) {
          newTimestamps[newStatus] = new Date().toISOString();
        }

        return {
          ...order,
          status: newStatus,
          stageTimestamps: newTimestamps
        };
      }

      return order;

    });

    setTrackingOrders(updatedOrders);

    localStorage.setItem(
      "user_orders",
      JSON.stringify(updatedOrders)
    );

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

  return (

    <AdminLayout>

      <h1 className="text-2xl font-bold mb-6">
        Order Tracking Management
      </h1>

      {loading ? (

        <p>Loading tracking orders...</p>

      ) : trackingOrders.length === 0 ? (

        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          ⚠️ No orders found
        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {trackingOrders.map((order) => (

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

              {/* Order Info */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Order ID
                </span>
                <span className="font-semibold">
                  {order.id}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  User
                </span>
                <span className="font-medium">
                  {order.userName}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Contact
                </span>
                <span>
                  {order.phone || order.contact}
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

              {/* Product */}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Product
                </span>
                <span className="font-medium">
                  {order.productName}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Brand
                </span>
                <span>{order.brand}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Quantity
                </span>
                <span>{order.quantity}</span>
              </div>

              {/* Status */}

              <div className="flex flex-col gap-2 mt-2">

                <span className="text-sm text-gray-500">
                  Update Status
                </span>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
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

              {/* Delivery */}

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Expected Delivery
                </span>

                <span>

                  {order.expectedDelivery
                    ? new Date(
                        order.expectedDelivery
                      ).toLocaleDateString()
                    : "N/A"}

                </span>

              </div>

              {/* Received by User */}

              {order.received && (

                <div className="bg-green-100 text-green-700 text-sm p-2 rounded text-center">

                  ✅ Customer confirmed delivery

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </AdminLayout>

  );

}