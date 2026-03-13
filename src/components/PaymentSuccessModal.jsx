import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessModal({ open, orderId, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal */}
      <div className="bg-white w-full sm:max-w-md rounded-2xl p-6 flex flex-col justify-between overflow-hidden animate-swipeUp shadow-lg">
        
        {/* Top Content */}
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
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

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful
          </h2>

          {/* Message */}
          <p className="text-gray-500 mb-4">
            Your order has been placed successfully.
          </p>

          {/* Order ID */}
          <div className="text-sm text-gray-600">
            Order ID: <span className="font-semibold">{orderId}</span>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => {
              // Navigate to Track Order page and pass orderId
              navigate("/track", { state: { orderId } });
              onClose();
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Track Your Order
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

      {/* Animation */}
      <style>
        {`
        @keyframes swipeUp {
          from {
            transform: translateY(30%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-swipeUp {
          animation: swipeUp 0.3s ease-out;
        }
        `}
      </style>
    </div>
  );
}