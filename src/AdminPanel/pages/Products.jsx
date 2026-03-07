import React from "react";
import AdminLayout from "../Layout/AdminLayout";

export default function Products() {
  return (
    <AdminLayout>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Products Management
      </h1>

      <div className="bg-white border rounded-lg shadow-sm p-6">

        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Admin can add products</li>
          <li>Edit existing products</li>
          <li>Delete products</li>
          <li>Monitor brand sales</li>
        </ul>

      </div>

    </AdminLayout>
  );
}