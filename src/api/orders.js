const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return data;
}

function withJson(token, method, body) {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  };
}

export const createOrders = (payload, token) =>
  requestJson("/orders", withJson(token, "POST", payload));

export const getBuyerOrders = (token) =>
  requestJson("/orders/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const trackOrder = (orderNumber) =>
  requestJson(`/orders/track/${encodeURIComponent(orderNumber)}`);

export const confirmOrderReceived = (recordId, token) =>
  requestJson(`/orders/${recordId}/confirm-received`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

export const submitOrderReview = (recordId, payload, token) =>
  requestJson(`/orders/${recordId}/review`, withJson(token, "POST", payload));

export const getSellerOrders = (token) =>
  requestJson("/orders/seller", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAdminOrders = (token) =>
  requestJson("/orders/admin", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdminOrderStatus = (recordId, status, token) =>
  requestJson(`/orders/admin/${recordId}/status`, withJson(token, "PATCH", { status }));