// src/pages/seller/SellerProfilePage.jsx
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdStorefront } from "react-icons/md";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { categories } from "../../service/dummyCategories";
import { ProductGridSkeleton, SellerProfileSkeleton } from "../../components/LoadingSkeletons";

const API_URL = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
const API_AUTH = process.env.REACT_APP_API_URL || "https://lantaxpressbackend.onrender.com/api/auth";

const nigeriaStates = [
  "Lagos",
  "Abuja (FCT)",
  "Oyo",
  "Ogun",
  "Rivers",
  "Kano",
  "Kaduna",
  "Anambra",
  "Delta",
  "Enugu",
  "Osun",
  "Ekiti",
];

const categoriesList = [
  "Fashion",
  "Electronics",
  "Beauty",
  "Home & Kitchen",
  "Groceries",
  "Phones & Accessories",
  "Computers",
  "Baby Products",
  "Sports",
  "Health",
];

const SellerProfilePage = () => {
  const { seller: authSeller, login } = useSellerAuth();
  const [seller, setSeller] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    brandName: "",
    description: "",
    categories: [],
    state: "",
    address: "",
  });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewList, setPreviewList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const token = localStorage.getItem("sellerToken");
  const approvedProducts = products.filter((product) => product.status === "approved");

  const syncSellerState = (user) => {
    setSeller(user || {});
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      brandName: user?.brandName || "",
      description: user?.description || "",
      categories: Array.isArray(user?.categories) ? user.categories : [],
      state: user?.state || "",
      address: user?.address || "",
    });
    setLogoPreview(user?.logo || "");
  };

  useEffect(() => {
    const fallbackSeller = authSeller || JSON.parse(localStorage.getItem("currentSeller")) || {};
    syncSellerState(fallbackSeller);
  }, [authSeller]);

  useEffect(() => {
    if (!token) {
      setLoadingProfile(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetch(`${API_AUTH}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");

        if (data.user) {
          syncSellerState(data.user);
          login(data.user);
        }
      } catch (error) {
        console.error("Failed to load seller profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [token]);

  const loadProducts = async () => {
    if (!token) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_URL}/seller/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load seller profile products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleProfileCategory = (category) => {
    setProfileForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category],
    }));
  };

  const handleProfileLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      setSavingProfile(true);
      const payload = new FormData();
      payload.append("name", profileForm.name);
      payload.append("email", profileForm.email);
      payload.append("phone", profileForm.phone);
      payload.append("brandName", profileForm.brandName);
      payload.append("description", profileForm.description);
      payload.append("categories", JSON.stringify(profileForm.categories));
      payload.append("state", profileForm.state);
      payload.append("address", profileForm.address);
      if (logoFile) {
        payload.append("logo", logoFile);
      }

      const res = await fetch(`${API_AUTH}/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      if (data.user) {
        syncSellerState(data.user);
        login(data.user);
      }

      setLogoFile(null);
      setProfileModalOpen(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
    });
    setPreviewList((product.images || []).map((src) => ({ src })));
    setImageFiles([]);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles(files);
    setPreviewList(files.map((file) => ({ src: URL.createObjectURL(file), name: file.name })));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct?._id) return;

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("stock", formData.stock);
      payload.append("category", formData.category);
      payload.append("brand", formData.brand);
      imageFiles.forEach((file) => payload.append("images", file));

      const res = await fetch(`${API_URL}/seller/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save product");

      await loadProducts();
      setModalOpen(false);
      setEditingProduct(null);
      setPreviewList([]);
      setImageFiles([]);
      alert("Product updated and sent for admin approval");
    } catch (error) {
      console.error(error);
      alert(error.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmTarget(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;

    try {
      setDeleting(true);
      setConfirmOpen(false);
      const res = await fetch(`${API_URL}/seller/products/${confirmTarget}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      await loadProducts();
      alert("Product deleted");
    } catch (error) {
      console.error(error);
      alert(error.message || "Delete failed");
    } finally {
      setConfirmTarget(null);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Seller Profile</h2>
        <button
          type="button"
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          <MdEdit size={20} />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      {loadingProfile ? (
        <SellerProfileSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={seller.logo || "/lantalogo1.jpg"}
              alt="Brand Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <>
              <h3 className="text-xl font-bold text-gray-800">{seller.brandName || seller.name || "Your Brand"}</h3>
              {seller.name && <p className="text-sm font-medium text-gray-700">Owner: {seller.name}</p>}
              {seller.email && <p className="text-gray-500">{seller.email}</p>}
              {seller.phone && <p className="text-gray-500">{seller.phone}</p>}
              {(seller.address || seller.state) && (
                <p className="text-gray-500">
                  {[seller.address, seller.state].filter(Boolean).join(", ")}
                </p>
              )}
              {seller.description && <p className="text-sm text-gray-600">{seller.description}</p>}
            </>
          </div>

          <div className="flex gap-6 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Products</p>
              <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                <MdStorefront size={20} /> {approvedProducts.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">Balance</p>
              <p className="text-lg font-bold text-green-600">₦{Number(seller.balance || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Seller Products Preview */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Products</h3>
        {loadingProducts ? (
          <ProductGridSkeleton count={4} imageClassName="h-32" cardClassName="rounded-xl bg-gray-50" />
        ) : approvedProducts.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No approved products yet. Products will appear here after admin approval.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {approvedProducts.map((product) => (
              <div key={product._id} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <img
                  src={(product.images && product.images[0]) || product.image || "/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
                <h4 className="text-gray-800 font-semibold">{product.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{product.brand || seller.brandName || ""}</p>
                <p className="text-gray-500 text-sm">₦{Number(product.price || 0).toLocaleString()}</p>
                <p className="text-gray-400 text-xs">Stock: {product.stock ?? 0}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    <MdEdit size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                  >
                    <MdDelete size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">Update Seller Profile</h2>
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Brand Logo</label>
                <div className="flex items-center gap-4">
                  <img
                    src={logoPreview || seller.logo || "/lantalogo1.jpg"}
                    alt="Seller logo preview"
                    className="h-24 w-24 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <input type="file" accept="image/*" onChange={handleProfileLogoChange} className="w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  value={profileForm.brandName}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, brandName: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <select
                  value={profileForm.state}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, state: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select State</option>
                  {nigeriaStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Store Description</label>
                <textarea
                  value={profileForm.description}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Store Categories</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {categoriesList.map((category) => (
                    <label key={category} className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={profileForm.categories.includes(category)}
                        onChange={() => toggleProfileCategory(category)}
                        className="accent-green-600"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-1 mt-4 flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    setLogoFile(null);
                    setLogoPreview(seller.logo || "");
                    syncSellerState(seller);
                  }}
                  className="rounded bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingProfile} className="rounded bg-green-600 px-4 py-2 text-white">
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Edit Product</h2>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm">Product Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full rounded border px-3 py-2"
                />

                <label className="text-sm">Brand</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                />

                <label className="text-sm">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>

                <label className="text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Price</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                  className="w-full rounded border px-3 py-2"
                />

                <label className="text-sm">Stock (quantity)</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  required
                  className="w-full rounded border px-3 py-2"
                />

                <label className="text-sm">Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full"
                />

                <div className="mt-2 flex flex-wrap gap-2">
                  {previewList.map((preview, index) => (
                    <img
                      key={index}
                      src={preview.src}
                      alt={preview.name || `preview-${index}`}
                      className="h-20 w-20 rounded object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-1 mt-4 flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingProduct(null);
                    setPreviewList([]);
                    setImageFiles([]);
                  }}
                  className="rounded bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-green-600 px-4 py-2 text-white"
                >
                  {submitting ? "Submitting..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Confirm Delete"
        message="Delete this product? This action cannot be undone."
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
      />

    </div>
  );
};

export default SellerProfilePage;