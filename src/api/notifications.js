const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const getNotificationsBaseUrl = (scope) => {
  return scope === "admin" ? `${API_BASE}/admin/notifications` : `${API_BASE}/user/notifications`;
};

const readJson = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const fetchNotifications = async ({ scope, token }) => {
  const response = await fetch(getNotificationsBaseUrl(scope), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await readJson(response);
  return Array.isArray(data) ? data : [];
};

export const markNotificationRead = async ({ scope, token, notificationId }) => {
  const response = await fetch(`${getNotificationsBaseUrl(scope)}/${notificationId}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  return readJson(response);
};

export const markAllNotificationsRead = async ({ scope, token }) => {
  const response = await fetch(`${getNotificationsBaseUrl(scope)}/read-all`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  return readJson(response);
};

export const clearNotifications = async ({ scope, token }) => {
  const response = await fetch(getNotificationsBaseUrl(scope), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return readJson(response);
};
