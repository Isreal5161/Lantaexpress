import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Text } from "../components/Text";

// Define order stages
const orderStages = [
  "Pending",
  "Approved",
  "Picked Up",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export const TrackorderPage = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || "");
  const [order, setOrder] = useState(null);

  const loadOrder = (id) => {
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    return orders.find((o) => o.id === id);
  };

  useEffect(() => {
    if (orderId) {
      const found = loadOrder(orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  const handleTrack = () => {
    if (!orderId) return alert("Please enter an Order ID");
    const found = loadOrder(orderId);
    if (!found) {
      alert("Order not found");
      setOrder(null);
      return;
    }
    setOrder(found);
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user_orders" && orderId) {
        const updatedOrder = loadOrder(orderId);
        if (updatedOrder) setOrder(updatedOrder);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [orderId]);

  const isStageCompleted = (stage) => {
    if (!order) return false;
    const currentIndex = orderStages.indexOf(order.status);
    return orderStages.indexOf(stage) <= currentIndex;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-start px-4 py-8 w-full">
        <Text className="text-2xl font-bold mb-6">Track Your Order</Text>

        {/* Order ID Input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 flex-1"
          />
          <Button text="Track Order" onClick={handleTrack} />
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-white border rounded-xl p-6 shadow-lg w-full sm:w-96 flex flex-col gap-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-semibold">{order.productName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-semibold">{order.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.expectedDelivery).toLocaleDateString()}
              </p>
            </div>

            {/* Professional Shipment Tracker */}
            <div className="mt-6">
              <h3 className="text-gray-700 font-semibold mb-3">Shipment Progress</h3>
              <div className="relative ml-4">
                {orderStages.map((stage, index) => (
                  <div key={stage} className="flex items-start mb-6 last:mb-0">
                    {/* Circle */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 ${
                        isStageCompleted(stage)
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    ></div>

                    {/* Line */}
                    {index < orderStages.length - 1 && (
                      <div
                        className={`absolute top-2.5 left-6 w-[2px] h-[calc(100%-1rem)] ${
                          isStageCompleted(orderStages[index + 1])
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}

                    {/* Stage Label */}
                    <div className="ml-6">
                      <p
                        className={`font-medium ${
                          isStageCompleted(stage) ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        {stage}
                      </p>
                      {isStageCompleted(stage) && order.stageTimestamps?.[stage] && (
                        <p className="text-xs text-gray-400">
                          {new Date(order.stageTimestamps[stage]).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!order && orderId && (
          <p className="text-red-500 mt-2">No order found with this ID.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};