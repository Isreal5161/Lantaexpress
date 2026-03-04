// src/pages/seller/SellerProfilePage.jsx
import React, { useState, useEffect } from "react";
import { MdEdit, MdStorefront, MdShoppingCart } from "react-icons/md";
import { categories } from "../../service/dummyCategories";

const SellerProfilePage = () => {
  const [seller, setSeller] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // Load seller info from localStorage or API
    const currentSeller = JSON.parse(localStorage.getItem("currentSeller")) || {
      brandName: "Your Brand",
      email: "seller@example.com",
      phone: "+234 123 456 789",
      address: "123 Main Street",
      state: "Lagos",
      city: "Lagos",
      balance: 1000,
    };
    setSeller(currentSeller);

    // Count total products
    const allProducts = categories.flatMap(cat => cat.products);
    setTotalProducts(allProducts.length);
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Seller Profile</h2>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          <MdEdit size={20} />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Avatar or Brand Logo */}
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={seller.logo || "/lantalogo1.jpg"}
            alt="Brand Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold text-gray-800">{seller.brandName}</h3>
          <p className="text-gray-500">{seller.email}</p>
          <p className="text-gray-500">{seller.phone}</p>
          <p className="text-gray-500">{seller.address}, {seller.city}, {seller.state}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Products</p>
            <p className="text-lg font-bold text-green-600 flex items-center gap-1">
              <MdStorefront size={20} /> {totalProducts}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="text-lg font-bold text-green-600">₦{seller.balance}</p>
          </div>
        </div>
      </div>

      {/* Seller Products Preview */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.flatMap(cat => cat.products).slice(0, 8).map(product => (
            <div key={product.id} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
                onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Image"}
              />
              <h4 className="text-gray-800 font-semibold">{product.name}</h4>
              <p className="text-gray-500 text-sm">₦{product.price}</p>
              <p className="text-gray-400 text-xs">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SellerProfilePage;