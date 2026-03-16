import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fadeIn">

      <div className="relative w-[70%] max-w-[260px] animate-scaleIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg text-black font-bold hover:scale-110 transition"
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
            from { transform: scale(0.8); opacity:0 }
            to { transform: scale(1); opacity:1 }
          }

          .animate-fadeIn{
            animation: fadeIn 0.3s ease-in-out;
          }

          .animate-scaleIn{
            animation: scaleIn 0.35s ease;
          }
        `}
      </style>

    </div>
  );
};

export default Modal;