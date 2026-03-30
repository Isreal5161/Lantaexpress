const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const createLoadError = (message, extra = {}) => Object.assign(new Error(message), extra);

async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, options);
  } catch (error) {
    throw createLoadError("Network error", {
      isNetworkError: true,
      cause: error,
    });
  }
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message;
    throw createLoadError(message || `Request failed with status ${response.status}`, {
      status: response.status,
      isNetworkError: false,
    });
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

export const getSellerFinanceSummary = (token) =>
  requestJson("/seller/finance/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSellerPlatformFees = (token) =>
  requestJson("/seller/platform-fees", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSellerWithdrawals = (token) =>
  requestJson("/seller/withdrawals", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createSellerWithdrawal = (payload, token) =>
  requestJson("/seller/withdrawals", withJson(token, "POST", payload));

export const getAdminSellerPayments = (token) =>
  requestJson("/admin/seller-payments", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdminPlatformFees = (payload, token) =>
  requestJson("/admin/platform-fees", withJson(token, "PATCH", payload));

export const updateAdminWithdrawalStatus = (withdrawalId, payload, token) =>
  requestJson(`/admin/withdrawals/${withdrawalId}`, withJson(token, "PATCH", payload));