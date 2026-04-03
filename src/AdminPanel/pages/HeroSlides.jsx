import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import { getDefaultHeroSlides } from "../../service/HeroService";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
const HERO_SLOT_NUMBERS = [1, 2, 3];

const createDefaultForm = (slotNumber) => ({
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
  sortOrder: slotNumber,
  isActive: true,
  media: null,
});

const createFormFromSlide = (slide, slotNumber) => ({
  eyebrow: slide?.eyebrow || "",
  title: slide?.title || "",
  highlight: slide?.highlight || "",
  desc: slide?.desc || "",
  primaryText: slide?.primaryText || "Shop now",
  primaryLink: slide?.primaryLink || "/shop",
  secondaryText: slide?.secondaryText || "Learn more",
  secondaryLink: slide?.secondaryLink || "/shop",
  badge: slide?.badge || "Featured",
  metrics: Array.isArray(slide?.metrics) ? slide.metrics.join("\n") : "",
  imageFit: slide?.imageFit || "object-contain",
  accent: slide?.accent || "from-emerald-600 via-green-600 to-lime-500",
  surface: slide?.surface || "from-emerald-50 via-white to-lime-50",
  sortOrder: slotNumber,
  isActive: slide?.isActive !== false,
  media: null,
});

const buildInitialForms = (slides) => {
  const forms = {};

  HERO_SLOT_NUMBERS.forEach((slotNumber) => {
    const slotSlide = slides.find((slide) => Number(slide.sortOrder) === slotNumber) || null;
    forms[slotNumber] = createFormFromSlide(slotSlide, slotNumber);
  });

  return forms;
};

export default function HeroSlidesPage() {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const [slides, setSlides] = useState([]);
  const [slotForms, setSlotForms] = useState(() => buildInitialForms([]));
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const hasSeededDefaultsRef = useRef(false);

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, title: "", message: "", tone: "default" });
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

      const nextSlides = Array.isArray(data) ? data : [];

      if (nextSlides.length === 0 && !hasSeededDefaultsRef.current) {
        hasSeededDefaultsRef.current = true;
        await syncDefaultSlides();
        return;
      }

      setSlides(nextSlides);
      setSlotForms(buildInitialForms(nextSlides));
    } catch (error) {
      console.error(error);
      openFeedbackModal("Load Failed", error.message || "Failed to load hero slides", "danger");
    } finally {
      setLoading(false);
    }
  };

  const syncDefaultSlides = async () => {
    const defaultSlides = getDefaultHeroSlides().slice(0, HERO_SLOT_NUMBERS.length);

    await Promise.all(
      defaultSlides.map((slide, index) => {
        const payload = new FormData();
        payload.append("eyebrow", slide.eyebrow || "");
        payload.append("title", slide.title || "");
        payload.append("highlight", slide.highlight || "");
        payload.append("desc", slide.desc || "");
        payload.append("primaryText", slide.primaryText || "Shop now");
        payload.append("primaryLink", slide.primaryLink || "/shop");
        payload.append("secondaryText", slide.secondaryText || "Learn more");
        payload.append("secondaryLink", slide.secondaryLink || "/shop");
        payload.append("badge", slide.badge || "Featured");
        payload.append("metrics", Array.isArray(slide.metrics) ? slide.metrics.join("\n") : "");
        payload.append("imageFit", slide.imageFit || "object-contain");
        payload.append("accent", slide.accent || "from-emerald-600 via-green-600 to-lime-500");
        payload.append("surface", slide.surface || "from-emerald-50 via-white to-lime-50");
        payload.append("sortOrder", String(index + 1));
        payload.append("isActive", String(slide.isActive !== false));
        payload.append("mediaUrl", slide.mediaUrl || "");
        payload.append("mediaType", slide.mediaType || "image");

        return fetch(`${API_BASE}/admin/hero-slides`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }).then(async (seedResponse) => {
          const seedData = await seedResponse.json();
          if (!seedResponse.ok) {
            throw new Error(seedData.message || "Failed to import current hero slides");
          }
        });
      })
    );

    await loadSlides();
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const slotSlides = useMemo(
    () =>
      HERO_SLOT_NUMBERS.map((slotNumber) => ({
        slotNumber,
        slide: slides.find((slide) => Number(slide.sortOrder) === slotNumber) || null,
      })),
    [slides]
  );

  const extraSlides = useMemo(
    () => slides.filter((slide) => !HERO_SLOT_NUMBERS.includes(Number(slide.sortOrder))),
    [slides]
  );

  const updateSlotForm = (slotNumber, key, value) => {
    setSlotForms((currentForms) => ({
      ...currentForms,
      [slotNumber]: {
        ...currentForms[slotNumber],
        [key]: value,
      },
    }));
  };

  const resetSlotForm = (slotNumber) => {
    const existingSlide = slides.find((slide) => Number(slide.sortOrder) === slotNumber) || null;
    setSlotForms((currentForms) => ({
      ...currentForms,
      [slotNumber]: createFormFromSlide(existingSlide, slotNumber),
    }));
  };

  const handleSlotSubmit = async (event, slotNumber, existingSlide) => {
    event.preventDefault();
    const form = slotForms[slotNumber];

    if (!existingSlide && !form.media) {
      openFeedbackModal("Media Required", `Choose an image or video for slide ${slotNumber}.`, "danger");
      return;
    }

    try {
      setSavingSlot(slotNumber);
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "media") {
          if (value) {
            payload.append("media", value);
          }
          return;
        }

        payload.append(key, String(value ?? ""));
      });

      payload.set("sortOrder", String(slotNumber));

      const response = await fetch(
        existingSlide ? `${API_BASE}/admin/hero-slides/${existingSlide._id}` : `${API_BASE}/admin/hero-slides`,
        {
          method: existingSlide ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save hero slide");
      }

      await loadSlides();
      openFeedbackModal(
        existingSlide ? "Hero Slide Updated" : "Hero Slide Added",
        existingSlide ? `Slide ${slotNumber} updated successfully.` : `Slide ${slotNumber} created successfully.`
      );
    } catch (error) {
      console.error(error);
      openFeedbackModal("Save Failed", error.message || "Failed to save hero slide", "danger");
    } finally {
      setSavingSlot(null);
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

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/hero-slides/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete hero slide");
      }

      const deletedSlotNumber = deleteTarget.sortOrder;
      setDeleteTarget(null);
      await loadSlides();
      openFeedbackModal("Hero Slide Deleted", `Slide ${deletedSlotNumber || ""} has been deleted.`.trim());
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
          <p className="mt-1 text-sm text-slate-500">
            The homepage uses three hero slides. Each block below maps directly to Slide 1, Slide 2, and Slide 3.
          </p>
        </div>

        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm">
          <p className="font-semibold">Admin flow</p>
          <p className="mt-1">
            Edit the exact slide slot you want, replace media only when needed, and use save to create or update that slot.
          </p>
        </section>

        {loading ? (
          <div className="rounded-2xl border bg-white p-5 text-sm text-slate-500 shadow-sm">Loading hero slides...</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {slotSlides.map(({ slotNumber, slide }) => {
              const form = slotForms[slotNumber];

              return (
                <section key={slotNumber} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">Slide {slotNumber}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {slide ? "Update the current hero content for this slot." : "No slide assigned yet. Fill the form below to add one."}
                      </p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
                        slide
                          ? slide.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                          : "bg-amber-100 text-amber-700",
                      ].join(" ")}
                    >
                      {slide ? (slide.isActive ? "Active" : "Hidden") : "Empty"}
                    </span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {slide ? (
                      slide.mediaType === "video" ? (
                        <video
                          src={slide.mediaUrl}
                          className="h-48 w-full bg-slate-200 object-contain"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={slide.mediaUrl}
                          alt={slide.highlight || slide.title || `Hero slide ${slotNumber}`}
                          className="h-48 w-full bg-white object-contain p-2"
                        />
                      )
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                        No media uploaded for this slot yet.
                      </div>
                    )}
                  </div>

                  <form onSubmit={(event) => handleSlotSubmit(event, slotNumber, slide)} className="mt-4 grid grid-cols-1 gap-3">
                    <input value={form.eyebrow} onChange={(event) => updateSlotForm(slotNumber, "eyebrow", event.target.value)} placeholder="Eyebrow" className="rounded border px-3 py-2" />
                    <input value={form.badge} onChange={(event) => updateSlotForm(slotNumber, "badge", event.target.value)} placeholder="Badge" className="rounded border px-3 py-2" />
                    <input value={form.title} onChange={(event) => updateSlotForm(slotNumber, "title", event.target.value)} placeholder="Title" className="rounded border px-3 py-2" />
                    <input value={form.highlight} onChange={(event) => updateSlotForm(slotNumber, "highlight", event.target.value)} placeholder="Highlight" className="rounded border px-3 py-2" />
                    <textarea value={form.desc} onChange={(event) => updateSlotForm(slotNumber, "desc", event.target.value)} placeholder="Description" className="rounded border px-3 py-2" rows={3} />
                    <input value={form.primaryText} onChange={(event) => updateSlotForm(slotNumber, "primaryText", event.target.value)} placeholder="Primary button text" className="rounded border px-3 py-2" />
                    <input value={form.primaryLink} onChange={(event) => updateSlotForm(slotNumber, "primaryLink", event.target.value)} placeholder="Primary button link" className="rounded border px-3 py-2" />
                    <input value={form.secondaryText} onChange={(event) => updateSlotForm(slotNumber, "secondaryText", event.target.value)} placeholder="Secondary button text" className="rounded border px-3 py-2" />
                    <input value={form.secondaryLink} onChange={(event) => updateSlotForm(slotNumber, "secondaryLink", event.target.value)} placeholder="Secondary button link" className="rounded border px-3 py-2" />
                    <textarea value={form.metrics} onChange={(event) => updateSlotForm(slotNumber, "metrics", event.target.value)} placeholder="Metrics, one per line or comma separated" className="rounded border px-3 py-2" rows={3} />
                    <select value={form.imageFit} onChange={(event) => updateSlotForm(slotNumber, "imageFit", event.target.value)} className="rounded border px-3 py-2">
                      <option value="object-contain">Contain media</option>
                      <option value="object-cover">Cover media</option>
                    </select>
                    <input value={form.accent} onChange={(event) => updateSlotForm(slotNumber, "accent", event.target.value)} placeholder="Accent gradient classes" className="rounded border px-3 py-2" />
                    <input value={form.surface} onChange={(event) => updateSlotForm(slotNumber, "surface", event.target.value)} placeholder="Surface gradient classes" className="rounded border px-3 py-2" />
                    <label className="flex items-center gap-3 rounded border px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" checked={form.isActive} onChange={(event) => updateSlotForm(slotNumber, "isActive", event.target.checked)} />
                      Show this slide on the homepage
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(event) => updateSlotForm(slotNumber, "media", event.target.files?.[0] || null)}
                      className="rounded border px-3 py-2"
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button type="submit" disabled={savingSlot === slotNumber} className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-green-300">
                        {savingSlot === slotNumber ? "Saving..." : slide ? "Save Changes" : "Create Slide"}
                      </button>
                      <button type="button" onClick={() => resetSlotForm(slotNumber)} className="rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        Reset
                      </button>
                      {slide ? (
                        <>
                          <button type="button" onClick={() => handleToggle(slide)} className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                            {slide.isActive ? "Hide" : "Show"}
                          </button>
                          <button type="button" onClick={() => setDeleteTarget(slide)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </form>
                </section>
              );
            })}
          </div>
        )}

        {!loading && extraSlides.length > 0 ? (
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Other Hero Slides</h2>
            <p className="mt-1 text-sm text-slate-500">
              These slides exist outside the main homepage slots 1 to 3. You can clean them up if they are no longer needed.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {extraSlides.map((slide) => (
                <article key={slide._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{slide.title || slide.highlight || "Untitled slide"}</p>
                      <p className="mt-1 text-xs text-slate-500">Sort order: {slide.sortOrder || 0}</p>
                    </div>
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      {slide.mediaType}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => handleToggle(slide)} className="flex-1 rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                      {slide.isActive ? "Hide" : "Show"}
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(slide)} className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <ConfirmationModal
        isOpen={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onCancel={closeFeedbackModal}
        onConfirm={closeFeedbackModal}
        confirmLabel="OK"
        hideCancel
        tone={feedbackModal.tone}
      />

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Hero Slide"
        message={deleteTarget ? `Delete slide ${deleteTarget.sortOrder || ""}? This cannot be undone.`.trim() : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
      />
    </AdminLayout>
  );
}