import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { getAdminLogisticsRequests, updateAdminLogisticsStatus } from "../../api/logistics";

const shipmentStages = [
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "In Transit",
  "Arrived at Nearest Hub",
  "Out for Delivery",
  "Delivered",
  "Completed"
];

export default function Logistics() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadShipments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShipments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminLogisticsRequests(token);
      setShipments((data.requests || []).filter((item) => !["Awaiting Dispatch", "Declined", "Cancelled"].includes(item.status)));
    } catch {
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const updateStage = async (recordId, newStage) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await updateAdminLogisticsStatus(recordId, { status: newStage }, token);
      await loadShipments();
    } catch {
      // Keep the current view stable if the update fails.
    }
  };

  const statusColor = (stage) => {
    if (stage === "Completed" || stage === "Delivered") return "bg-green-100 text-green-700";
    if (stage === "Out for Delivery") return "bg-blue-100 text-blue-700";
    if (stage === "In Transit") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <AdminLayout>
      <div className="pb-20 md:pb-0">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Logistics Management
        </h1>

        {loading ? <div className="rounded bg-gray-100 p-4">Loading logistics shipments...</div> : null}

        {/* ---------------- MOBILE CARDS ---------------- */}
        <div className="lg:hidden space-y-4">
          {shipments.map(item => (
            <div key={item.recordId} className="bg-white border rounded-lg shadow p-4">
              <div className="flex gap-3 mb-3">
                {item.image && (
                  <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h2 className="font-semibold text-slate-800">{item.productName}</h2>
                  <p className="text-xs text-gray-500">Tracking: {item.trackingId}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600"><strong>Customer:</strong> {item.userName}</p>
              <p className="text-sm text-gray-600"><strong>Pickup:</strong> {item.pickup}</p>
              <p className="text-sm text-gray-600"><strong>Delivery:</strong> {item.delivery}</p>
              <p className="text-sm text-gray-600"><strong>Amount:</strong> ₦ {Number(item.amount || 0).toLocaleString()}</p>

              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-3">
                <label className="text-xs text-gray-500">Update Shipment Stage</label>
                <select
                  value={item.status}
                  onChange={(e) => updateStage(item.recordId, e.target.value)}
                  className="w-full border rounded p-2 text-sm mt-1"
                >
                  {shipmentStages.map(stage => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- DESKTOP TABLE ---------------- */}
        <div className="hidden lg:block bg-white border rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Pickup</th>
                <th className="p-3 text-left">Delivery</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(item => (
                <tr key={item.recordId} className="border-t">
                  <td className="p-3 flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.productName} className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-xs text-gray-500">{item.trackingId}</p>
                    </div>
                  </td>
                  <td className="p-3">{item.userName}</td>
                  <td className="p-3">{item.pickup}</td>
                  <td className="p-3">{item.delivery}</td>
                  <td className="p-3">₦ {Number(item.amount || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) => updateStage(item.recordId, e.target.value)}
                      className="border rounded p-1 text-sm"
                    >
                      {shipmentStages.map(stage => (
                        <option key={stage}>{stage}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}