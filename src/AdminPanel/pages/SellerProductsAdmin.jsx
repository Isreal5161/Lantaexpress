import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function SellerProductsAdmin() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Seller Products</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Products uploaded by sellers will appear here.</p>
      </div>
    </AdminLayout>
  );
}