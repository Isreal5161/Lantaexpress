import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function OrderLocations() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Order Locations</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Track delivery locations here.</p>
      </div>
    </AdminLayout>
  );
}
