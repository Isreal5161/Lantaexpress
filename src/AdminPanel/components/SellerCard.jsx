// src/AdminPanel/components/SellerCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SellerCard({ seller }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Seller ID</span>
        <span className="font-medium">{seller.id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Name</span>
        <span className="font-medium">{seller.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Brand</span>
        <span className="font-medium">{seller.brand}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">Status</span>
        <span
          className={`px-2 py-1 text-xs rounded ${
            seller.status === "Approved"
              ? "bg-green-100 text-green-700"
              : seller.status === "Pending Approval"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {seller.status}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Products</span>
        <span className="font-medium">{seller.totalProducts}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-slate-500">Balance</span>
        <span className="font-medium">₦{seller.balance.toLocaleString()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => navigate(`/sellers/${seller.id}`)}
          className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
        >
          View
        </button>
        <button
          onClick={() => console.log("Delete seller")}
          className="flex-1 bg-gray-600 text-white text-sm py-2 rounded hover:bg-gray-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}