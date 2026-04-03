import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const SECTION_OPTIONS = [
  { value: "home", label: "Home page flyers" },
  { value: "hot-sales", label: "Hot sales flyers" },
  { value: "flash-sales", label: "Flash sales flyers" },
];

export default function PromotionsPage() {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });
  const [form, setForm] = useState({ section: "home", title: "", link: "/hot-sales", sortOrder: 0, isActive: true, media: null });

  const groupedFlyers = useMemo(() => {
    return SECTION_OPTIONS.map((section) => ({
      ...section,
      items: flyers.filter((flyer) => flyer.section === section.value),
    }));
  }, [flyers]);

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const loadFlyers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/promotions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load promotional flyers");
      }

      setFlyers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      openFeedbackModal("Load Failed", error.message || "Failed to load promotional flyers", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlyers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.media) {
      openFeedbackModal("Media Required", "Choose a flyer image or video before uploading.", "danger");
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("section", form.section);
      payload.append("title", form.title);
      payload.append("link", form.link);
      payload.append("sortOrder", String(form.sortOrder || 0));
      payload.append("isActive", String(form.isActive));
      payload.append("media", form.media);

      const response = await fetch(`${API_BASE}/admin/promotions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload promotional flyer");
      }

      setForm({ section: "home", title: "", link: "/hot-sales", sortOrder: 0, isActive: true, media: null });
      await loadFlyers();
      openFeedbackModal("Flyer Uploaded", "Promotional flyer uploaded successfully.");
    } catch (error) {
      console.error(error);
      openFeedbackModal("Upload Failed", error.message || "Failed to upload promotional flyer", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (flyer) => {
    try {
      const payload = new FormData();
      payload.append("isActive", String(!flyer.isActive));
      const response = await fetch(`${API_BASE}/admin/promotions/${flyer._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update flyer");
      }

      await loadFlyers();
    } catch (error) {
      console.error(error);
      openFeedbackModal("Update Failed", error.message || "Failed to update flyer", "danger");
    }
  };

  const handleDelete = async (flyerId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/promotions/${flyerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete flyer");
      }

      await loadFlyers();
    } catch (error) {
      console.error(error);
      openFeedbackModal("Delete Failed", error.message || "Failed to delete flyer", "danger");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Promotional Flyers</h1>
          <p className="mt-1 text-sm text-slate-500">Upload sharp promo cards for home, hot sales, and flash sales. Images and videos are supported.</p>
        </div>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Upload New Flyer</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <select value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value })} className="rounded border px-3 py-2">
              {SECTION_OPTIONS.map((section) => (
                <option key={section.value} value={section.value}>{section.label}</option>
              ))}
            </select>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Short label e.g. Easter Sale" className="rounded border px-3 py-2" />
            <input value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} placeholder="Link e.g. /hot-sales" className="rounded border px-3 py-2" />
            <input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} placeholder="Display order" className="rounded border px-3 py-2" />
            <label className="flex items-center gap-3 rounded border px-3 py-2 text-sm text-slate-700 md:col-span-2">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
              Show flyer immediately after upload
            </label>
            <input type="file" accept="image/*,video/*" onChange={(event) => setForm({ ...form, media: event.target.files?.[0] || null })} className="rounded border px-3 py-2 md:col-span-2" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={submitting} className="rounded bg-green-600 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-green-300">
                {submitting ? "Uploading..." : "Upload Flyer"}
              </button>
            </div>
          </form>
        </section>

        {loading ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-slate-500 shadow-sm">Loading flyers...</div>
        ) : (
          groupedFlyers.map((group) => (
            <section key={group.value} className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">{group.label}</h2>
              {group.items.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No flyers uploaded for this section yet.</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((flyer) => (
                    <article key={flyer._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {flyer.mediaType === "video" ? (
                        <video src={flyer.image} className="h-48 w-full bg-slate-200 object-contain" autoPlay muted loop playsInline preload="metadata" />
                      ) : (
                        <img src={flyer.image} alt={flyer.title || "Promotion flyer"} className="h-48 w-full bg-white object-contain p-2" />
                      )}
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-800">{flyer.title || "Untitled flyer"}</h3>
                            <p className="text-xs text-slate-500">{flyer.link || "/shop"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${flyer.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                              {flyer.isActive ? "Active" : "Hidden"}
                            </span>
                            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                              {flyer.mediaType || "image"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Order: {flyer.sortOrder || 0}</span>
                          <span>{group.value}</span>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleToggle(flyer)} className="flex-1 rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                            {flyer.isActive ? "Hide" : "Show"}
                          </button>
                          <button type="button" onClick={() => handleDelete(flyer._id)} className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
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