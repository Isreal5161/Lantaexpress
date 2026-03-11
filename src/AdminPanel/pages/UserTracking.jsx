import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function UserTracking() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">User Tracking</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Track all user deliveries here.</p>
      </div>
    </AdminLayout>
  );
}