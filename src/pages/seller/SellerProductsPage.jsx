import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { categories } from "../../service/dummyCategories";

const API_URL = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewList, setPreviewList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const token = localStorage.getItem("sellerToken");

  // Fetch seller's products
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/seller/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  const pendingProducts = filteredProducts.filter(p => p.status === "pending");
  const approvedProducts = filteredProducts.filter(p => p.status === "approved");

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
      });
      setPreviewList((product.images || []).map(src => ({ src })));
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({ name: "", brand: "", category: "", price: "", stock: "", description: "" });
      setPreviewList([]);
      setImageFiles([]);
    }
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles(files);
    // create preview urls
    const previews = files.map(f => ({ src: URL.createObjectURL(f), name: f.name }));
    setPreviewList(previews);
  };

  // Save product to backend (create or edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('price', formData.price);
      fd.append('stock', formData.stock);
      fd.append('category', formData.category);
      fd.append('brand', formData.brand);
      const files = imageFiles || [];
      files.forEach(file => fd.append('images', file));

      let res;
      if (editingProduct && editingProduct._id) {
        // update existing product
        res = await fetch(`${API_URL}/seller/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        // create new product
        res = await fetch(`${API_URL}/seller/add-product`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save product');

      await loadProducts();
      setModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", brand: "", category: "", price: "", stock: "", description: "" });
      setPreviewList([]);
      setImageFiles([]);

      if (editingProduct && editingProduct._id) {
        alert('Product updated and sent for admin approval');
      } else {
        alert('Product submitted for approval');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/seller/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      await loadProducts();
      alert('Product deleted');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* UI NOT TOUCHED */}
      <div className="flex gap-4 items-center flex-wrap mt-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.title}>{cat.title}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border w-full"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {pendingProducts.map(p => (
          <div key={p._id} className="bg-white border rounded-lg p-4">
            <div className="flex gap-3">
              <img src={(p.images && p.images[0]) || p.image || '/default-product.jpg'} alt={p.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.brand || p.seller?.brandName || ''}</p>
                <p className="text-sm">Category: {p.category || 'Uncategorized'}</p>
                <p className="text-sm text-green-600 font-medium">₦{p.price}</p>
                <p className="text-xs text-yellow-600 mt-1">Status: {p.status || 'pending'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleOpenModal(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}

        {approvedProducts.map(p => (
          <div key={p._id} className="bg-white border rounded-lg p-4">
            <div className="flex gap-3">
              <img src={(p.images && p.images[0]) || p.image || '/default-product.jpg'} alt={p.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.brand || p.seller?.brandName || ''}</p>
                <p className="text-sm">Category: {p.category || 'Uncategorized'}</p>
                <p className="text-sm text-green-600 font-medium">₦{p.price}</p>
                <p className="text-xs text-green-600 mt-1">Status: {p.status || 'approved'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleOpenModal(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Product button at bottom-right */}
      <div className="fixed right-6 bottom-6 z-40">
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg">
          <MdAdd /> Add Product
        </button>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Product Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <label className="text-sm">Brand</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />

                <label className="text-sm">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>

                <label className="text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Price</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <label className="text-sm">Stock (quantity)</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <label className="text-sm">Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full"
                />

                <div className="flex gap-2 mt-2 flex-wrap">
                  {previewList.map((p, idx) => (
                    <img key={idx} src={p.src} alt={p.name || `preview-${idx}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setModalOpen(false); setEditingProduct(null); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editingProduct ? 'Save Changes' : 'Submit for Approval'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;