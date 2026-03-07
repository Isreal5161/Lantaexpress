import React from "react";
import { FaEye, FaEdit, FaBan, FaTrash } from "react-icons/fa";

export default function UserActions({ onView, onEdit, onBan, onDelete }) {
  return (
    <div className="flex gap-2">

      <button
        onClick={onView}
        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
      >
        <FaEye />
      </button>

      <button
        onClick={onEdit}
        className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
      >
        <FaEdit />
      </button>

      <button
        onClick={onBan}
        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
      >
        <FaBan />
      </button>

      <button
        onClick={onDelete}
        className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
      >
        <FaTrash />
      </button>

    </div>
  );
}