import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { createCategory, deleteCategory, getCategories } from "../../service/CategoryService";
import ConfirmationModal from "../../components/ConfirmationModal";
import Modal from "../../components/Modal";
import { ProductGridSkeleton, SkeletonBlock } from "../../components/LoadingSkeletons";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
  const token = localStorage.getItem('token');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', category: '', brand: '', description: '', keyFeatures: '', discountPrice: '', discountPercent: '', discountEndsAt: '', isFlashSale: false, flashSaleEndsAt: '', isMostWanted: false });
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", onConfirm: null, tone: "default", confirmLabel: "OK" });
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const openConfirmModal = ({ title, message, onConfirm, tone = "default", confirmLabel = "Confirm" }) => {
    setConfirmModal({ open: true, title, message, onConfirm, tone, confirmLabel });
  };

  const availableCategories = useMemo(() => {
    const fetchedCategories = categories.map((category) => ({
      id: category.id,
      title: category.title,
    }));

    const categoryMap = new Map(
      fetchedCategories
        .filter((category) => category.title)
        .map((category) => [category.title, category])
    );

    [...allProducts, ...pendingProducts].forEach((product) => {
      const title = product?.category?.trim();
      if (!title || categoryMap.has(title)) {
        return;
      }

      categoryMap.set(title, {
        id: `product-${title}`,
        title,
      });
    });

    return Array.from(categoryMap.values());
  }, [allProducts, categories, pendingProducts]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
      setCategories([]);
    }
  };

  // Load products from backend
  const loadProducts = async () => {
    try {
      const resAll = await fetch(`${API_BASE}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all = await resAll.json();

      const resPending = await fetch(`${API_BASE}/admin/products/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = await resPending.json();

      // Map shapes to UI expected fields
      const mappedAll = (all || []).map(p => ({
        id: p._id,
        name: p.name,
        brand: p.brand || p.seller?.brandName || '',
        category: p.category || '',
        stock: p.stock || 0,
        price: p.price || 0,
        discountPrice: p.discountPrice ?? '',
        discountPercent: p.discountPercent ?? '',
        discountEndsAt: p.discountEndsAt || '',
        isFlashSale: Boolean(p.isFlashSale),
        flashSaleEndsAt: p.flashSaleEndsAt || '',
        isMostWanted: Boolean(p.isMostWanted),
        image: (p.images && p.images[0]) || '/default-product.jpg',
        status: p.status || 'approved',
        raw: p,
      }));

      const mappedPending = (pending || []).map(p => ({
        id: p._id,
        name: p.name,
        brand: p.brand || p.seller?.brandName || '',
        category: p.category || '',
        stock: p.stock || 0,
        price: p.price || 0,
        discountPrice: p.discountPrice ?? '',
        discountPercent: p.discountPercent ?? '',
        discountEndsAt: p.discountEndsAt || '',
        isFlashSale: Boolean(p.isFlashSale),
        flashSaleEndsAt: p.flashSaleEndsAt || '',
        isMostWanted: Boolean(p.isMostWanted),
        image: (p.images && p.images[0]) || '/default-product.jpg',
        status: p.status || 'pending',
        raw: p,
      }));

      setAllProducts(mappedAll);
      setPendingProducts(mappedPending);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      setLoading(true);
      await Promise.all([loadProducts(), loadCategories()]);
      if (isMounted) {
        setLoading(false);
      }
    };

    initializePage();
    const interval = setInterval(loadProducts, 7000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) {
      return;
    }

    try {
      setCreatingCategory(true);
      await createCategory({ title: newCategoryTitle, token });
      setNewCategoryTitle('');
      await loadCategories();
      openFeedbackModal('Category Created', 'Category created successfully.');
    } catch (err) {
      console.error(err);
      openFeedbackModal('Category Creation Failed', err.message || 'Failed to create category', 'danger');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!category?.id) {
      return;
    }

    openConfirmModal({
      title: 'Remove Category',
      message: `Remove category "${category.title}"?`,
      tone: 'danger',
      confirmLabel: 'Remove',
      onConfirm: async () => {
        try {
          setDeletingCategoryId(category.id);
          await deleteCategory({ id: category.id, token });
          await loadCategories();

          if (filteredCategory === category.title) {
            setFilteredCategory("All");
          }

          openFeedbackModal("Category Deleted", "Category deleted successfully.");
        } catch (err) {
          console.error(err);
          openFeedbackModal("Delete Failed", err.message || "Failed to delete category", 'danger');
        } finally {
          setDeletingCategoryId("");
        }
      },
    });
  };

  // Approve seller product (call backend)
  const handleApprove = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/admin/products/${product.id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Approve failed');
      await loadProducts();
      openFeedbackModal('Product Approved', 'Product approved successfully.');
    } catch (err) {
      console.error(err);
      openFeedbackModal('Approval Failed', err.message || 'Approve failed', 'danger');
    }
  };

  // Decline seller product
  const handleDecline = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/admin/products/${product.id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reject failed');
      await loadProducts();
      openFeedbackModal('Product Rejected', 'Product rejected successfully.');
    } catch (err) {
      console.error(err);
      openFeedbackModal('Rejection Failed', err.message || 'Reject failed', 'danger');
    }
  };

  const displayedProducts =
    filteredCategory === "All"
      ? allProducts
      : allProducts.filter(prod => prod.category === filteredCategory);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-64 rounded-full" />
            <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <SkeletonBlock className="h-6 w-48 rounded-full" />
              <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <SkeletonBlock className="h-10 flex-1 rounded-xl" />
                <SkeletonBlock className="h-10 w-36 rounded-xl" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={`category-skeleton-${index}`} className="h-9 w-28 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SkeletonBlock className="h-6 w-52 rounded-full" />
            <ProductGridSkeleton count={3} imageClassName="h-48" cardClassName="border-yellow-200 bg-yellow-50" />
          </div>

          <div className="space-y-3">
            <SkeletonBlock className="h-6 w-36 rounded-full" />
            <ProductGridSkeleton count={6} imageClassName="h-48" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Products Management</h1>

      {/* Pending Products Alert */}
      {pendingProducts.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          ⚠️ You have {pendingProducts.length} pending product{pendingProducts.length > 1 ? "s" : ""}.
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Category Management</h2>
        <p className="mt-1 text-sm text-slate-500">New categories added here become available to sellers and storefront pages.</p>
        <form onSubmit={handleCreateCategory} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            placeholder="Add new category"
            className="flex-1 rounded border px-3 py-2"
          />
          <button type="submit" disabled={creatingCategory} className="rounded bg-green-600 px-4 py-2 text-white">
            {creatingCategory ? 'Adding...' : 'Add Category'}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">No categories available yet.</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                <span>{category.title}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={deletingCategoryId === category.id}
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {deletingCategoryId === category.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="All">All Categories</option>
          {availableCategories.map(cat => (
            <option key={cat.id} value={cat.title}>{cat.title}</option>
          ))}
        </select>
      </div>

      {/* Pending Seller Products */}
      {pendingProducts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Seller Products</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pendingProducts.map(product => (
              <div key={product.id} className="bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm p-4 flex flex-col">
                <img src={product.imagePreview || product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <p className="text-sm font-medium mt-1">₦{product.price}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {product.discountPrice ? <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">Discount live</span> : null}
                  {product.isFlashSale ? <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Flash sale</span> : null}
                  {product.isMostWanted ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Most wanted</span> : null}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleApprove(product)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Approve</button>
                  <button onClick={() => handleDecline(product)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        {displayedProducts.length === 0 ? (
          <p className="text-gray-500">No products found in this category.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map(product => (
              <div key={product.id} className="bg-white border rounded-xl shadow-sm p-4 flex flex-col">
                <img src={product.imagePreview || product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <p className="text-sm font-medium mt-1">₦{product.price}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {product.discountPrice ? <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">Discount live</span> : null}
                  {product.isFlashSale ? <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Flash sale</span> : null}
                  {product.isMostWanted ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Most wanted</span> : null}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => {
                    setEditingProduct(product);
                    setEditForm({
                      name: product.name,
                      price: product.price,
                      stock: product.stock,
                      category: product.category,
                      brand: product.brand,
                      description: product.description || '',
                      keyFeatures: Array.isArray(product.raw?.keyFeatures) ? product.raw.keyFeatures.join('\n') : '',
                      discountPrice: product.raw?.discountPrice ?? '',
                      discountPercent: product.raw?.discountPercent ?? '',
                      discountEndsAt: product.raw?.discountEndsAt ? String(product.raw.discountEndsAt).slice(0, 16) : '',
                      isFlashSale: Boolean(product.raw?.isFlashSale),
                      flashSaleEndsAt: product.raw?.flashSaleEndsAt ? String(product.raw.flashSaleEndsAt).slice(0, 16) : '',
                      isMostWanted: Boolean(product.raw?.isMostWanted),
                    });
                  }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Edit</button>
                  <button onClick={() => openConfirmModal({
                    title: 'Delete Product',
                    message: 'Delete this product?',
                    tone: 'danger',
                    confirmLabel: 'Delete',
                    onConfirm: async () => {
                      try {
                        const res = await fetch(`${API_BASE}/admin/products/${product.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || 'Delete failed');
                        await loadProducts();
                        openFeedbackModal('Product Deleted', 'Product deleted successfully.');
                      } catch (err) { openFeedbackModal('Delete Failed', err.message || 'Delete failed', 'danger'); }
                    },
                  })} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Modal */}
      <Modal isOpen={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} panelClassName="max-w-2xl">
          <div className="bg-white rounded-[24px] w-full p-6">
            <h3 className="text-lg font-semibold mb-3">Edit Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border p-2" />
              <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="border p-2" />
              <input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} className="border p-2" />
              <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="border p-2">
                <option value="">Select Category</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.title}>{category.title}</option>
                ))}
              </select>
              <input value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} className="border p-2" />
              <input type="number" value={editForm.discountPrice} onChange={e => setEditForm({...editForm, discountPrice: e.target.value})} placeholder="Discount price" className="border p-2" />
              <input type="number" value={editForm.discountPercent} onChange={e => setEditForm({...editForm, discountPercent: e.target.value})} placeholder="Discount percent" className="border p-2" />
              <input type="datetime-local" value={editForm.discountEndsAt} onChange={e => setEditForm({...editForm, discountEndsAt: e.target.value})} className="border p-2 md:col-span-2" />
              <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border p-2 md:col-span-2" />
              <textarea value={editForm.keyFeatures} onChange={e => setEditForm({...editForm, keyFeatures: e.target.value})} placeholder="Key features, one per line" className="border p-2 md:col-span-2" />
              <label className="flex items-center gap-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
                <input type="checkbox" checked={editForm.isFlashSale} onChange={e => setEditForm({...editForm, isFlashSale: e.target.checked})} />
                Feature this product in flash sales
              </label>
              <label className="flex items-center gap-3 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-700">
                <input type="checkbox" checked={editForm.isMostWanted} onChange={e => setEditForm({...editForm, isMostWanted: e.target.checked})} />
                Feature this product in most wanted sales
              </label>
              <input type="datetime-local" value={editForm.flashSaleEndsAt} onChange={e => setEditForm({...editForm, flashSaleEndsAt: e.target.value})} disabled={!editForm.isFlashSale} className="border p-2 md:col-span-2 disabled:bg-slate-100" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingProduct(null)} className="px-3 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={async () => {
                try {
                  const res = await fetch(`${API_BASE}/admin/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(editForm),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || 'Update failed');
                  setEditingProduct(null);
                  await loadProducts();
                  openFeedbackModal('Product Updated', 'Product updated successfully.');
                } catch (err) { openFeedbackModal('Update Failed', err.message || 'Update failed', 'danger'); }
              }} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
      </Modal>
      <ConfirmationModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal({ open: false, title: "", message: "", onConfirm: null, tone: "default", confirmLabel: "OK" })}
        onConfirm={async () => {
          const action = confirmModal.onConfirm;
          setConfirmModal({ open: false, title: "", message: "", onConfirm: null, tone: "default", confirmLabel: "OK" });
          if (action) {
            await action();
          }
        }}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel="Cancel"
        tone={confirmModal.tone}
      />
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