import React from "react";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p>{message}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
