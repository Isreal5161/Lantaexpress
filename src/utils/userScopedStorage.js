const parseStoredUser = (value) => {
  if (!value || value === "undefined") {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const getStoredUserIdentity = () => {
  if (typeof window === "undefined") {
    return "guest";
  }

  const storedUser = parseStoredUser(
    window.localStorage.getItem("currentUser") || window.localStorage.getItem("user")
  );

  const rawIdentity =
    storedUser?.id ||
    storedUser?._id ||
    storedUser?.email ||
    storedUser?.phone ||
    storedUser?.username ||
    "guest";

  return String(rawIdentity).trim().toLowerCase() || "guest";
};

export const getScopedStorageKey = (baseKey) => {
  const identity = getStoredUserIdentity();
  return `${baseKey}:${identity}`;
};

export const migrateLegacyStorageKey = (legacyKey, scopedKey) => {
  if (typeof window === "undefined" || scopedKey !== `${legacyKey}:guest`) {
    return;
  }

  const scopedValue = window.localStorage.getItem(scopedKey);
  const legacyValue = window.localStorage.getItem(legacyKey);

  if (!scopedValue && legacyValue) {
    window.localStorage.setItem(scopedKey, legacyValue);
  }
};
