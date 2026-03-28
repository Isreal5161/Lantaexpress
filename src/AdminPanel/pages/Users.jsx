import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import AdminTable from "../components/AdminTable";
import UserCard from "../components/UserCard";
import { getAdminOrders } from "../../api/orders";

const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUsers([]);
        setError("Admin login required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [usersRes, orders] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          getAdminOrders(token).catch(() => []),
        ]);

        const usersJson = await usersRes.json();
        if (!usersRes.ok) {
          throw new Error(usersJson.message || "Failed to load users");
        }

        const orderCountByBuyer = new Map();
        const orderHistoryByBuyer = new Map();

        (orders || []).forEach((order) => {
          const buyerId = order.buyerId?.toString?.() || order.buyerId;
          if (!buyerId) return;

          orderCountByBuyer.set(buyerId, (orderCountByBuyer.get(buyerId) || 0) + 1);

          const history = orderHistoryByBuyer.get(buyerId) || [];
          history.push({
            orderId: order.orderNumber,
            product: order.productName,
            amount: Number(order.amount) || 0,
            status: order.status,
            date: order.createdAt,
          });
          orderHistoryByBuyer.set(buyerId, history);
        });

        const mappedUsers = (usersJson.users || [])
          .filter((user) => user.role === "user")
          .map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "N/A",
            orders: orderCountByBuyer.get(user._id) || 0,
            status: "Active",
            signupDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
            createdAt: user.createdAt,
            addresses: user.address
              ? [{ id: `${user._id}-address`, addressLine: user.address, city: "", state: user.state || "", country: "", zip: "" }]
              : [],
            orderHistory: orderHistoryByBuyer.get(user._id) || [],
          }));

        setUsers(mappedUsers);
      } catch (err) {
        setUsers([]);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = () => setError("Delete user is not connected to a backend endpoint yet.");
  const handleBan = () => setError("Ban user is not connected to a backend endpoint yet.");
  const handleUnban = () => setError("Unban user is not connected to a backend endpoint yet.");

  const handleView = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const columns = ["User ID", "Name", "Email", "Orders", "Status", "Actions"];
  const data = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.orders,
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        user.status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {user.status}
    </span>,
    <div className="flex gap-2">
      <button
        onClick={() => handleView(user)}
        className="p-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        View
      </button>
      <button
        onClick={() =>
          user.status === "Active" ? handleBan(user.id) : handleUnban(user.id)
        }
        className={`p-2 rounded text-white text-xs ${
          user.status === "Active"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {user.status === "Active" ? "Ban" : "Unban"}
      </button>
      <button
        onClick={() => handleDelete(user.id)}
        className="p-2 rounded text-white text-xs bg-gray-600 hover:bg-gray-700"
      >
        Delete
      </button>
    </div>
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Users Management
          </h1>
          <input
            type="text"
            placeholder="Search users..."
            className="border rounded-md px-3 py-2 text-sm w-full sm:w-64"
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 mt-10 text-lg">Loading users...</p>
        ) : users.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <AdminTable columns={columns} data={data} />
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onView={() => handleView(user)}
                  onBan={() =>
                    user.status === "Active"
                      ? handleBan(user.id)
                      : handleUnban(user.id)
                  }
                  onDelete={() => handleDelete(user.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No users available on the site at this moment.
          </p>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-2xl rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 font-bold"
                onClick={closeModal}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">{selectedUser.name}</h2>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Email:</span> {selectedUser.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {selectedUser.phone}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      selectedUser.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Orders:</span> {selectedUser.orders}
                </p>
                <p>
                  <span className="font-semibold">Signup Date:</span>{" "}
                  {selectedUser.signupDate}
                </p>

                {/* Addresses */}
                <div>
                  <p className="font-semibold mb-1">Addresses:</p>
                  {selectedUser.addresses.length > 0 ? (
                    selectedUser.addresses.map((addr) => (
                      <div key={addr.id} className="text-sm mb-1 border p-2 rounded">
                        {addr.addressLine}, {addr.city}, {addr.state}, {addr.country} -{" "}
                        {addr.zip}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No addresses available</p>
                  )}
                </div>

                {/* Order History */}
                <div>
                  <p className="font-semibold mb-1 mt-2">Order History:</p>
                  {selectedUser.orderHistory.length > 0 ? (
                    selectedUser.orderHistory.map((order) => (
                      <div key={order.orderId} className="text-sm mb-1 border p-2 rounded">
                        <p>Order ID: {order.orderId}</p>
                        <p>Product: {order.product}</p>
                        <p>Amount: ₦{order.amount.toLocaleString()}</p>
                        <p>Status: {order.status}</p>
                        <p>Date: {order.date ? new Date(order.date).toLocaleString() : "N/A"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No orders available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}