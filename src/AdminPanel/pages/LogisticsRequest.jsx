import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function LogisticsRequest() {
  const [requests, setRequests] = useState([]);
  const [reason, setReason] = useState("");
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("logistics_requests")) || [];
    setRequests(data);
  }, []);

  // Approve request and create tracking
  const approveRequest = (req) => {
    const shipments = JSON.parse(localStorage.getItem("logistics_shipments")) || [];
    const newShipment = {
      ...req,
      status: "Approved",
      stage: "Pickup Scheduled",
      trackingId: req.trackingId || `TRK-${Date.now()}`,
      received: false,
      stageTimestamps: { "Approved": new Date().toISOString() }
    };
    shipments.push(newShipment);
    localStorage.setItem("logistics_shipments", JSON.stringify(shipments));

    // Add to history
    const history = JSON.parse(localStorage.getItem("logistics_history")) || [];
    history.push({ ...newShipment, actionDate: new Date().toISOString() });
    localStorage.setItem("logistics_history", JSON.stringify(history));

    // Send notification to user
    const notifications = JSON.parse(localStorage.getItem("user_notifications")) || [];
    notifications.push({
      user: req.name,
      type: "Logistics Request Approved",
      message: `Your logistics request has been approved! Tracking ID: ${newShipment.trackingId}`,
      date: new Date().toISOString()
    });
    localStorage.setItem("user_notifications", JSON.stringify(notifications));

    // Remove from requests
    const updatedRequests = requests.filter(r => r.id !== req.id);
    setRequests(updatedRequests);
    localStorage.setItem("logistics_requests", JSON.stringify(updatedRequests));
  };

  const declineRequest = (req, reasonText) => {
    if (!reasonText) {
      openFeedbackModal("Reason Required", "Enter reason for declining.", "danger");
      return;
    }

    const history = JSON.parse(localStorage.getItem("logistics_history")) || [];
    history.push({ ...req, status: "Declined", reason: reasonText, actionDate: new Date().toISOString() });
    localStorage.setItem("logistics_history", JSON.stringify(history));

    const updatedRequests = requests.filter(r => r.id !== req.id);
    setRequests(updatedRequests);
    localStorage.setItem("logistics_requests", JSON.stringify(updatedRequests));

    const notifications = JSON.parse(localStorage.getItem("user_notifications")) || [];
    notifications.push({
      user: req.name,
      type: "Logistics Request Declined",
      message: `Your logistics request was declined. Reason: ${reasonText}`,
      date: new Date().toISOString()
    });
    localStorage.setItem("user_notifications", JSON.stringify(notifications));
    setReason("");
  };

  // Update shipment status (for admin)
  const updateShipmentStatus = (shipment, newStatus) => {
    const shipments = JSON.parse(localStorage.getItem("logistics_shipments")) || [];
    const updatedShipments = shipments.map(s => {
      if (s.trackingId === shipment.trackingId) {
        const timestamps = { ...s.stageTimestamps };
        timestamps[newStatus] = new Date().toISOString();
        // Send notification
        const notifications = JSON.parse(localStorage.getItem("user_notifications")) || [];
        notifications.push({
          user: s.name,
          type: "Shipment Status Updated",
          message: `Tracking ID ${s.trackingId} status updated to "${newStatus}"`,
          date: new Date().toISOString()
        });
        localStorage.setItem("user_notifications", JSON.stringify(notifications));

        return { ...s, status: newStatus, stageTimestamps: timestamps };
      }
      return s;
    });
    localStorage.setItem("logistics_shipments", JSON.stringify(updatedShipments));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Logistics Requests</h1>

      {requests.length === 0 && <div className="bg-gray-100 p-4 rounded">No new logistics requests at the moment.</div>}

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white border rounded-lg shadow p-4">
            {req.image && <img src={req.image} className="w-full h-40 object-cover rounded mb-3" />}
            <h2 className="font-semibold">{req.name}</h2>
            <p className="text-sm text-gray-600">Phone: {req.phone}</p>
            <p className="text-sm"><strong>Pickup:</strong> {req.pickup}</p>
            <p className="text-sm"><strong>Delivery:</strong> {req.delivery}</p>
            <p className="text-sm text-gray-500">{req.description}</p>
            <p className="text-xs text-gray-400">Request Date: {req.date}</p>
            <p className="text-xs text-gray-400">Tracking ID: <span className="font-semibold">{req.trackingId || "Pending"}</span></p>

            <div className="mt-3 flex flex-col gap-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => approveRequest(req)}>Approve</button>
              <input type="text" placeholder="Reason for declining" value={reason} onChange={e => setReason(e.target.value)} className="border p-2" />
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => declineRequest(req, reason)}>Decline</button>
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