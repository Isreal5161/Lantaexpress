const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const createLoadError = (message, options = {}) => {
  const error = new Error(message);
  error.status = options.status;
  error.isNetworkError = Boolean(options.isNetworkError);
  return error;
};

const getNotificationsBaseUrl = (scope) => {
  return scope === "admin" ? `${API_BASE}/admin/notifications` : `${API_BASE}/user/notifications`;
};

const readJson = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw createLoadError(data.message || "Request failed", { status: response.status });
  }
  return data;
};

export const fetchNotifications = async ({ scope, token }) => {
  try {
    const response = await fetch(getNotificationsBaseUrl(scope), {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await readJson(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error?.status) {
      throw error;
    }

    throw createLoadError(error.message || "Failed to load notifications", {
      isNetworkError: true,
    });
  }
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
