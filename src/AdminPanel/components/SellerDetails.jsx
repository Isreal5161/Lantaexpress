// src/AdminPanel/pages/SellerDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import { getSellerApprovalLabel } from "../../utils/sellerApproval";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

export default function SellerDetails() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productActionId, setProductActionId] = useState("");
  const sellerStatus = seller?.status || "";

  useEffect(() => {
    const loadSeller = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin login required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [usersRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/admin/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersJson = await usersRes.json();
        const productsJson = await productsRes.json();

        if (!usersRes.ok) {
          throw new Error(usersJson.message || "Failed to load seller details");
        }

        if (!productsRes.ok) {
          throw new Error(productsJson.message || "Failed to load seller products");
        }

        const foundSeller = (usersJson.users || []).find(
          (user) => user.role === "seller" && user._id === sellerId
        );

        if (!foundSeller) {
          setSeller(null);
          return;
        }

        const sellerProducts = (productsJson || [])
          .filter((product) => (product.seller?._id || product.seller) === sellerId)
          .map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            status: product.status,
            category: product.category,
            stock: product.stock,
            description: product.description,
            images: product.images || [],
            image: product.image || product.images?.[0] || "",
          }));

        setSeller({
          id: foundSeller._id,
          name: foundSeller.name,
          email: foundSeller.email,
          brand: foundSeller.brandName || "No brand name",
          phone: foundSeller.phone || "N/A",
          status: getSellerApprovalLabel(foundSeller),
          balance: 0,
          products: sellerProducts,
        });
      } catch (loadError) {
        setError(loadError.message || "Failed to load seller details");
        setSeller(null);
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [sellerId]);

  const updateProductStatus = async (productId, action) => {
    const token = localStorage.getItem("token");

    if (!token || !seller) {
      return;
    }

    try {
      setProductActionId(productId);
      setError("");

      const response = await fetch(`${API_BASE}/admin/products/${productId}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} product`);
      }

      setSeller((currentSeller) => {
        if (!currentSeller) {
          return currentSeller;
        }

        return {
          ...currentSeller,
          products: currentSeller.products.map((product) =>
            product.id === productId ? { ...product, status: action === "approve" ? "approved" : "rejected" } : product
          ),
        };
      });
    } catch (requestError) {
      setError(requestError.message || `Failed to ${action} product`);
    } finally {
      setProductActionId("");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-6 text-gray-500">Loading seller details...</p>
      </AdminLayout>
    );
  }

  if (!seller) {
    return (
      <AdminLayout>
        <div className="space-y-4 p-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <p>Seller not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <h1 className="text-2xl font-bold">{seller.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> {seller.email}</p>
            <p><span className="font-semibold">Brand:</span> {seller.brand}</p>
            <p><span className="font-semibold">Phone:</span> {seller.phone}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`px-2 py-1 text-xs rounded ${
                sellerStatus === "Approved"
                  ? "bg-green-100 text-green-700"
                  : sellerStatus === "Pending Approval"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {sellerStatus}
              </span>
            </p>
            <p><span className="font-semibold">Balance:</span> ₦{seller.balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          {seller.products.length === 0 ? (
            <p className="text-gray-500">No products submitted</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seller.products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 bg-gray-50 space-y-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {product.images && product.images.length > 0 ? (
                      product.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`img-${idx}`} className="w-full h-24 object-cover rounded" />
                      ))
                    ) : (
                      <img src={product.image || ""} alt={product.name} className="w-full h-24 object-cover rounded" />
                    )}
                  </div>
                  <p><span className="font-semibold">Category:</span> {product.category || "N/A"}</p>
                  <p><span className="font-semibold">Stock:</span> {product.stock || 0}</p>
                  <p><span className="font-semibold">Price:</span> ₦{product.price?.toLocaleString() || 0}</p>
                  <p className="text-gray-700"><span className="font-semibold">Description:</span> {product.description || "No description provided."}</p>

                  <div className="flex gap-2 mt-2">
                    {String(product.status).toLowerCase() === "pending" && (
                      <>
                        <button
                          onClick={() => updateProductStatus(product.id, "approve")}
                          disabled={productActionId === product.id}
                          className="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateProductStatus(product.id, "reject")}
                          disabled={productActionId === product.id}
                          className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {String(product.status).toLowerCase() === "approved" && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Approved</span>
                    )}
                    {String(product.status).toLowerCase() === "rejected" && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Rejected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}