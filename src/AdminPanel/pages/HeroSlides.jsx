import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

export default function HeroSlidesPage() {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });
  const [form, setForm] = useState({
    eyebrow: "",
    title: "",
    highlight: "",
    desc: "",
    primaryText: "Shop now",
    primaryLink: "/shop",
    secondaryText: "Learn more",
    secondaryLink: "/shop",
    badge: "Featured",
    metrics: "",
    imageFit: "object-contain",
    accent: "from-emerald-600 via-green-600 to-lime-500",
    surface: "from-emerald-50 via-white to-lime-50",
    sortOrder: 0,
    isActive: true,
    media: null,
  });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const loadSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/hero-slides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load hero slides");
      }

      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      openFeedbackModal("Load Failed", error.message || "Failed to load hero slides", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.media) {
      openFeedbackModal("Media Required", "Choose an image or video for the hero slide.", "danger");
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "media") {
          payload.append("media", value);
          return;
        }

        payload.append(key, String(value ?? ""));
      });

      const response = await fetch(`${API_BASE}/admin/hero-slides`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create hero slide");
      }

      setForm({
        eyebrow: "",
        title: "",
        highlight: "",
        desc: "",
        primaryText: "Shop now",
        primaryLink: "/shop",
        secondaryText: "Learn more",
        secondaryLink: "/shop",
        badge: "Featured",
        metrics: "",
        imageFit: "object-contain",
        accent: "from-emerald-600 via-green-600 to-lime-500",
        surface: "from-emerald-50 via-white to-lime-50",
        sortOrder: 0,
        isActive: true,
        media: null,
      });
      await loadSlides();
      openFeedbackModal("Hero Slide Added", "Hero slide created successfully.");
    } catch (error) {
      console.error(error);
      openFeedbackModal("Create Failed", error.message || "Failed to create hero slide", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (slide) => {
    try {
      const payload = new FormData();
      payload.append("isActive", String(!slide.isActive));
      const response = await fetch(`${API_BASE}/admin/hero-slides/${slide._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update hero slide");
      }

      await loadSlides();
    } catch (error) {
      console.error(error);
      openFeedbackModal("Update Failed", error.message || "Failed to update hero slide", "danger");
    }
  };

  const handleDelete = async (slideId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/hero-slides/${slideId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete hero slide");
      }

      await loadSlides();
    } catch (error) {
      console.error(error);
      openFeedbackModal("Delete Failed", error.message || "Failed to delete hero slide", "danger");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hero Slides</h1>
          <p className="mt-1 text-sm text-slate-500">Manage homepage hero text, buttons, photos, and animated videos.</p>
        </div>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Create Hero Slide</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input value={form.eyebrow} onChange={(event) => setForm({ ...form, eyebrow: event.target.value })} placeholder="Eyebrow" className="rounded border px-3 py-2" />
            <input value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} placeholder="Badge" className="rounded border px-3 py-2" />
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Title" className="rounded border px-3 py-2" />
            <input value={form.highlight} onChange={(event) => setForm({ ...form, highlight: event.target.value })} placeholder="Highlight" className="rounded border px-3 py-2" />
            <textarea value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} placeholder="Description" className="rounded border px-3 py-2 md:col-span-2" />
            <input value={form.primaryText} onChange={(event) => setForm({ ...form, primaryText: event.target.value })} placeholder="Primary button text" className="rounded border px-3 py-2" />
            <input value={form.primaryLink} onChange={(event) => setForm({ ...form, primaryLink: event.target.value })} placeholder="Primary button link" className="rounded border px-3 py-2" />
            <input value={form.secondaryText} onChange={(event) => setForm({ ...form, secondaryText: event.target.value })} placeholder="Secondary button text" className="rounded border px-3 py-2" />
            <input value={form.secondaryLink} onChange={(event) => setForm({ ...form, secondaryLink: event.target.value })} placeholder="Secondary button link" className="rounded border px-3 py-2" />
            <textarea value={form.metrics} onChange={(event) => setForm({ ...form, metrics: event.target.value })} placeholder="Metrics, one per line or comma separated" className="rounded border px-3 py-2 md:col-span-2" />
            <select value={form.imageFit} onChange={(event) => setForm({ ...form, imageFit: event.target.value })} className="rounded border px-3 py-2">
              <option value="object-contain">Contain media</option>
              <option value="object-cover">Cover media</option>
            </select>
            <input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} placeholder="Display order" className="rounded border px-3 py-2" />
            <input value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} placeholder="Accent gradient classes" className="rounded border px-3 py-2 md:col-span-2" />
            <input value={form.surface} onChange={(event) => setForm({ ...form, surface: event.target.value })} placeholder="Surface gradient classes" className="rounded border px-3 py-2 md:col-span-2" />
            <label className="flex items-center gap-3 rounded border px-3 py-2 text-sm text-slate-700 md:col-span-2">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
              Show slide immediately after upload
            </label>
            <input type="file" accept="image/*,video/*" onChange={(event) => setForm({ ...form, media: event.target.files?.[0] || null })} className="rounded border px-3 py-2 md:col-span-2" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={submitting} className="rounded bg-green-600 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-green-300">
                {submitting ? "Saving..." : "Add Hero Slide"}
              </button>
            </div>
          </form>
        </section>

        {loading ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-slate-500 shadow-sm">Loading hero slides...</div>
        ) : (
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Existing Hero Slides</h2>
            {slides.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No hero slides created yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {slides.map((slide) => (
                  <article key={slide._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {slide.mediaType === "video" ? (
                      <video src={slide.mediaUrl} className="h-48 w-full bg-slate-200 object-contain" autoPlay muted loop playsInline preload="metadata" />
                    ) : (
                      <img src={slide.mediaUrl} alt={slide.highlight || "Hero slide"} className="h-48 w-full bg-white object-contain p-2" />
                    )}
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{slide.eyebrow}</p>
                          <h3 className="mt-1 font-semibold text-slate-800">{slide.title} {slide.highlight}</h3>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${slide.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                          {slide.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{slide.desc}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{slide.mediaType}</span>
                        <span>Order: {slide.sortOrder || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleToggle(slide)} className="flex-1 rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                          {slide.isActive ? "Hide" : "Show"}
                        </button>
                        <button type="button" onClick={() => handleDelete(slide._id)} className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
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