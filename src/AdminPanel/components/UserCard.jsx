import React from "react";

export default function UserCard({ user, onView, onBan, onDelete }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3">
      
      {/* User Info */}
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">User ID</span>
        <span className="font-medium">{user.id}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Name</span>
        <span className="font-medium">{user.name}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Email</span>
        <span className="font-medium">{user.email}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Orders</span>
        <span>{user.orders}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">Status</span>
        <span
          className={`px-2 py-1 text-xs rounded ${
            user.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={onView}
          className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
        >
          View
        </button>

        <button
          onClick={onBan}
          className={`flex-1 text-white text-sm py-2 rounded hover:opacity-90 ${
            user.status === "Active"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {user.status === "Active" ? "Ban" : "Unban"}
        </button>

        <button
          onClick={onDelete}
          className="flex-1 bg-gray-600 text-white text-sm py-2 rounded hover:bg-gray-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}