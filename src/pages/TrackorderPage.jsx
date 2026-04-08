import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { confirmOrderReceived, submitOrderReview, trackOrder } from "../api/orders";
import { trackLogistics } from "../api/logistics";
import {
  FaClipboardList,
  FaCheckCircle,
  FaCogs,
  FaBoxOpen,
  FaTruck,
  FaMapMarkedAlt,
  FaHome,
  FaFlagCheckered,
} from "react-icons/fa";

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

const stageIcons = {
  Pending: FaClipboardList,
  Approved: FaCheckCircle,
  Processing: FaCogs,
  Shipped: FaBoxOpen,
  "In Transit": FaTruck,
  "Out for Delivery": FaMapMarkedAlt,
  Delivered: FaHome,
  Completed: FaFlagCheckered,
};

const logisticsStages = [
  "Awaiting Dispatch",
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "In Transit",
  "Arrived at Nearest Hub",
  "Out for Delivery",
  "Delivered",
  "Completed",
];

const logisticsStageIcons = {
  "Awaiting Dispatch": FaClipboardList,
  Approved: FaCheckCircle,
  "Pickup Scheduled": FaCogs,
  "Picked Up": FaBoxOpen,
  "In Transit": FaTruck,
  "Arrived at Nearest Hub": FaMapMarkedAlt,
  "Out for Delivery": FaTruck,
  Delivered: FaHome,
  Completed: FaFlagCheckered,
};

export const TrackorderPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [confirmReceivedOpen, setConfirmReceivedOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const getUserToken = () => localStorage.getItem("authToken");

  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const normalizedCurrentUserEmail = (currentUser?.email || "").trim().toLowerCase();
  const normalizedOrderEmail = (order?.contact || order?.userEmail || "").trim().toLowerCase();
  const isLogisticsOrder = order?.type === "logistics";
  const activeStages = isLogisticsOrder ? logisticsStages : orderStages;
  const activeStageIcons = isLogisticsOrder ? logisticsStageIcons : stageIcons;
  const canConfirmOrder = Boolean(
    order &&
    !isLogisticsOrder &&
    !order.received &&
    order.status === "Delivered" &&
    normalizedCurrentUserEmail &&
    normalizedCurrentUserEmail === normalizedOrderEmail
  );

  const loadOrder = async (id) => {
    const token = getUserToken();
    if (!token) {
      throw new Error("Please log in to track your shipment.");
    }

    let found;
    if (String(id).trim().toUpperCase().startsWith("LTX-")) {
      found = await trackLogistics(id, token);
    } else {
      try {
        found = await trackOrder(id, token);
      } catch (error) {
        found = await trackLogistics(id, token);
      }
    }

    if (found.received === undefined) found.received = false;
    setOrder(found);
  };

  const handleTrackOrder = async () => {
    if (!orderId) {
      openFeedbackModal("Tracking ID Required", "Please enter an order ID or logistics tracking ID before tracking your shipment.", "neutral");
      return;
    }

    try {
      await loadOrder(orderId);
    } catch (error) {
      openFeedbackModal("Unable to Track Shipment", error.message || "Shipment not found", "danger");
      setOrder(null);
    }
  };

  useEffect(() => {
    const presetOrderId = location.state?.orderId;
    if (presetOrderId) {
      setOrderId(presetOrderId);
    }
  }, [location.state]);

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(() => {
      loadOrder(orderId).catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    loadOrder(orderId).catch(() => {});
  }, [orderId]);

  const confirmReceived = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      openFeedbackModal("Login Required", "Please log in to confirm delivery.", "danger");
      return;
    }

    try {
      const updated = await confirmOrderReceived(order.recordId, token);
      setOrder(updated);
      setConfirmReceivedOpen(false);
      openFeedbackModal("Order Confirmed", "Your delivery has been confirmed successfully.");
    } catch (error) {
      setConfirmReceivedOpen(false);
      openFeedbackModal("Confirmation Failed", error.message || "Unable to confirm delivery.", "danger");
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      openFeedbackModal("Review Incomplete", "Please add both a rating and comment before submitting.", "neutral");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      openFeedbackModal("Login Required", "Please log in to submit a review.", "danger");
      return;
    }

    try {
      const updated = await submitOrderReview(order.recordId, { rating, comment }, token);
      setOrder(updated);
      setRating(0);
      setComment("");
      openFeedbackModal("Review Submitted", "Thank you for your review. Your feedback has been recorded.");
    } catch (error) {
      openFeedbackModal("Review Failed", error.message || "Unable to save your review.", "danger");
    }
  };

  const isCompleted = (stage) => {
    if (!order) return false;
    const orderIndex = activeStages.indexOf(order.status);
    const stageIndex = activeStages.indexOf(stage);
    return stageIndex <= orderIndex;
  };

  const getStageTimestamp = (stage) => {
    if (!order) return null;

    const stageTimestamp = order.stageTimestamps?.[stage];
    if (stageTimestamp) {
      return new Date(stageTimestamp);
    }

    if (stage === "Pending" && order.createdAt) {
      return new Date(order.createdAt);
    }

    if (stage === "Completed" && order.receivedAt) {
      return new Date(order.receivedAt);
    }

    return null;
  };

  const formatStageTimestamp = (stage) => {
    const timestamp = getStageTimestamp(stage);
    if (!timestamp || Number.isNaN(timestamp.getTime())) {
      return isCompleted(stage) ? "Time unavailable" : "Waiting for update";
    }

    return timestamp.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const progressPercent = order
    ? ((Math.max(activeStages.indexOf(order.status), 0) + 1) / activeStages.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
  <div className="pb-18">
      <div className="flex-grow max-w-xl w-full mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Track Your Shipment
        </h1>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Order ID or Logistics Tracking ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
          />
          <button
            onClick={handleTrackOrder}
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
                <p className="text-sm text-gray-500 mt-1">{isLogisticsOrder ? "Tracking ID" : "Order ID"}: {order.id}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {isLogisticsOrder ? "Booked" : "Ordered"}: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                </p>
                {isLogisticsOrder ? (
                  <>
                    <p className="text-sm text-gray-500 mt-1">Pickup: {order.pickup}</p>
                    <p className="text-sm text-gray-500 mt-1">Delivery: {order.delivery}</p>
                    {order.distanceText ? <p className="text-sm text-gray-500 mt-1">Distance: {order.distanceText}</p> : null}
                  </>
                ) : null}
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
              {activeStages.map((stage) => {
                const completed = isCompleted(stage);
                const StageIcon = activeStageIcons[stage] || FaClipboardList;

                return (
                <div key={stage} className="flex items-start gap-3 rounded-lg border border-gray-100 px-3 py-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${
                      completed
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <StageIcon className="text-sm" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        completed ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {stage}
                    </p>
                    <p
                      className={`text-sm ${
                        completed ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {formatStageTimestamp(stage)}
                    </p>
                  </div>
                </div>
              )})}
            </div>

            {/* Confirm Button */}
            {canConfirmOrder && (
              <div className="mt-6">
                <button
                  onClick={() => setConfirmReceivedOpen(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  ✔ Confirm Order Received
                </button>
              </div>
            )}

            {/* Review Section */}
            {!isLogisticsOrder && order.received && !order.review && (
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
                  onClick={handleSubmitReview}
                  className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Show Review */}
            {!isLogisticsOrder && order.review && (
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

      <ConfirmationModal
        isOpen={confirmReceivedOpen}
        title="Confirm Delivery"
        message="Please confirm that you have received this order. This will mark the order as completed."
        onCancel={() => setConfirmReceivedOpen(false)}
        onConfirm={confirmReceived}
        confirmLabel="Yes, Confirm"
        cancelLabel="Cancel"
      />
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

      <Footer />
    </div>
   </div>    
  );
};