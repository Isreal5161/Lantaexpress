// src/AdminPanel/components/LogisticsLocations.jsx

import React, { useState } from "react";
import AdminLayout from "../Layout/AdminLayout";

const mockLocations = [
  {
    id: "LOC001",
    name: "Lagos Main Warehouse",
    city: "Lagos",
    type: "Warehouse",
    status: "Active"
  },
  {
    id: "LOC002",
    name: "Ibadan Logistics Hub",
    city: "Ibadan",
    type: "Hub",
    status: "Active"
  },
  {
    id: "LOC003",
    name: "Abuja Pickup Center",
    city: "Abuja",
    type: "Pickup Center",
    status: "Active"
  }
];

export default function OrderLocations() {

  const [locations, setLocations] = useState(mockLocations);

  const toggleStatus = (id) => {

    const updated = locations.map((loc) =>
      loc.id === id
        ? {
            ...loc,
            status: loc.status === "Active" ? "Disabled" : "Active"
          }
        : loc
    );

    setLocations(updated);
  };

  const statusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <AdminLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-slate-800">
          Logistics Locations
        </h1>

        <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
          + Add Location
        </button>

      </div>

      {/* ---------------- MOBILE CARDS ---------------- */}

      <div className="lg:hidden space-y-4">

        {locations.map((loc) => (

          <div
            key={loc.id}
            className="bg-white border rounded-lg shadow p-4"
          >

            <div className="flex justify-between items-center">

              <h2 className="font-semibold text-slate-800">
                {loc.name}
              </h2>

              <span
                className={`px-2 py-1 text-xs rounded ${statusColor(loc.status)}`}
              >
                {loc.status}
              </span>

            </div>

            <p className="text-sm text-gray-600 mt-2">
              <strong>City:</strong> {loc.city}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {loc.type}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              ID: {loc.id}
            </p>

            <div className="flex gap-2 mt-3">

              <button
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => toggleStatus(loc.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs"
              >
                {loc.status === "Active" ? "Disable" : "Activate"}
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}

      <div className="hidden lg:block bg-white border rounded-lg shadow overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead className="bg-gray-100 text-gray-700">

            <tr>
              <th className="p-3 text-left">Location Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {locations.map((loc) => (

              <tr key={loc.id} className="border-t">

                <td className="p-3 font-semibold">
                  {loc.name}
                </td>

                <td className="p-3">{loc.city}</td>

                <td className="p-3">{loc.type}</td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusColor(loc.status)}`}
                  >
                    {loc.status}
                  </span>

                </td>

                <td className="p-3 flex gap-2">

                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(loc.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                  >
                    {loc.status === "Active" ? "Disable" : "Activate"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}