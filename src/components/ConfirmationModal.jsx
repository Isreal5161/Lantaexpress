import React from 'react';
import Modal from './Modal';

const toneClasses = {
  default: 'bg-green-600 hover:bg-green-700',
  danger: 'bg-red-600 hover:bg-red-700',
  neutral: 'bg-slate-900 hover:bg-slate-800',
};

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  loading = false,
  hideCancel = false,
  tone = 'default',
  closeOnOverlay = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} closeOnOverlay={closeOnOverlay} panelClassName="max-w-[34rem]">
      <div className="rounded-[24px] bg-white px-5 py-6 shadow-2xl sm:px-6 sm:py-7">
        {title ? <h3 className="pr-10 text-lg font-bold text-slate-900 sm:text-xl">{title}</h3> : null}
        {message ? <div className="mt-3 text-sm leading-7 text-slate-600">{message}</div> : null}
        <div className={`mt-6 flex ${hideCancel ? 'justify-end' : 'flex-col-reverse sm:flex-row sm:justify-end'} gap-3`}>
          {!hideCancel ? (
            <button onClick={onCancel} className="min-h-11 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto">{cancelLabel}</button>
          ) : null}
          <button onClick={onConfirm} className={`min-h-11 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${toneClasses[tone] || toneClasses.default}`} disabled={loading}>
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
