import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { FaEdit, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../service/CategoryService";
import ConfirmationModal from "../../components/ConfirmationModal";
import Modal from "../../components/Modal";
import { ProductGridSkeleton, SkeletonBlock } from "../../components/LoadingSkeletons";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
const FALLBACK_PRODUCT_IMAGE = "/default-product.jpg";

const normalizeProduct = (product) => ({
  id: product._id,
  name: product.name,
  brand: product.seller?.brandName || product.brand || "",
  category: product.category || "Uncategorized",
  stock: product.stock || 0,
  price: product.price || 0,
  image: product.image || product.images?.[0] || FALLBACK_PRODUCT_IMAGE,
  description: product.description || "",
  status: product.status || "pending",
});

export default function SellerProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    stock: 0,
    price: 0,
  });

  const navigate = useNavigate();

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  const loadProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProducts([]);
      setLoadError("Admin login required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError("");

      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch seller products.");
      }

      const mappedProducts = data
        .map(normalizeProduct)
        .sort((left, right) => {
          const brandCompare = (left.brand || "").localeCompare(right.brand || "", undefined, { sensitivity: "base" });
          if (brandCompare !== 0) {
            return brandCompare;
          }

          return (left.name || "").localeCompare(right.name || "", undefined, { sensitivity: "base" });
        });

      setProducts(mappedProducts);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setLoadError(err.message || "Failed to fetch seller products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    getCategories().then(setCategories).catch((error) => {
      console.error("Failed to load admin seller product categories:", error);
      setCategories([]);
    });
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
      price: product.price,
    });
  };

  const handleDelete = (productId) => {
    setDeleteTarget(productId);
    setConfirmDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
    );
    setEditingProduct(null);
  };

  const handleCancel = () => setEditingProduct(null);

  const groupedProducts = products.reduce((groups, product) => {
    const brandName = product.brand || "Unassigned Brand";

    if (!groups[brandName]) {
      groups[brandName] = [];
    }

    groups[brandName].push(product);
    return groups;
  }, {});

  const brandEntries = Object.entries(groupedProducts);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-52 rounded-full" />
            <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
          </div>
          <ProductGridSkeleton count={6} imageClassName="h-48" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Seller Products</h1>
        <p className="text-sm text-gray-500">
          Products uploaded by sellers are grouped by brand here. Admin can review each brand's catalog and jump into that seller's orders.
        </p>

        {loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : null}

        {brandEntries.length === 0 ? (
          <p className="text-gray-500 mt-6">No products available.</p>
        ) : (
          <div className="space-y-8 mt-4">
            {brandEntries.map(([brandName, brandProducts]) => (
              <section key={brandName} className="space-y-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">{brandName}</h2>
                    <p className="text-sm text-gray-500">
                      {brandProducts.length} product{brandProducts.length === 1 ? "" : "s"} linked to this seller brand.
                    </p>
                  </div>
                  {brandName !== "Unassigned Brand" ? (
                    <button
                      onClick={() => navigate(`/AdminPanel/sellers/orders/${encodeURIComponent(brandName)}`)}
                      className="inline-flex items-center gap-2 self-start rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                    >
                      <FaArrowRight /> View Brand Orders
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {brandProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                      />
                      <div className="p-4 space-y-2">
                        <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
                        <p className="text-sm text-gray-500">Category: {product.category}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                        <p className="text-sm text-gray-500">Status: {product.status}</p>
                        <p className="text-sm font-medium text-green-600">₦{product.price}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <FaEdit /> Edit
                          </button>

                          {product.status === "pending" && (
                            <>
                              <button
                                onClick={async () => {
                                  const token = localStorage.getItem("token");
                                  try {
                                    const res = await fetch(`${API_BASE}/admin/products/${product.id}/approve`, {
                                      method: "PUT",
                                      headers: { Authorization: `Bearer ${token}` },
                                    });
                                    const resp = await res.json();
                                    if (res.ok) {
                                      setProducts((prev) =>
                                        prev.map((item) =>
                                          item.id === product.id ? { ...item, status: "approved" } : item
                                        )
                                      );
                                      openFeedbackModal("Product Approved", "Product approved successfully.");
                                    } else {
                                      throw new Error(resp.message || "Failed");
                                    }
                                  } catch (err) {
                                    openFeedbackModal("Approval Failed", err.message || "Approve failed", "danger");
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Approve
                              </button>

                              <button
                                onClick={async () => {
                                  const token = localStorage.getItem("token");
                                  try {
                                    const res = await fetch(`${API_BASE}/admin/products/${product.id}/reject`, {
                                      method: "PUT",
                                      headers: { Authorization: `Bearer ${token}` },
                                    });
                                    const resp = await res.json();
                                    if (res.ok) {
                                      setProducts((prev) =>
                                        prev.map((item) =>
                                          item.id === product.id ? { ...item, status: "rejected" } : item
                                        )
                                      );
                                      openFeedbackModal("Product Rejected", "Product rejected successfully.");
                                    } else {
                                      throw new Error(resp.message || "Failed");
                                    }
                                  } catch (err) {
                                    openFeedbackModal("Rejection Failed", err.message || "Reject failed", "danger");
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => navigate(`/AdminPanel/sellers/orders/${encodeURIComponent(product.brand || brandName)}`)}
                            disabled={!product.brand && brandName === "Unassigned Brand"}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            <FaArrowRight /> View Orders
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Modal isOpen={Boolean(editingProduct)} onClose={handleCancel} panelClassName="max-w-md">
            <div className="bg-white p-6 rounded-[24px] w-full">
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.title}>{category.title}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
        </Modal>
        <ConfirmationModal
          isOpen={confirmDeleteOpen}
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          onCancel={() => { setConfirmDeleteOpen(false); setDeleteTarget(null); }}
          onConfirm={() => {
            setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
            setConfirmDeleteOpen(false);
            setDeleteTarget(null);
            openFeedbackModal("Product Deleted", "Product deleted successfully.");
          }}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          tone="danger"
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
      </div>
    </AdminLayout>
  );
}