import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import AdminLayout from "../Layout/AdminLayout";
import StatCard from "../components/StatCard";
import { categories } from "../../service/dummyCategories";

export default function SellerOrdersAdmin() {
  const navigate = useNavigate();
  const [brandStats, setBrandStats] = useState([]);

  useEffect(() => {
    // Extract all products from all categories
    const allProducts = categories.flatMap((cat) => cat.products);

    // Group by brand
    const brandMap = allProducts.reduce((acc, product) => {
      if (!acc[product.brand]) {
        acc[product.brand] = [];
      }
      acc[product.brand].push(product);
      return acc;
    }, {});

    // Convert to array of brand stats
    const stats = Object.entries(brandMap).map(([brand, products], idx) => {
      const totalOrders = products.length * 10; // dummy total orders
      const pending = Math.floor(totalOrders * 0.1 + Math.random() * 5);
      const shipped = Math.floor(totalOrders * 0.5 + Math.random() * 5);
      const delivered = totalOrders - pending - shipped;

      return {
        id: `BR${idx + 1}`,
        brand,
        totalOrders,
        pending,
        shipped,
        delivered,
      };
    });

    setBrandStats(stats);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Seller Order Monitoring
          </h1>
          <p className="text-sm text-slate-500">
            Monitor and manage orders for each brand on the marketplace.
          </p>
        </div>

        {/* Seller Brand Cards */}
        <div className="grid gap-6">
          {brandStats.map((brand) => (
            <div
              key={brand.id}
              className="bg-white border shadow-sm rounded-xl p-6 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-4 rounded-lg text-xl">
                    <FaStore />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{brand.brand}</h2>
                    <p className="text-sm text-slate-500">Brand ID: {brand.id}</p>
                  </div>
                </div>

                {/* VIEW ORDERS BUTTON */}
                <button
                  onClick={() =>
                    navigate(`/AdminPanel/sellers/orders/${encodeURIComponent(brand.brand)}`)
                  }
                  className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  View Orders
                  <FaArrowRight />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Orders" value={brand.totalOrders} icon={<FaStore />} />
                <StatCard title="Pending Orders" value={brand.pending} icon={<FaBoxOpen />} />
                <StatCard title="Shipped Orders" value={brand.shipped} icon={<FaTruck />} />
                <StatCard title="Delivered Orders" value={brand.delivered} icon={<FaCheckCircle />} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}