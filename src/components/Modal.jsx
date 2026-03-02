import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-[70%] max-w-[260px]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white w-7 h-7 flex items-center justify-center shadow-md text-sm"
        >
          ✕
        </button>

        {children}

      </div>
    </div>
  );
};

export default Modal;