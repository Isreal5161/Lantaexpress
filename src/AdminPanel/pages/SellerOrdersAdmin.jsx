// src/pages/admin/SellerOrdersAdmin.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaArrowRight,
  FaEye,
} from "react-icons/fa";
import AdminLayout from "../Layout/AdminLayout";
import StatCard from "../components/StatCard";

export default function SellerOrdersAdmin() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [productPopup, setProductPopup] = useState(null);
  const previousOrderCount = useRef(0);

  const formatPrice = (value) => {
    if (!value) return "₦0";
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);
  };

  const loadBrandOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("user_orders")) || [];

    const brandMap = allOrders.reduce((acc, order) => {
      if (!acc[order.brand]) acc[order.brand] = [];
      acc[order.brand].push(order);
      return acc;
    }, {});

    const brandStats = Object.entries(brandMap).map(([brand, orders], idx) => {
      const totalOrders = orders.length;
      const pending = orders.filter(o => o.status === "Pending").length;
      const shipped = orders.filter(o => ["Shipped","In Transit","Out for Delivery"].includes(o.status)).length;
      const delivered = orders.filter(o => ["Delivered","Completed"].includes(o.status)).length;

      return { id: `BR${idx + 1}`, brand, totalOrders, pending, shipped, delivered, orders };
    });

    setBrands(brandStats);

    if (previousOrderCount.current && allOrders.length > previousOrderCount.current) {
      alert("🔔 New order received!");
    }
    previousOrderCount.current = allOrders.length;
  };

  useEffect(() => {
    loadBrandOrders();
    const interval = setInterval(loadBrandOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredBrands = brands.filter(
    b => b.brand.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = (orderId) => {
    navigate(`/AdminPanel/track-order/${encodeURIComponent(orderId)}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Seller Order Monitoring</h1>
          <p className="text-sm text-slate-500">Monitor and manage orders for each brand on the marketplace.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search brand or brand ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Brands */}
        <div className="flex flex-col gap-6">
          {filteredBrands.length === 0 && (
            <div className="text-center text-gray-500 py-6">No brands found</div>
          )}

          {filteredBrands.map(brand => (
            <div key={brand.id} className="bg-white border shadow-sm rounded-xl p-4 sm:p-6 hover:shadow-md transition flex flex-col gap-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-4 rounded-lg text-xl shrink-0"><FaStore /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{brand.brand}</h2>
                    <p className="text-sm text-slate-500">Brand ID: {brand.id}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <StatCard title="Total Orders" value={brand.totalOrders} icon={<FaStore />} />
                <StatCard title="Pending Orders" value={brand.pending} icon={<FaBoxOpen />} />
                <StatCard title="Shipped Orders" value={brand.shipped} icon={<FaTruck />} />
                <StatCard title="Delivered Orders" value={brand.delivered} icon={<FaCheckCircle />} />
              </div>

              {/* Orders List */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {brand.orders.map(order => (
                  <div key={order.id} className="border p-3 rounded-lg hover:shadow-sm transition flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-semibold">{order.productName || order.product}</p>
                        <p className="text-xs text-gray-500">Order ID: {order.id}</p>
                        <p className="text-xs text-gray-500">Buyer: {order.userName || order.buyer}</p>
                        <p className="text-xs text-gray-500">Amount: {formatPrice(order.amount || order.price)}</p>
                        {order.trackingId && <p className="text-xs text-gray-500">Tracking ID: {order.trackingId}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                          order.status === "Delivered" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>{order.status}</span>
                        <button
                          onClick={() => handleUpdateStatus(order.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setProductPopup(order)}
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs flex items-center gap-1"
                        >
                          <FaEye /> View Product
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Product Popup */}
        {productPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
                onClick={() => setProductPopup(null)}
              >
                ✕
              </button>
              <img
                src={productPopup.image}
                alt={productPopup.productName || productPopup.product}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-semibold text-lg">{productPopup.productName || productPopup.product}</h3>
              <p className="text-gray-500 mt-1">Brand: {productPopup.brand}</p>
              <p className="text-gray-500 mt-1">Price: {formatPrice(productPopup.amount || productPopup.price)}</p>
              <p className="text-gray-500 mt-1">Quantity: {productPopup.quantity}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}