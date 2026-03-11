import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function UserOrders() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">User Orders</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>All orders placed by users will appear here.</p>
      </div>
    </AdminLayout>
  );
}