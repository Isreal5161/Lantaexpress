import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import { getAdminLogisticsRequests, updateAdminLogisticsStatus } from "../../api/logistics";
import { TablePanelSkeleton } from "../../components/LoadingSkeletons";

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

      {loading ? <TablePanelSkeleton columns={5} rows={4} mobileCards={4} /> : null}
      {!loading && requests.length === 0 ? <div className="rounded bg-gray-100 p-4">No new logistics requests at the moment.</div> : null}

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.recordId} className="rounded-lg border bg-white p-4 shadow">
            {request.image ? <img src={request.image} alt={request.productName} className="mb-3 h-40 w-full rounded object-cover" /> : null}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">{request.userName}</h2>
                <p className="text-sm text-gray-600">Phone: {request.phone}</p>
                <p className="text-sm text-gray-600">Email: {request.userEmail || "Not supplied"}</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {request.status}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                <p><strong>Service:</strong> {request.serviceType}</p>
                <p className="mt-1"><strong>Urgency:</strong> {request.urgency}</p>
                <p className="mt-1"><strong>Distance:</strong> {request.distanceText || "Estimated route"}</p>
                <p className="mt-1"><strong>Duration:</strong> {request.durationText || "Updating"}</p>
                <p className="mt-1"><strong>Amount:</strong> ₦ {Number(request.amount || 0).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                <p><strong>Tracking ID:</strong> {request.trackingId}</p>
                <p className="mt-1"><strong>Request No:</strong> {request.requestNumber}</p>
                <p className="mt-1"><strong>Date:</strong> {new Date(request.createdAt).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3 text-sm sm:col-span-2">
                <p className="font-semibold text-slate-900">Pickup</p>
                <p className="mt-1 text-slate-700">{request.pickup}</p>
                <p className="mt-1 text-xs text-slate-500">{request.pickupLocation?.lga || ""}{request.pickupLocation?.state ? `, ${request.pickupLocation.state}` : ""}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3 text-sm sm:col-span-2">
                <p className="font-semibold text-slate-900">Delivery</p>
                <p className="mt-1 text-slate-700">{request.delivery}</p>
                <p className="mt-1 text-xs text-slate-500">{request.deliveryLocation?.lga || ""}{request.deliveryLocation?.state ? `, ${request.deliveryLocation.state}` : ""}</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">{request.description}</p>

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