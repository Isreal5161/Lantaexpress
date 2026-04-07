import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import { getAdminLogisticsRequests, updateAdminLogisticsStatus } from "../../api/logistics";

export default function LogisticsRequest() {
  const [requests, setRequests] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const loadRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRequests([]);
      setLoading(false);
      openFeedbackModal("Admin Login Required", "Please log in as admin to manage logistics requests.", "danger");
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminLogisticsRequests(token);
      setRequests((data.requests || []).filter((request) => request.status === "Awaiting Dispatch"));
    } catch (error) {
      setRequests([]);
      openFeedbackModal("Unable to Load Requests", error.message || "Failed to load logistics requests.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusUpdate = async (request, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const adminNotes = reasons[request.recordId] || "";
    if (status === "Declined" && !adminNotes.trim()) {
      openFeedbackModal("Reason Required", "Enter a reason before declining this logistics request.", "danger");
      return;
    }

    try {
      setProcessingId(request.recordId);
      await updateAdminLogisticsStatus(request.recordId, { status, adminNotes }, token);
      await loadRequests();
    } catch (error) {
      openFeedbackModal("Update Failed", error.message || "Unable to update logistics request status.", "danger");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Logistics Requests</h1>

      {loading ? <div className="rounded bg-gray-100 p-4">Loading logistics requests...</div> : null}
      {!loading && requests.length === 0 ? <div className="rounded bg-gray-100 p-4">No new logistics requests at the moment.</div> : null}

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.recordId} className="rounded-lg border bg-white p-4 shadow">
            {request.image ? <img src={request.image} alt={request.productName} className="mb-3 h-40 w-full rounded object-cover" /> : null}
            <h2 className="font-semibold">{request.userName}</h2>
            <p className="text-sm text-gray-600">Phone: {request.phone}</p>
            <p className="text-sm"><strong>Service:</strong> {request.serviceType}</p>
            <p className="text-sm"><strong>Pickup:</strong> {request.pickup}</p>
            <p className="text-sm"><strong>Delivery:</strong> {request.delivery}</p>
            <p className="text-sm"><strong>Distance:</strong> {request.distanceText || "Estimated route"}</p>
            <p className="text-sm"><strong>Amount:</strong> ₦ {Number(request.amount || 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500">{request.description}</p>
            <p className="text-xs text-gray-400">Request Date: {new Date(request.createdAt).toLocaleString()}</p>
            <p className="text-xs text-gray-400">Tracking ID: <span className="font-semibold">{request.trackingId}</span></p>

            <div className="mt-3 flex flex-col gap-2">
              <button
                className="rounded bg-green-600 px-3 py-1 text-white"
                onClick={() => handleStatusUpdate(request, "Approved")}
                disabled={processingId === request.recordId}
              >
                Approve
              </button>
              <input
                type="text"
                placeholder="Reason for declining"
                value={reasons[request.recordId] || ""}
                onChange={(event) => setReasons((current) => ({ ...current, [request.recordId]: event.target.value }))}
                className="border p-2"
              />
              <button
                className="rounded bg-red-600 px-3 py-1 text-white"
                onClick={() => handleStatusUpdate(request, "Declined")}
                disabled={processingId === request.recordId}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
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
    </AdminLayout>
  );
}