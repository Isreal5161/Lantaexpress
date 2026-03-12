import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import { categories } from "../../service/dummyCategories";
import { FaUserCircle } from "react-icons/fa";

export default function SellerOrders() {
  const { sellerBrand } = useParams(); // Brand name from URL
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const decodedBrand = decodeURIComponent(sellerBrand);

    // Extract all products from all categories
    const allProducts = categories.flatMap((cat) => cat.products);

    // Filter products by brand
    const brandProducts = allProducts.filter(
      (product) => product.brand === decodedBrand
    );

    // Generate dummy orders per product
    const dummyOrders = brandProducts.flatMap((product) => {
      const ordersCount = Math.floor(Math.random() * 5) + 1; // 1-5 orders per product
      return Array.from({ length: ordersCount }).map((_, idx) => ({
        id: `${product.id}-${idx + 1}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        sellerBrand: product.brand,
        status: ["Pending", "Shipped", "Delivered"][Math.floor(Math.random() * 3)],
        user: `User${Math.floor(Math.random() * 1000)}`,
        userEmail: `user${Math.floor(Math.random() * 1000)}@mail.com`,
        userPhone: `+234${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        tracking: `TRK${Math.floor(100000 + Math.random() * 900000)}`,
      }));
    });

    setOrders(dummyOrders);
  }, [sellerBrand]);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mt-4">
          {decodeURIComponent(sellerBrand)} Orders
        </h1>
        <p className="text-gray-600">
          Detailed overview of all orders for this brand.
        </p>

        {orders.length === 0 ? (
          <p className="text-gray-500 mt-6">No orders found for this brand.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col md:flex-row gap-4"
              >
                {/* Product Section */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg">{order.productName}</h3>
                    <p className="text-sm text-gray-500">Product ID: {order.productId}</p>
                    <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex-1 flex flex-col justify-center space-y-1">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-400" />
                    <span className="font-medium">{order.user}</span>
                  </div>
                  <p className="text-sm text-gray-500">{order.userEmail}</p>
                  <p className="text-sm text-gray-500">{order.userPhone}</p>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col justify-between items-start gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  {order.tracking && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      Tracking: {order.tracking}
                    </span>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => alert(`Update status for ${order.id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => alert(`View details for ${order.user}`)}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      View Customer
                    </button>
                    <button
                      onClick={() => alert(`View product ${order.productId}`)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}