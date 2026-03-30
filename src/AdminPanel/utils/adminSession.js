const ADMIN_TOKEN_KEY = "token";
const ADMIN_USER_KEY = "adminUser";

const parseJson = (value) => {
  if (!value || value === "undefined") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const decodeJwtPayload = (token) => {
  if (!token || typeof window === "undefined") {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const decodedPayload = window.atob(paddedPayload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

export const getAdminSession = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null, expiresAt: null };
  }

  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const user = parseJson(localStorage.getItem(ADMIN_USER_KEY));
  const payload = decodeJwtPayload(token);
  const expiresAt = payload?.exp ? payload.exp * 1000 : null;

  return {
    token,
    user,
    expiresAt,
  };
};

export const isAdminSessionValid = () => {
  const { token, user, expiresAt } = getAdminSession();

  if (!token || !user || user.role !== "admin") {
    return false;
  }

  if (!expiresAt) {
    return false;
  }

  return expiresAt > Date.now();
};

export const purgeInvalidAdminSession = () => {
  if (isAdminSessionValid()) {
    return true;
  }

  clearAdminSession();
  return false;
};