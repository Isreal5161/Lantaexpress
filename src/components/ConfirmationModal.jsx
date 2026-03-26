import React from 'react';
import Modal from './Modal';

const ConfirmationModal = ({ isOpen, title, message, onCancel, onConfirm, confirmLabel = 'OK', cancelLabel = 'Cancel', loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="bg-white p-6 rounded-lg w-80">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-200">{cancelLabel}</button>
          <button onClick={onConfirm} className="px-3 py-2 rounded bg-green-600 text-white" disabled={loading}>
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
