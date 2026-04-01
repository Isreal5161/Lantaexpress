import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { FaEdit, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../service/CategoryService";
import ConfirmationModal from "../../components/ConfirmationModal";
import Modal from "../../components/Modal";

export default function SellerProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/admin/products/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Map backend product shape to UI shape used elsewhere
          const mapped = data.map(p => ({
            id: p._id,
            name: p.name,
            brand: p.seller?.brandName || p.brand || "",
            category: p.category || "Uncategorized",
            stock: p.stock || 0,
            price: p.price || 0,
            image: (p.images && p.images[0]) || "/default-product.jpg",
            description: p.description || "",
            status: p.status || "pending",
          }));
          setProducts(mapped);
        } else {
          console.error("Failed to fetch pending products:", data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPending();
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Seller Products</h1>
        <p className="text-sm text-gray-500">
          Products uploaded by sellers are displayed here. Admin can edit, delete, or view orders for any product.
        </p>

        {products.length === 0 ? (
          <p className="text-gray-500 mt-6">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-slate-800">{product.name}</h2>
                  <p className="text-sm text-gray-500">Brand: {product.brand}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  <p className="text-sm font-medium text-green-600">₦{product.price}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <FaEdit /> Edit
                    </button>

                    {/* Approve / Reject for pending products */}
                    {product.status === "pending" && (
                      <>
                        <button
                          onClick={async () => {
                            const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
                            const token = localStorage.getItem("token");
                            try {
                              const res = await fetch(`${API_BASE}/admin/products/${product.id}/approve`, {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const resp = await res.json();
                              if (res.ok) {
                                setProducts(prev => prev.filter(p => p.id !== product.id));
                                openFeedbackModal("Product Approved", "Product approved successfully.");
                              } else {
                                throw new Error(resp.message || 'Failed');
                              }
                            } catch (err) {
                              openFeedbackModal("Approval Failed", err.message || 'Approve failed', "danger");
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={async () => {
                            const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
                            const token = localStorage.getItem("token");
                            try {
                              const res = await fetch(`${API_BASE}/admin/products/${product.id}/reject`, {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const resp = await res.json();
                              if (res.ok) {
                                setProducts(prev => prev.filter(p => p.id !== product.id));
                                openFeedbackModal("Product Rejected", "Product rejected successfully.");
                              } else {
                                throw new Error(resp.message || 'Failed');
                              }
                            } catch (err) {
                              openFeedbackModal("Rejection Failed", err.message || 'Reject failed', "danger");
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        navigate(`/AdminPanel/sellers/orders/${encodeURIComponent(product.brand)}`)
                      }
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <FaArrowRight /> View Orders
                    </button>
                  </div>
                </div>
              </div>
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