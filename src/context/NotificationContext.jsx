import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  clearNotifications as clearNotificationsRequest,
  fetchNotifications,
  markAllNotificationsRead as markAllNotificationsReadRequest,
  markNotificationRead as markNotificationReadRequest,
} from "../api/notifications";

const NotificationContext = createContext();

const parseJson = (value) => {
  if (!value || value === "undefined") return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const getAuthSession = (preferredScope = "auto") => {
  if (typeof window === "undefined") {
    return { scope: "guest", token: null };
  }

  const adminToken = localStorage.getItem("token");
  const adminUser = parseJson(localStorage.getItem("adminUser"));
  if ((preferredScope === "auto" || preferredScope === "admin") && adminToken && adminUser?.role === "admin") {
    return { scope: "admin", token: adminToken, user: adminUser };
  }

  const sellerToken = localStorage.getItem("sellerToken");
  const seller = parseJson(localStorage.getItem("currentSeller"));
  if ((preferredScope === "auto" || preferredScope === "seller") && sellerToken && seller) {
    return { scope: "seller", token: sellerToken, user: seller };
  }

  const userToken = localStorage.getItem("authToken");
  const user = parseJson(localStorage.getItem("currentUser") || localStorage.getItem("user"));
  if ((preferredScope === "auto" || preferredScope === "user") && userToken && user) {
    return { scope: "user", token: userToken, user };
  }

  return { scope: "guest", token: null, user: null };
};

export const NotificationProvider = ({ children }) => {
  const [notificationsByScope, setNotificationsByScope] = useState({
    user: [],
    seller: [],
    admin: [],
  });
  const [loadingByScope, setLoadingByScope] = useState({
    user: false,
    seller: false,
    admin: false,
  });
  const [errorByScope, setErrorByScope] = useState({
    user: null,
    seller: null,
    admin: null,
  });
  const activeScopeCountsRef = useRef(new Map());

  const setScopeNotifications = useCallback((scope, updater) => {
    if (!scope || scope === "guest") return;
    setNotificationsByScope((current) => ({
      ...current,
      [scope]: typeof updater === "function" ? updater(current[scope] || []) : updater,
    }));
  }, []);

  const setScopeLoading = useCallback((scope, value) => {
    if (!scope || scope === "guest") return;
    setLoadingByScope((current) => ({ ...current, [scope]: value }));
  }, []);

  const setScopeError = useCallback((scope, value) => {
    if (!scope || scope === "guest") return;
    setErrorByScope((current) => ({ ...current, [scope]: value }));
  }, []);

  const refreshNotifications = useCallback(async (preferredScope = "auto", showLoading = false) => {
    const session = getAuthSession(preferredScope);

    if (session.scope === "guest" || !session.token) {
      if (preferredScope !== "auto") {
        setScopeNotifications(preferredScope, []);
      }
      return;
    }

    if (showLoading) {
      setScopeLoading(session.scope, true);
    }

    setScopeError(session.scope, null);

    try {
      const items = await fetchNotifications({ scope: session.scope, token: session.token });
      setScopeNotifications(session.scope, Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to load notifications", error);
      setScopeError(session.scope, error);
    } finally {
      if (showLoading) {
        setScopeLoading(session.scope, false);
      }
    }
  }, [setScopeError, setScopeLoading, setScopeNotifications]);

  const registerScope = useCallback((scope) => {
    if (!scope || scope === "auto" || scope === "guest") {
      return () => {};
    }

    const nextCount = (activeScopeCountsRef.current.get(scope) || 0) + 1;
    activeScopeCountsRef.current.set(scope, nextCount);

    return () => {
      const currentCount = activeScopeCountsRef.current.get(scope) || 0;

      if (currentCount <= 1) {
        activeScopeCountsRef.current.delete(scope);
        return;
      }

      activeScopeCountsRef.current.set(scope, currentCount - 1);
    };
  }, []);

  useEffect(() => {
    const refreshActiveScopes = (showLoading = false) => {
      activeScopeCountsRef.current.forEach((_, scope) => {
        refreshNotifications(scope, showLoading);
      });
    };

    const interval = setInterval(() => {
      refreshActiveScopes(false);
    }, 15000);

    const handleFocus = () => {
      refreshActiveScopes(false);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshNotifications]);

  const markNotificationRead = useCallback(async (preferredScope, notificationId) => {
    const session = getAuthSession(preferredScope);
    if (!notificationId || session.scope === "guest" || !session.token) return;

    setScopeNotifications(session.scope, (current) => current.map((notification) => (
      (notification._id || notification.id) === notificationId
        ? { ...notification, read: true }
        : notification
    )));

    try {
      await markNotificationReadRequest({
        scope: session.scope,
        token: session.token,
        notificationId,
      });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      refreshNotifications(session.scope, false);
    }
  }, [refreshNotifications, setScopeNotifications]);

  const markAllNotificationsRead = useCallback(async (preferredScope) => {
    const session = getAuthSession(preferredScope);
    if (session.scope === "guest" || !session.token) return;

    setScopeNotifications(session.scope, (current) => current.map((notification) => ({ ...notification, read: true })));

    try {
      await markAllNotificationsReadRequest({ scope: session.scope, token: session.token });
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      refreshNotifications(session.scope, false);
    }
  }, [refreshNotifications, setScopeNotifications]);

  const clearNotifications = useCallback(async (preferredScope) => {
    const session = getAuthSession(preferredScope);
    if (session.scope === "guest" || !session.token) return;

    setScopeNotifications(session.scope, []);

    try {
      await clearNotificationsRequest({ scope: session.scope, token: session.token });
    } catch (error) {
      console.error("Failed to clear notifications", error);
      refreshNotifications(session.scope, false);
    }
  }, [refreshNotifications, setScopeNotifications]);

  const contextValue = useMemo(() => ({
    notificationsByScope,
    loadingByScope,
    errorByScope,
    refreshNotifications,
    registerScope,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  }), [
    notificationsByScope,
    loadingByScope,
    errorByScope,
    refreshNotifications,
    registerScope,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  ]);

  return (
    <NotificationContext.Provider
      value={contextValue}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (preferredScope = "auto") => {
  const context = useContext(NotificationContext);
  const contextRegisterScope = context?.registerScope;
  const contextRefreshNotifications = context?.refreshNotifications;
  const contextMarkNotificationRead = context?.markNotificationRead;
  const contextMarkAllNotificationsRead = context?.markAllNotificationsRead;
  const contextClearNotifications = context?.clearNotifications;
  const notifications = context.notificationsByScope?.[preferredScope] || [];
  const loading = Boolean(context.loadingByScope?.[preferredScope]);
  const error = context.errorByScope?.[preferredScope] || null;
  const session = getAuthSession(preferredScope);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    if (!contextRegisterScope) {
      return undefined;
    }

    return contextRegisterScope(preferredScope);
  }, [contextRegisterScope, preferredScope]);

  const scopedRefreshNotifications = useCallback((showLoading = false) => {
    if (!contextRefreshNotifications) return Promise.resolve();
    return contextRefreshNotifications(preferredScope, showLoading);
  }, [contextRefreshNotifications, preferredScope]);

  const scopedMarkNotificationRead = useCallback((notificationId) => {
    if (!contextMarkNotificationRead) return Promise.resolve();
    return contextMarkNotificationRead(preferredScope, notificationId);
  }, [contextMarkNotificationRead, preferredScope]);

  const scopedMarkAllNotificationsRead = useCallback(() => {
    if (!contextMarkAllNotificationsRead) return Promise.resolve();
    return contextMarkAllNotificationsRead(preferredScope);
  }, [contextMarkAllNotificationsRead, preferredScope]);

  const scopedClearNotifications = useCallback(() => {
    if (!contextClearNotifications) return Promise.resolve();
    return contextClearNotifications(preferredScope);
  }, [contextClearNotifications, preferredScope]);

  return {
    notifications,
    loading,
    error,
    scope: session.scope,
    isAuthenticated: session.scope !== "guest",
    notificationCount: unreadCount,
    unreadCount,
    refreshNotifications: scopedRefreshNotifications,
    markNotificationRead: scopedMarkNotificationRead,
    markAllNotificationsRead: scopedMarkAllNotificationsRead,
    clearNotifications: scopedClearNotifications,
  };
};