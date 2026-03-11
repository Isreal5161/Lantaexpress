import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function SellerPayments() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Seller Payments</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Seller withdrawal and payout requests will appear here.</p>
      </div>
    </AdminLayout>
  );
}