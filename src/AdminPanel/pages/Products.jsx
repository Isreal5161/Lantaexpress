import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { createCategory, deleteCategory, getCategories } from "../../service/CategoryService";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
  const token = localStorage.getItem('token');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', category: '', brand: '', description: '', keyFeatures: '' });
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState("");

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
    loadProducts();
    loadCategories();
    const interval = setInterval(loadProducts, 7000);
    return () => clearInterval(interval);
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
      alert('Category created');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!category?.id) {
      return;
    }

    if (!window.confirm(`Remove category "${category.title}"?`)) {
      return;
    }

    try {
      setDeletingCategoryId(category.id);
      await deleteCategory({ id: category.id, token });
      await loadCategories();

      if (filteredCategory === category.title) {
        setFilteredCategory("All");
      }

      alert("Category deleted");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete category");
    } finally {
      setDeletingCategoryId("");
    }
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
      alert('Product approved');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Approve failed');
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
      alert('Product rejected');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Reject failed');
    }
  };

  const displayedProducts =
    filteredCategory === "All"
      ? allProducts
      : allProducts.filter(prod => prod.category === filteredCategory);

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
                    });
                  }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Edit</button>
                  <button onClick={async () => {
                    if (!confirm('Delete this product?')) return;
                    try {
                      const res = await fetch(`${API_BASE}/admin/products/${product.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Delete failed');
                      await loadProducts();
                      alert('Product deleted');
                    } catch (err) { alert(err.message || 'Delete failed'); }
                  }} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
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
              <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border p-2 md:col-span-2" />
              <textarea value={editForm.keyFeatures} onChange={e => setEditForm({...editForm, keyFeatures: e.target.value})} placeholder="Key features, one per line" className="border p-2 md:col-span-2" />
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
                  alert('Product updated');
                } catch (err) { alert(err.message || 'Update failed'); }
              }} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}