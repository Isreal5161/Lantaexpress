import React from "react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  children,
  panelClassName = "",
  showCloseButton = true,
  closeOnOverlay = true,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Content */}
      <div className={`relative z-[10000] mx-auto w-full max-w-[32rem] animate-scaleIn ${panelClassName}`} role="dialog" aria-modal="true">

        {/* Close Button */}
        {showCloseButton ? (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-light leading-none text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:right-4 sm:top-4"
          >
            ×
          </button>
        ) : null}

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
            from { transform: translateY(12px) scale(0.98); opacity: 0 }
            to { transform: translateY(0) scale(1); opacity: 1 }
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