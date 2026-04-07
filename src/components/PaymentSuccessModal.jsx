import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessModal({ open, orderId, onClose }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const isLogisticsTracking = String(orderId || "").trim().toUpperCase().startsWith("LTX-");

  if (!open) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full sm:max-w-md rounded-2xl p-6 flex flex-col justify-between overflow-hidden animate-swipeUp shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful
          </h2>

          <p className="text-gray-500 mb-4">
            {isLogisticsTracking ? "Your logistics booking has been paid successfully." : "Your order has been placed successfully."}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="font-semibold">
              {orderId}
            </span>
            <button
              onClick={copyOrderId}
              className="text-green-600 text-xs font-semibold"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => {
              navigate("/track", { state: { orderId } });
              onClose();
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {isLogisticsTracking ? "Track Your Logistics Booking" : "Track Your Order"}
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}