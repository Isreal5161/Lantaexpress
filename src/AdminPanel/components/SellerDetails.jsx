// src/AdminPanel/pages/SellerDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import { getSellers, approveProduct, rejectProduct } from "../services/sellerService";

export default function SellerDetails() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const sellers = getSellers();
    const foundSeller = sellers.find((s) => s.id === sellerId);
    if (foundSeller) setSeller(foundSeller);
  }, [sellerId]);

  const handleApproveProduct = (productId) => {
    approveProduct(seller.id, productId);
    const updatedSeller = getSellers().find((s) => s.id === seller.id);
    setSeller(updatedSeller);
  };

  const handleRejectProduct = (productId) => {
    rejectProduct(seller.id, productId);
    const updatedSeller = getSellers().find((s) => s.id === seller.id);
    setSeller(updatedSeller);
  };

  if (!seller) return <AdminLayout><p className="p-6">Seller not found.</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">{seller.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> {seller.email}</p>
            <p><span className="font-semibold">Brand:</span> {seller.brand}</p>
            <p><span className="font-semibold">Phone:</span> {seller.phone}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`px-2 py-1 text-xs rounded ${
                seller.status === "Verified"
                  ? "bg-green-100 text-green-700"
                  : seller.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {seller.status}
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
                    {product.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApproveProduct(product.id)}
                          className="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectProduct(product.id)}
                          className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {product.status === "Approved" && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Approved</span>
                    )}
                    {product.status === "Rejected" && (
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