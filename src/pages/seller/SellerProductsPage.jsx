import React, { useState, useEffect, useMemo } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import ConfirmationModal from "../../components/ConfirmationModal";
import { PageLoadErrorState, ProductGridSkeleton } from "../../components/LoadingSkeletons";
import { getSellerPlatformFees } from "../../api/sellerFinance";
import { getSellerApprovalLabel, getSellerApprovalMessage, isSellerApproved } from "../../utils/sellerApproval";
import { getCategories } from "../../service/CategoryService";
import {
  getEffectiveProductPrice,
  getOriginalProductPrice,
  getProductDiscountPercent,
  hasActiveProductDiscount,
} from "../../utils/productPricing";

const API_URL = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const SellerProductsPage = () => {
  const currentSeller = JSON.parse(localStorage.getItem("currentSeller") || "null");
  const sellerApproved = isSellerApproved(currentSeller);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewList, setPreviewList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [categoryDefinitions, setCategoryDefinitions] = useState([]);
  const [feeSettings, setFeeSettings] = useState({ productChargePercent: 0, withdrawalChargePercent: 0 });
  const [productFeeModalOpen, setProductFeeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discountPercent: "",
    stock: "",
    description: "",
    keyFeatures: "",
  });

  const token = localStorage.getItem("sellerToken");

  // Fetch seller's products
  const loadProducts = async () => {
    try {
      setPageError(null);
      const res = await fetch(`${API_URL}/seller/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load seller products");
      }

      setProducts(Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setPageError(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadPageData = async () => {
    setLoadingProducts(true);
    setPageError(null);

    try {
      await loadProducts();
      if (token) {
        const data = await getSellerPlatformFees(token);
        setFeeSettings(data || { productChargePercent: 0, withdrawalChargePercent: 0 });
      }
    } catch (error) {
      console.error("Failed to load seller product page data:", error);
      setPageError(error);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (active) {
          setCategoryDefinitions(data);
        }
      } catch (error) {
        console.error("Failed to load seller product categories:", error);
        if (active) {
          setCategoryDefinitions([]);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const orderedCategories = categoryDefinitions
      .filter((category) => category?.title)
      .map((category) => ({
        id: category.id,
        title: category.title,
      }));
    const orderedCategoryTitles = new Set(orderedCategories.map((category) => category.title));
    const productCategories = Array.from(
      new Set(products.map((product) => product?.category?.trim()).filter(Boolean))
    );

    return [
      ...orderedCategories,
      ...productCategories
        .filter((category) => !orderedCategoryTitles.has(category))
        .map((category) => ({
          id: `product-${category}`,
          title: category,
        })),
    ];
  }, [categoryDefinitions, products]);

  const filteredProducts = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  const pendingProducts = filteredProducts.filter(p => p.status === "pending");
  const approvedProducts = filteredProducts.filter(p => p.status === "approved");

  const handleOpenModal = (product = null) => {
    if (!sellerApproved) {
      alert(getSellerApprovalMessage(currentSeller));
      return;
    }

    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price || "",
        discountPercent: getProductDiscountPercent(product) || "",
        stock: product.stock || "",
        description: product.description || "",
        keyFeatures: Array.isArray(product.keyFeatures) ? product.keyFeatures.join("\n") : "",
      });
      setPreviewList((product.images || []).map(src => ({ src })));
      setVideoPreview(product.video || "");
      setVideoFile(null);
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({ name: "", brand: "", category: "", price: "", discountPercent: "", stock: "", description: "", keyFeatures: "" });
      setPreviewList([]);
      setImageFiles([]);
      setVideoFile(null);
      setVideoPreview("");
    }
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length < 3 || files.length > 5) {
      alert("Please upload between 3 and 5 product images.");
      return;
    }

    setImageFiles(files);
    // create preview urls
    const previews = files.map(f => ({ src: URL.createObjectURL(f), name: f.name }));
    setPreviewList(previews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setVideoFile(null);
      setVideoPreview(editingProduct?.video || "");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // Save product to backend (create or edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductFeeModalOpen(true);
  };

  const submitProduct = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('price', formData.price);
      fd.append('discountPercent', formData.discountPercent);
      fd.append('stock', formData.stock);
      fd.append('category', formData.category);
      fd.append('brand', formData.brand);
      fd.append('keyFeatures', formData.keyFeatures);
      const files = imageFiles || [];
      files.forEach(file => fd.append('images', file));
      if (videoFile) {
        fd.append('video', videoFile);
      }

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
      setProductFeeModalOpen(false);
      setFormData({ name: "", brand: "", category: "", price: "", discountPercent: "", stock: "", description: "", keyFeatures: "" });
      setPreviewList([]);
      setImageFiles([]);
      setVideoFile(null);
      setVideoPreview("");

      if (editingProduct && editingProduct._id) {
        alert('Product updated and sent for admin approval');
      } else {
        alert('Product submitted for approval');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!sellerApproved) {
      alert(getSellerApprovalMessage(currentSeller));
      return;
    }

    setConfirmTarget(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const id = confirmTarget;
    setConfirmOpen(false);
    if (!id) return;
    try {
      setDeleting(true);
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
    } finally {
      setConfirmTarget(null);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {pageError && !loadingProducts ? (
        <PageLoadErrorState error={pageError} onRefresh={loadPageData} />
      ) : (
        <>
      {!sellerApproved && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">{getSellerApprovalLabel(currentSeller)}</p>
          <p className="mt-1">{getSellerApprovalMessage(currentSeller)}</p>
        </div>
      )}

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
      {loadingProducts ? (
        <ProductGridSkeleton count={6} imageClassName="h-32" cardClassName="rounded-lg" />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {pendingProducts.map(p => (
          <div key={p._id} className="bg-white border rounded-lg p-4">
            <div className="flex gap-3">
              <img src={(p.images && p.images[0]) || p.image || '/default-product.jpg'} alt={p.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.brand || p.seller?.brandName || ''}</p>
                <p className="text-sm">Category: {p.category || 'Uncategorized'}</p>
                <div>
                  <p className="text-sm font-medium text-green-600">₦{getEffectiveProductPrice(p).toLocaleString()}</p>
                  {hasActiveProductDiscount(p) && (
                    <p className="text-xs text-gray-400 line-through">₦{getOriginalProductPrice(p).toLocaleString()}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Available stock: {p.stock ?? 0}</p>
                <p className={`text-xs mt-1 font-medium ${(Number(p.stock) || 0) > 0 ? "text-yellow-600" : "text-red-600"}`}>
                  {(Number(p.stock) || 0) > 0 ? `Status: ${p.status || 'pending'}` : "Status: Out of stock"}
                </p>
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
                <div>
                  <p className="text-sm font-medium text-green-600">₦{getEffectiveProductPrice(p).toLocaleString()}</p>
                  {hasActiveProductDiscount(p) && (
                    <p className="text-xs text-gray-400 line-through">₦{getOriginalProductPrice(p).toLocaleString()}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Available stock: {p.stock ?? 0}</p>
                <p className={`text-xs mt-1 font-medium ${(Number(p.stock) || 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                  {(Number(p.stock) || 0) > 0 ? `Status: ${p.status || 'approved'}` : "Status: Out of stock"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleOpenModal(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Floating Add Product button at bottom-right */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => handleOpenModal()}
          disabled={!sellerApproved}
          className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm shadow-lg sm:text-base ${sellerApproved ? "bg-green-600 text-white" : "cursor-not-allowed bg-slate-300 text-slate-600"}`}
        >
          <MdAdd /> Add Product
        </button>
      </div>

      {/* MODAL */}
        </>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-3 py-4 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-6">
          <div className="mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl sm:max-h-[calc(100vh-3rem)]">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
              <h2 className="text-lg font-semibold sm:text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            </div>
            <form id="seller-product-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="col-span-1 md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {Number(feeSettings.productChargePercent) > 0
                  ? `Product earnings charge: ${feeSettings.productChargePercent}% will be deducted from completed sales for this product before it becomes withdrawable.`
                  : "Product earnings charge: Free. No product charge will be deducted from completed sales for this product."}
              </div>
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
                  rows={5}
                  className="w-full border px-3 py-2 rounded"
                />

                <label className="text-sm">Key Features</label>
                <textarea
                  name="keyFeatures"
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyFeatures: e.target.value }))}
                  rows={5}
                  placeholder="Enter one feature per line"
                  className="w-full border px-3 py-2 rounded"
                />
                <p className="text-xs text-gray-500">Each line becomes a bullet in the product details page.</p>
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

                <label className="text-sm">Discount (%)</label>
                <input
                  name="discountPercent"
                  type="number"
                  min="0"
                  max="99.99"
                  step="0.01"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: e.target.value }))}
                  placeholder="Optional discount percent"
                  className="w-full border px-3 py-2 rounded"
                />
                <p className="text-xs text-gray-500">Example: enter `5` to reduce a `₦3,500` product by 5% and sell it at the new lower price.</p>

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
                <p className="text-xs text-gray-500">Upload 3 to 5 clear images showing front, side, back, or close-up views.</p>

                <label className="text-sm">Product Video</label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                  onChange={handleVideoChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Upload one short video to showcase the product in use.</p>

                {videoPreview && (
                  <video src={videoPreview} controls className="mt-2 h-32 w-full rounded object-cover" />
                )}

                <div className="flex gap-2 mt-2 flex-wrap">
                  {previewList.map((p, idx) => (
                    <img key={idx} src={p.src} alt={p.name || `preview-${idx}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              </div>
              </div>
            </form>
            <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setEditingProduct(null); setVideoFile(null); setVideoPreview(""); }}
                  className="w-full rounded bg-gray-300 px-4 py-2 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="seller-product-form"
                  disabled={submitting}
                  className="w-full rounded bg-green-600 px-4 py-2 text-white sm:w-auto"
                >
                  {submitting ? 'Submitting...' : (editingProduct ? 'Save Changes' : 'Submit for Approval')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Confirm Delete"
        message="Delete this product? This action cannot be undone."
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null); }}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
      />
      <ConfirmationModal
        isOpen={productFeeModalOpen}
        title="Confirm Product Submission"
        message={Number(feeSettings.productChargePercent) > 0
          ? `${feeSettings.productChargePercent}% will be deducted from completed earnings for this product before it moves to your withdrawable balance.`
          : "No product charge is set right now. Completed earnings for this product will move to your withdrawable balance without deduction."}
        onCancel={() => {
          if (submitting) return;
          setProductFeeModalOpen(false);
        }}
        onConfirm={submitProduct}
        confirmLabel={editingProduct ? "Save Changes" : "Submit Product"}
        cancelLabel="Cancel"
        loading={submitting}
      />
    </div>
  );
};

export default SellerProductsPage;