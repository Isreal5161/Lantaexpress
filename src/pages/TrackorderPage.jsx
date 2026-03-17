import React, { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

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

export const TrackorderPage = () => {
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const getOrder = (id) => {
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    return orders.find((o) => o.id === id);
  };

  const trackOrder = () => {
    if (!orderId) {
      alert("Please enter an Order ID");
      return;
    }
    const found = getOrder(orderId);
    if (!found) {
      alert("Order not found");
      return;
    }
    // Ensure received field exists
    if (found.received === undefined) found.received = false;
    setOrder(found);
  };

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(() => {
      const updated = getOrder(orderId);
      if (updated) {
        if (updated.received === undefined) updated.received = false;
        setOrder(updated);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const confirmReceived = () => {
    if (!window.confirm("Confirm you have received this order?")) return;

    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    const updatedOrders = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          status: "Completed",
          received: true,
          receivedAt: new Date().toISOString()
        };
      }
      return o;
    });

    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));

    setOrder({
      ...order,
      status: "Completed",
      received: true,
      receivedAt: new Date().toISOString()
    });
  };

  const submitReview = () => {
    if (!rating || !comment) {
      alert("Please add rating and comment");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    const updatedOrders = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          review: {
            rating,
            comment,
            date: new Date().toISOString()
          }
        };
      }
      return o;
    });

    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));

    setOrder({
      ...order,
      review: {
        rating,
        comment
      }
    });

    alert("⭐ Thank you for your review!");
  };

  const isCompleted = (stage) => {
    if (!order) return false;
    const orderIndex = orderStages.indexOf(order.status);
    const stageIndex = orderStages.indexOf(stage);
    return stageIndex <= orderIndex;
  };

  const progressPercent = order
    ? ((orderStages.indexOf(order.status) + 1) / orderStages.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
   <div className="pb-24">
      <div className="flex-grow max-w-xl w-full mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Track Your Order
        </h1>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
          />
          <button
            onClick={trackOrder}
            className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Track
          </button>
        </div>

        {order && (
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
            {/* Product */}
            <div className="flex flex-col sm:flex-row gap-4 border-b pb-4 mb-4 sm:mb-6 items-center sm:items-start">
              <img
                src={order.image}
                alt={order.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg">{order.productName}</h3>
                <p className="text-sm text-gray-500 mt-1">Order ID: {order.id}</p>
                <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 sm:space-y-5">
              {orderStages.map((stage) => (
                <div key={stage} className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 mt-1 rounded-full ${
                      isCompleted(stage) ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-medium ${
                        isCompleted(stage) ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {stage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            {!order.received && order.status === "Delivered" && (
              <div className="mt-6">
                <button
                  onClick={confirmReceived}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  ✔ Confirm Order Received
                </button>
              </div>
            )}

            {/* Review Section */}
            {order.received && !order.review && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-3">Leave a Review</h3>
                <div className="flex gap-2 mb-3 justify-center sm:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer text-2xl ${
                        star <= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  placeholder="Write your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded-lg p-3 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
                <button
                  onClick={submitReview}
                  className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Show Review */}
            {order.review && (
              <div className="mt-6 bg-gray-100 p-3 rounded">
                <p className="font-semibold">Your Review</p>
                <p className="text-yellow-500 text-lg">
                  {"★".repeat(order.review.rating)}
                </p>
                <p className="text-sm text-gray-700">{order.review.comment}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
   </div>    
  );
};