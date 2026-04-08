import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import { getDefaultPromotionFlyers } from "../../service/PromotionService";
import { AdminMediaManagerSkeleton } from "../../components/LoadingSkeletons";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const SECTION_OPTIONS = [
  { value: "home", label: "Home page flyers", defaultLink: "/" },
  { value: "hot-sales", label: "Hot sales flyers", defaultLink: "/hot-sales" },
  { value: "flash-sales", label: "Flash sales flyers", defaultLink: "/flash-sales" },
];

const createNewFlyerForm = (section) => ({
  section,
  title: "",
  link: SECTION_OPTIONS.find((option) => option.value === section)?.defaultLink || "/shop",
  sortOrder: 0,
  isActive: true,
  media: null,
});

const createEditFlyerForm = (flyer) => ({
  section: flyer.section,
  title: flyer.title || "",
  link: flyer.link || "/shop",
  sortOrder: flyer.sortOrder || 0,
  isActive: flyer.isActive !== false,
  media: null,
});

const buildInitialCreateForms = () => {
  const forms = {};
  SECTION_OPTIONS.forEach((option) => {
    forms[option.value] = createNewFlyerForm(option.value);
  });
  return forms;
};

export default function PromotionsPage() {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCreateSection, setSavingCreateSection] = useState(null);
  const [savingEditId, setSavingEditId] = useState(null);
  const [createForms, setCreateForms] = useState(() => buildInitialCreateForms());
  const [editingFlyerId, setEditingFlyerId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [hasSeededDefaults, setHasSeededDefaults] = useState(false);

  const groupedFlyers = useMemo(
    () =>
      SECTION_OPTIONS.map((section) => ({
        ...section,
        items: flyers.filter((flyer) => flyer.section === section.value),
      })),
    [flyers]
  );

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, title: "", message: "", tone: "default" });
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

      const nextFlyers = Array.isArray(data) ? data : [];

      if (nextFlyers.length === 0 && !hasSeededDefaults) {
        setHasSeededDefaults(true);
        await syncDefaultFlyers();
        return;
      }

      setFlyers(nextFlyers);
    } catch (error) {
      console.error(error);
      openFeedbackModal("Load Failed", error.message || "Failed to load promotional flyers", "danger");
    } finally {
      setLoading(false);
    }
  };

  const syncDefaultFlyers = async () => {
    const defaultFlyers = SECTION_OPTIONS.flatMap((section) => getDefaultPromotionFlyers(section.value));

    await Promise.all(
      defaultFlyers.map((flyer, index) => {
        const payload = new FormData();
        payload.append("section", flyer.section);
        payload.append("title", flyer.title || "");
        payload.append("link", flyer.link || "/shop");
        payload.append("sortOrder", String(flyer.sortOrder || index));
        payload.append("isActive", String(flyer.isActive !== false));
        payload.append("image", flyer.image || "");
        payload.append("mediaType", flyer.mediaType || "image");

        return fetch(`${API_BASE}/admin/promotions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }).then(async (seedResponse) => {
          const seedData = await seedResponse.json();
          if (!seedResponse.ok) {
            throw new Error(seedData.message || "Failed to import current promotional flyers");
          }
        });
      })
    );

    await loadFlyers();
  };

  useEffect(() => {
    loadFlyers();
  }, []);

  const updateCreateForm = (section, key, value) => {
    setCreateForms((currentForms) => ({
      ...currentForms,
      [section]: {
        ...currentForms[section],
        [key]: value,
      },
    }));
  };

  const resetCreateForm = (section) => {
    setCreateForms((currentForms) => ({
      ...currentForms,
      [section]: createNewFlyerForm(section),
    }));
  };

  const startEditingFlyer = (flyer) => {
    setEditingFlyerId(flyer._id);
    setEditForm(createEditFlyerForm(flyer));
  };

  const cancelEditingFlyer = () => {
    setEditingFlyerId(null);
    setEditForm(null);
  };

  const handleCreate = async (event, section) => {
    event.preventDefault();
    const form = createForms[section];

    if (!form.media) {
      openFeedbackModal("Media Required", "Choose a flyer image or video before uploading.", "danger");
      return;
    }

    try {
      setSavingCreateSection(section);
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

      resetCreateForm(section);
      await loadFlyers();
      openFeedbackModal("Flyer Uploaded", "Promotional flyer uploaded successfully.");
    } catch (error) {
      console.error(error);
      openFeedbackModal("Upload Failed", error.message || "Failed to upload promotional flyer", "danger");
    } finally {
      setSavingCreateSection(null);
    }
  };

  const handleEditSubmit = async (event, flyerId) => {
    event.preventDefault();

    if (!editForm) {
      return;
    }

    try {
      setSavingEditId(flyerId);
      const payload = new FormData();
      payload.append("section", editForm.section);
      payload.append("title", editForm.title);
      payload.append("link", editForm.link);
      payload.append("sortOrder", String(editForm.sortOrder || 0));
      payload.append("isActive", String(editForm.isActive));
      if (editForm.media) {
        payload.append("media", editForm.media);
      }

      const response = await fetch(`${API_BASE}/admin/promotions/${flyerId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update flyer");
      }

      cancelEditingFlyer();
      await loadFlyers();
      openFeedbackModal("Flyer Updated", "Promotional flyer updated successfully.");
    } catch (error) {
      console.error(error);
      openFeedbackModal("Update Failed", error.message || "Failed to update flyer", "danger");
    } finally {
      setSavingEditId(null);
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

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/promotions/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete flyer");
      }

      setDeleteTarget(null);
      if (editingFlyerId === deleteTarget._id) {
        cancelEditingFlyer();
      }
      await loadFlyers();
      openFeedbackModal("Flyer Deleted", "Promotional flyer deleted successfully.");
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
          <p className="mt-1 text-sm text-slate-500">
            Each section below lets admins add a new flyer, then edit, replace, hide, or delete existing flyers directly.
          </p>
        </div>

        {loading ? (
          <AdminMediaManagerSkeleton sectionCount={3} cardCount={2} />
        ) : (
          groupedFlyers.map((group) => {
            const createForm = createForms[group.value];

            return (
              <section key={group.value} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{group.label}</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage the flyers currently shown in this storefront section.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {group.items.length} saved
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Add new flyer</h3>
                  <form onSubmit={(event) => handleCreate(event, group.value)} className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input value={createForm.title} onChange={(event) => updateCreateForm(group.value, "title", event.target.value)} placeholder="Short label e.g. Easter Sale" className="rounded border px-3 py-2" />
                    <input value={createForm.link} onChange={(event) => updateCreateForm(group.value, "link", event.target.value)} placeholder="Link e.g. /hot-sales" className="rounded border px-3 py-2" />
                    <input type="number" value={createForm.sortOrder} onChange={(event) => updateCreateForm(group.value, "sortOrder", event.target.value)} placeholder="Display order" className="rounded border px-3 py-2" />
                    <label className="flex items-center gap-3 rounded border bg-white px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" checked={createForm.isActive} onChange={(event) => updateCreateForm(group.value, "isActive", event.target.checked)} />
                      Show immediately after upload
                    </label>
                    <input type="file" accept="image/*,video/*" onChange={(event) => updateCreateForm(group.value, "media", event.target.files?.[0] || null)} className="rounded border bg-white px-3 py-2 md:col-span-2" />
                    <div className="md:col-span-2 flex flex-wrap gap-2">
                      <button type="submit" disabled={savingCreateSection === group.value} className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-green-300">
                        {savingCreateSection === group.value ? "Uploading..." : "Add Flyer"}
                      </button>
                      <button type="button" onClick={() => resetCreateForm(group.value)} className="rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                {group.items.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No flyers uploaded for this section yet.</p>
                ) : (
                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    {group.items.map((flyer) => {
                      const isEditing = editingFlyerId === flyer._id;

                      return (
                        <article key={flyer._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          {flyer.mediaType === "video" ? (
                            <video src={flyer.image} className="h-48 w-full bg-slate-200 object-contain" autoPlay muted loop playsInline preload="metadata" />
                          ) : (
                            <img src={flyer.image} alt={flyer.title || "Promotion flyer"} className="h-48 w-full bg-white object-contain p-2" />
                          )}

                          <div className="space-y-3 p-4">
                            <div className="flex items-start justify-between gap-3">
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

                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => handleToggle(flyer)} className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                                {flyer.isActive ? "Hide" : "Show"}
                              </button>
                              <button type="button" onClick={() => startEditingFlyer(flyer)} className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-white">
                                Edit
                              </button>
                              <button type="button" onClick={() => setDeleteTarget(flyer)} className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                                Delete
                              </button>
                            </div>

                            {isEditing && editForm ? (
                              <form onSubmit={(event) => handleEditSubmit(event, flyer._id)} className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
                                <select value={editForm.section} onChange={(event) => setEditForm((current) => ({ ...current, section: event.target.value }))} className="rounded border px-3 py-2">
                                  {SECTION_OPTIONS.map((section) => (
                                    <option key={section.value} value={section.value}>{section.label}</option>
                                  ))}
                                </select>
                                <input value={editForm.title} onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))} placeholder="Flyer title" className="rounded border px-3 py-2" />
                                <input value={editForm.link} onChange={(event) => setEditForm((current) => ({ ...current, link: event.target.value }))} placeholder="Flyer link" className="rounded border px-3 py-2" />
                                <input type="number" value={editForm.sortOrder} onChange={(event) => setEditForm((current) => ({ ...current, sortOrder: event.target.value }))} placeholder="Display order" className="rounded border px-3 py-2" />
                                <label className="flex items-center gap-3 rounded border px-3 py-2 text-sm text-slate-700 md:col-span-2">
                                  <input type="checkbox" checked={editForm.isActive} onChange={(event) => setEditForm((current) => ({ ...current, isActive: event.target.checked }))} />
                                  Show this flyer in the storefront
                                </label>
                                <input type="file" accept="image/*,video/*" onChange={(event) => setEditForm((current) => ({ ...current, media: event.target.files?.[0] || null }))} className="rounded border px-3 py-2 md:col-span-2" />
                                <div className="md:col-span-2 flex flex-wrap gap-2">
                                  <button type="submit" disabled={savingEditId === flyer._id} className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-green-300">
                                    {savingEditId === flyer._id ? "Saving..." : "Save Changes"}
                                  </button>
                                  <button type="button" onClick={cancelEditingFlyer} className="rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })
        )}
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
        title="Delete Flyer"
        message={deleteTarget ? `Delete ${deleteTarget.title || "this flyer"}? This cannot be undone.` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
      />
    </AdminLayout>
  );
}