// src/pages/TrackorderPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Text } from "../components/Text";

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
  const [received, setReceived] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [returnRequested, setReturnRequested] = useState(false);

  const loadOrder = () => {
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    return orders.find((o) => o.id === orderId);
  };

  const handleTrack = () => {
    if (!orderId) return alert("Please enter an Order ID");
    const found = loadOrder();
    if (!found) {
      alert("Order not found");
      setOrder(null);
      return;
    }
    setOrder(found);
    setReceived(found.received || false);
    setReview(found.review || "");
    setRating(found.rating || 0);
    setReturnRequested(found.returnRequested || false);
  };

  useEffect(() => {
    if (orderId) handleTrack();
    const handleStorageChange = (e) => {
      if (e.key === "user_orders") handleTrack();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [orderId]);

  const isStageCompleted = (stage) => {
    if (!order) return false;
    return orderStages.indexOf(stage) <= orderStages.indexOf(order.status);
  };

  const markAsReceived = () => {
    if (!order) return;
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    const updatedOrders = orders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            received: true,
            status: "Delivered",
            stageTimestamps: {
              ...o.stageTimestamps,
              Delivered: o.stageTimestamps?.Delivered || new Date().toISOString(),
              Received: new Date().toISOString(),
            },
          }
        : o
    );
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));
    setOrder({ ...order, received: true, status: "Delivered" });
    setReceived(true);
    alert("🎉 Thank you! You marked this order as received.");
  };

  const submitReview = () => {
    if (rating === 0 || !review) return alert("Please give a rating and comment.");
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    const updatedOrders = orders.map((o) =>
      o.id === order.id ? { ...o, review, rating, returnRequested } : o
    );
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));
    alert("✅ Review submitted successfully!");
  };

  const requestReturn = () => {
    setReturnRequested(true);
    alert("⚠️ Return request submitted. Our support team will contact you.");
  };

  const showReviewSection = order?.status === "Delivered";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="pb-24 flex-grow flex flex-col items-center justify-start px-4 py-8 w-full">
        <Text className="text-2xl font-bold mb-6">Track Your Order</Text>

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

            <div className="mt-6">
              <h3 className="text-gray-700 font-semibold mb-3">Shipment Progress</h3>
              <div className="relative ml-4">
                {orderStages.map((stage, index) => (
                  <div key={stage} className="flex items-start mb-6 last:mb-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 ${
                        isStageCompleted(stage)
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    ></div>
                    {index < orderStages.length - 1 && (
                      <div
                        className={`absolute top-2.5 left-6 w-[2px] h-[calc(100%-1rem)] ${
                          isStageCompleted(orderStages[index + 1])
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
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

            {/* Show Mark as Received if not received yet */}
            {!received && order.status === "Delivered" && (
              <Button text="Mark as Received" onClick={markAsReceived} className="mt-4" />
            )}

            {/* Review Section */}
            {showReviewSection && (
              <div className="mt-6 flex flex-col gap-4">
                <div className="bg-green-100 p-4 rounded-lg text-center text-green-700 font-semibold">
                  🎉 {received ? "You have received your order!" : "Order has been delivered!"}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">Rate the Product:</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer text-2xl ${
                          rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Leave a comment..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mt-2 w-full"
                  />
                  <Button text="Submit Review" onClick={submitReview} />
                </div>

                {!returnRequested && (
                  <Button
                    text="Request Return (within 24h)"
                    onClick={requestReturn}
                    className="bg-red-600 mt-2"
                  />
                )}
                {returnRequested && (
                  <div className="text-red-600 font-semibold">
                    Return requested. Our team will contact you shortly.
                  </div>
                )}
              </div>
            )}
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