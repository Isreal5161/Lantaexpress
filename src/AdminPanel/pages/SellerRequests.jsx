import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function SellerRequests() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Seller Requests</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>New seller signup requests will appear here.</p>
      </div>
    </AdminLayout>
  );
}