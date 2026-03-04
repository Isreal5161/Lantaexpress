// src/pages/seller/SellerOrdersPage.jsx
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

// Dummy orders data
const dummyOrders = [
  {
    id: 1,
    product: "Wireless Headphones",
    buyer: "John Doe",
    quantity: 2,
    price: 120,
    status: "Pending",
    date: "2026-03-01",
    image: "https://m.media-amazon.com/images/I/51aHcGncblL._AC_UF894%2C1000_QL80_.jpg"
  },
  {
    id: 2,
    product: "Smart Watch",
    buyer: "Jane Smith",
    quantity: 1,
    price: 250,
    status: "Shipped",
    date: "2026-02-28",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    product: "Laptop",
    buyer: "Mary Johnson",
    quantity: 1,
    price: 900,
    status: "Delivered",
    date: "2026-02-25",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    product: "Designer Handbag",
    buyer: "Paul Adams",
    quantity: 1,
    price: 180,
    status: "Cancelled",
    date: "2026-03-02",
    image: "https://png.pngtree.com/png-clipart/20241023/original/pngtree-a-white-purse-with-ruffled-handle-on-transparent-background-png-image_16469053.png"
  },
];

const statusOptions = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setOrders(dummyOrders); // Simulate backend fetch
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "All" || order.status === statusFilter) &&
      (order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative w-48">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 border rounded-md bg-white flex justify-between items-center shadow hover:bg-gray-50 transition"
          >
            <span>{statusFilter}</span>
            {dropdownOpen ? <MdArrowDropUp size={24} /> : <MdArrowDropDown size={24} />}
          </button>

          {dropdownOpen && (
            <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {statusOptions.map((status) => (
                <li
                  key={status}
                  onClick={() => { setStatusFilter(status); setDropdownOpen(false); }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Orders Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-6">
            No orders found
          </div>
        )}
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-4 flex flex-col"
          >
            {/* Product Image */}
            <img
              src={order.image}
              alt={order.product}
              className="w-full h-40 object-cover  mb-4"
              onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Image"}
            />

            {/* Product Info */}
            <h3 className="text-lg font-semibold text-gray-800">{order.product}</h3>
            <p className="text-gray-500 mt-1">Buyer: {order.buyer}</p>
            <p className="text-gray-500 mt-1">Qty: {order.quantity}</p>
            <p className="text-gray-500 mt-1">Price: ${order.price}</p>
            <p className="text-gray-500 mt-1">Date: {order.date}</p>

            {/* Status */}
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className={`mt-3 px-3 py-1 rounded-md border focus:ring-1 focus:ring-green-500 ${
                order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                order.status === "Delivered" ? "bg-green-100 text-green-700" :
                "bg-red-100 text-red-700"
              }`}
            >
              {statusOptions.slice(1).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Actions */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition text-sm"
                onClick={() => alert(`Viewing order ${order.id}`)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerOrdersPage;