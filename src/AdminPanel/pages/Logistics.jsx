import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import { getAdminLogisticsRequests, updateAdminLogisticsStatus } from "../../api/logistics";
import { TablePanelSkeleton } from "../../components/LoadingSkeletons";

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
  const [processingId, setProcessingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const getAvailableStages = (currentStatus) => {
    const startIndex = Math.max(shipmentStages.indexOf(currentStatus), 0);
    return shipmentStages.slice(startIndex);
  };

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
      const nextShipments = (data.requests || []).filter((item) => !["Awaiting Dispatch", "Declined", "Cancelled"].includes(item.status));
      setShipments(nextShipments);
      setDrafts(Object.fromEntries(nextShipments.map((item) => [item.recordId, {
        status: item.status,
        adminNotes: item.adminNotes || "",
      }])));
    } catch (error) {
      setShipments([]);
      openFeedbackModal("Unable to Load Shipments", error.message || "Failed to load logistics requests.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const updateDraft = (recordId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [recordId]: {
        ...current[recordId],
        [field]: value,
      },
    }));
  };

  const updateStage = async (recordId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const draft = drafts[recordId];
    if (!draft?.status) {
      openFeedbackModal("Status Required", "Choose a tracking status before saving.", "neutral");
      return;
    }

    try {
      setProcessingId(recordId);
      const data = await updateAdminLogisticsStatus(recordId, {
        status: draft.status,
        adminNotes: draft.adminNotes,
      }, token);

      const updatedBooking = data?.booking;
      if (updatedBooking) {
        setShipments((current) => current.map((item) => (item.recordId === recordId ? updatedBooking : item)));
        setDrafts((current) => ({
          ...current,
          [recordId]: {
            status: updatedBooking.status,
            adminNotes: updatedBooking.adminNotes || "",
          },
        }));
      }
    } catch (error) {
      openFeedbackModal("Status Update Failed", error.message || "Unable to update logistics tracking status.", "danger");
    } finally {
      setProcessingId(null);
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

        {loading ? <TablePanelSkeleton columns={7} rows={5} mobileCards={4} /> : null}

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
              <p className="text-sm text-gray-600"><strong>Phone:</strong> {item.phone}</p>
              <p className="text-sm text-gray-600"><strong>Pickup:</strong> {item.pickup}</p>
              <p className="text-xs text-gray-500">{item.pickupLocation?.lga || ""}{item.pickupLocation?.state ? `, ${item.pickupLocation.state}` : ""}</p>
              <p className="text-sm text-gray-600"><strong>Delivery:</strong> {item.delivery}</p>
              <p className="text-xs text-gray-500">{item.deliveryLocation?.lga || ""}{item.deliveryLocation?.state ? `, ${item.deliveryLocation.state}` : ""}</p>
              <p className="text-sm text-gray-600"><strong>Service:</strong> {item.serviceType}</p>
              <p className="text-sm text-gray-600"><strong>Urgency:</strong> {item.urgency}</p>
              <p className="text-sm text-gray-600"><strong>Amount:</strong> ₦ {Number(item.amount || 0).toLocaleString()}</p>

              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-3">
                <label className="text-xs text-gray-500">Update Shipment Stage</label>
                <select
                  value={drafts[item.recordId]?.status || item.status}
                  onChange={(e) => updateDraft(item.recordId, "status", e.target.value)}
                  className="w-full border rounded p-2 text-sm mt-1"
                >
                  {getAvailableStages(item.status).map(stage => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
                <textarea
                  value={drafts[item.recordId]?.adminNotes || ""}
                  onChange={(event) => updateDraft(item.recordId, "adminNotes", event.target.value)}
                  placeholder="Admin notes or dispatch comment"
                  className="mt-2 min-h-24 w-full rounded border p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => updateStage(item.recordId)}
                  disabled={processingId === item.recordId}
                  className="mt-2 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {processingId === item.recordId ? "Saving..." : "Save update"}
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
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Route</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Amount</th>
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
                  <td className="p-3">
                    <p className="font-medium text-slate-800">{item.userName}</p>
                    <p className="text-xs text-gray-500">{item.phone}</p>
                    <p className="text-xs text-gray-500">{item.userEmail || "No email"}</p>
                  </td>
                  <td className="p-3 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Pickup</p>
                    <p>{item.pickup}</p>
                    <p className="mb-2 text-gray-500">{item.pickupLocation?.lga || ""}{item.pickupLocation?.state ? `, ${item.pickupLocation.state}` : ""}</p>
                    <p className="font-semibold text-slate-800">Delivery</p>
                    <p>{item.delivery}</p>
                    <p className="text-gray-500">{item.deliveryLocation?.lga || ""}{item.deliveryLocation?.state ? `, ${item.deliveryLocation.state}` : ""}</p>
                  </td>
                  <td className="p-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">{item.serviceType}</p>
                    <p className="text-xs text-gray-500">Urgency: {item.urgency}</p>
                    <p className="text-xs text-gray-500">Distance: {item.distanceText || "Estimated route"}</p>
                  </td>
                  <td className="p-3">₦ {Number(item.amount || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={drafts[item.recordId]?.status || item.status}
                      onChange={(e) => updateDraft(item.recordId, "status", e.target.value)}
                      className="mb-2 w-full border rounded p-1 text-sm"
                    >
                      {getAvailableStages(item.status).map(stage => (
                        <option key={stage}>{stage}</option>
                      ))}
                    </select>
                    <textarea
                      value={drafts[item.recordId]?.adminNotes || ""}
                      onChange={(event) => updateDraft(item.recordId, "adminNotes", event.target.value)}
                      placeholder="Admin notes"
                      className="mb-2 min-h-20 w-full rounded border p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => updateStage(item.recordId)}
                      disabled={processingId === item.recordId}
                      className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {processingId === item.recordId ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <ConfirmationModal
        isOpen={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onCancel={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        onConfirm={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        confirmLabel="OK"
        hideCancel
        tone={feedbackModal.tone}
      />
      </div>
    </AdminLayout>
  );
}