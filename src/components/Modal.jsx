import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-[10000] w-[70%] max-w-[260px] animate-scaleIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white w-9 h-9 flex items-center justify-center shadow-lg text-black font-bold hover:scale-110 transition"
        >
          ✕
        </button>

        {children}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }

          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0 }
            to { transform: scale(1); opacity: 1 }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.35s ease;
          }
        `}
      </style>

    </div>,
    document.body
  );
};

export default Modal;