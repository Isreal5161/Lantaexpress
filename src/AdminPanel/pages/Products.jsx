import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { categories } from "../../service/dummyCategories";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");

  // Load products from localStorage
  const loadProducts = () => {
    const sellerProducts = JSON.parse(localStorage.getItem("seller_products")) || [];
    const approved = sellerProducts.filter(p => p.approved);
    const pending = sellerProducts.filter(p => !p.approved);

    // Include admin manual products
    const adminProducts = categories.flatMap(cat =>
      cat.products?.map(prod => ({ ...prod, category: cat.title, approved: true })) || []
    );

    setAllProducts([...adminProducts, ...approved]);
    setPendingProducts(pending);
  };

  useEffect(() => {
    loadProducts();

    // Listen for seller saving a new product
    const handleSellerProductSaved = () => loadProducts();
    window.addEventListener("sellerProductSaved", handleSellerProductSaved);

    return () => window.removeEventListener("sellerProductSaved", handleSellerProductSaved);
  }, []);

  // Approve seller product
  const handleApprove = (product) => {
    const updated = { ...product, approved: true };
    setPendingProducts(pendingProducts.filter(p => p.id !== product.id));
    setAllProducts([updated, ...allProducts]);

    const sellerProducts = JSON.parse(localStorage.getItem("seller_products")) || [];
    const updatedStorage = sellerProducts.map(p => (p.id === product.id ? updated : p));
    localStorage.setItem("seller_products", JSON.stringify(updatedStorage));
    window.dispatchEvent(new Event("storage"));
  };

  // Decline seller product
  const handleDecline = (product) => {
    setPendingProducts(pendingProducts.filter(p => p.id !== product.id));

    const sellerProducts = JSON.parse(localStorage.getItem("seller_products")) || [];
    const updatedStorage = sellerProducts.filter(p => p.id !== product.id);
    localStorage.setItem("seller_products", JSON.stringify(updatedStorage));
    window.dispatchEvent(new Event("storage"));
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
      <div className="mb-4 flex gap-4 items-center">
        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
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
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}