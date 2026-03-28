import React, { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { getSellerOrders } from "../../api/orders";
import { OrderWorkspaceSkeleton } from "../../components/LoadingSkeletons";

const orderStages = [
  "Pending",
  "Approved",
  "Processing",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Completed",
  "Cancelled",
];

const statusOptions = ["All", ...orderStages];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDateTime = (value) => {
  if (!value) return "Not available";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleString();
};

const resolveOrderAmount = (order) => {
  if (order.amount != null) return Number(order.amount) || 0;

  const quantity = Number(order.quantity) || 1;
  const unitPrice =
    order.unitPrice ?? order.price ?? order.productPrice ?? order.itemPrice ?? 0;

  return (Number(unitPrice) || 0) * quantity;
};

const statusBadgeClass = (status) => {
  if (["Completed", "Delivered"].includes(status)) {
    return "bg-green-100 text-green-700";
  }

  if (["Shipped", "In Transit", "Out for Delivery"].includes(status)) {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

const SellerOrdersPage = () => {
  const { seller } = useSellerAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("sellerToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const sellerOrders = await getSellerOrders(token);
        setOrders(sellerOrders);

        if (!selectedOrderId && sellerOrders.length > 0) {
          setSelectedOrderId(sellerOrders[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders().catch((error) => console.error(error));

    const interval = window.setInterval(() => {
      loadOrders().catch((error) => console.error(error));
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [seller, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        (order.productName || "").toLowerCase().includes(normalizedSearch) ||
        (order.userName || "").toLowerCase().includes(normalizedSearch) ||
        (order.id || "").toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) || filteredOrders[0] || null;

  const timelineEntries = selectedOrder
    ? orderStages.filter(
        (stage) => selectedOrder.stageTimestamps?.[stage] || stage === selectedOrder.status
      )
    : [];

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Seller Orders</h2>
        <p className="text-sm text-gray-500">
          View the orders placed for your brand, including customer details, product amount,
          tracking progress, and order timestamps.
        </p>
      </div>

      {loading ? (
        <OrderWorkspaceSkeleton />
      ) : (
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product, order ID, or customer"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-gray-500">
                No orders found for your brand yet.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const amount = resolveOrderAmount(order);
                const isSelected = selectedOrder?.id === order.id;

                return (
                  <button
                    key={`${order.id}-${order.productId || order.productName}`}
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`flex flex-col gap-4 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-green-500 bg-green-50/50 shadow-md"
                        : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={order.image || "/placeholder.png"}
                        alt={order.productName || "Ordered product"}
                        className="h-24 w-24 rounded-2xl object-cover"
                        onError={(event) => {
                          event.target.src = "/placeholder.png";
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-400">#{order.id}</span>
                        </div>

                        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                          {order.productName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Customer: {order.userName || "Customer"}</p>
                        <p className="mt-1 text-sm text-gray-500">Quantity: {order.quantity || 1}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(amount)}</p>
                      </div>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                      <p>Ordered: {formatDateTime(order.createdAt)}</p>
                      <p>Current stage: {order.status || "Pending"}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>

          {!selectedOrder ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center text-sm text-gray-500">
              Select an order to view the full tracking breakdown.
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-4 border-b border-gray-100 pb-5">
                <img
                  src={selectedOrder.image || "/placeholder.png"}
                  alt={selectedOrder.productName || "Ordered product"}
                  className="h-24 w-24 rounded-2xl object-cover"
                  onError={(event) => {
                    event.target.src = "/placeholder.png";
                  }}
                />

                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedOrder.productName}</h4>
                  <p className="mt-1 text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                  <p className="mt-1 text-sm text-gray-500">Brand: {selectedOrder.brand || seller?.brandName || "Your store"}</p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {formatCurrency(resolveOrderAmount(selectedOrder))}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">Customer:</span> {selectedOrder.userName || "Customer"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Email:</span> {selectedOrder.contact || "Not available"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Phone:</span> {selectedOrder.phone || "Not available"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Quantity:</span> {selectedOrder.quantity || 1}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Ordered At:</span> {formatDateTime(selectedOrder.createdAt)}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Expected Delivery:</span> {formatDateTime(selectedOrder.expectedDelivery)}
                </p>
              </div>

              {selectedOrder.shippingAddress && (
                <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-700">
                  <p className="mb-2 font-semibold text-gray-900">Shipping Address</p>
                  <p>{selectedOrder.shippingAddress.address || "Address not available"}</p>
                  <p>
                    {selectedOrder.shippingAddress.city || ""}
                    {selectedOrder.shippingAddress.city && selectedOrder.shippingAddress.state ? ", " : ""}
                    {selectedOrder.shippingAddress.state || ""}
                  </p>
                  <p>
                    {selectedOrder.shippingAddress.zip || ""}
                    {selectedOrder.shippingAddress.zip && selectedOrder.shippingAddress.country ? ", " : ""}
                    {selectedOrder.shippingAddress.country || ""}
                  </p>
                </div>
              )}

              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">Tracking Timeline</p>
                <div className="space-y-4">
                  {timelineEntries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      No tracking updates yet.
                    </div>
                  ) : (
                    timelineEntries.map((stage) => (
                      <div key={stage} className="flex items-start gap-3">
                        <div className={`mt-1.5 h-3.5 w-3.5 rounded-full ${statusBadgeClass(stage).split(" ")[0]}`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{stage}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(selectedOrder.stageTimestamps?.[stage])}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;