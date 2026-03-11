import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function SellerOrdersAdmin() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Seller Orders</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Orders handled by sellers will appear here.</p>
      </div>
    </AdminLayout>
  );
}