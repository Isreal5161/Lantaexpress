import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function Logistics() {
  return (
    <AdminLayout>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Logistics Management
      </h1>

      <div className="bg-white border rounded-lg shadow-sm p-6">

        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Monitor logistics requests</li>
          <li>Manage delivery tracking</li>
          <li>Update shipment progress</li>
          <li>Track delivery status</li>
        </ul>

      </div>

    </AdminLayout>
  );
}