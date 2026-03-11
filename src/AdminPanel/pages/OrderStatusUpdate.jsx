import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function OrderStatusUpdate() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Order Status Update</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Update order delivery status here.</p>
      </div>
    </AdminLayout>
  );
}