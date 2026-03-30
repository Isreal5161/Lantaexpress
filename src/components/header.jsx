// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContextTemp";
import { useNotification } from "../context/NotificationContext";
import { Button } from "./Button";
import { HeaderSearchControl } from "./HeaderSearchControl";
import { Icon } from "./Icon";
import { Link } from "./Link";
import { NotificationDropdown } from "./NotificationDropdown";
import { Text } from "./Text";

export const Header = () => {
  const actionButtonClassName = "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900";
  const { cartCount } = useCart();
  const {
    notifications,
    unreadCount,
    loading,
    isAuthenticated,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useNotification("user");

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    // Hide after 3 seconds on first load
    const initialTimer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 3000);

    // Every 5 minutes show again for 3 seconds
    const interval = setInterval(() => {
      setShowAnnouncement(true);

      setTimeout(() => {
        setShowAnnouncement(false);
      }, 3000);

    }, 300000); // 5 minutes

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    refreshNotifications(false);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white">

      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-green-900 text-white text-xs font-medium py-2 text-center tracking-wide transition-all duration-500">
          FREE SHIPPING ON ALL ORDERS OVER $50
        </div>
      )}

      {/* Navigation */}
      <header>
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link
                  className="flex items-center gap-2 font-heading font-semibold text-xl text-slate-900 tracking-tight"
                  href="/"
                >
                  <img
                    src="/lantalogo1.jpg"
                    alt="Lanta Logo"
                    className="h-12 w-auto"
                  />
                  LantaXpress
                  <Text className="text-green-700">.</Text>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <Link className="text-slate-900 font-medium hover:text-green-700 transition-colors" href="/">
                  Home
                </Link>
                <Link className="text-slate-500 font-medium hover:text-green-700 transition-colors" href="/shop">
                  Shop
                </Link>
                <Link className="text-slate-500 font-medium hover:text-green-700 transition-colors" href="/logistics">
                  Logistics
                </Link>
              </div>
{/* Icons */}
<div className="flex items-center gap-2 sm:gap-3">

  <HeaderSearchControl buttonClassName={actionButtonClassName} mobileTopClassName={showAnnouncement ? "top-24" : "top-16"} />

  {/* Cart */}
  <Link
    className={actionButtonClassName}
    href="/cart"
  >
    <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>

    {cartCount > 0 && (
      <Text className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white w-4 h-4 rounded-full flex items-center justify-center">
        {cartCount}
      </Text>
    )}
  </Link>

  <NotificationDropdown
    open={notifOpen}
    onToggle={() => setNotifOpen((current) => !current)}
    onClose={() => setNotifOpen(false)}
    notifications={notifications}
    unreadCount={unreadCount}
    loading={loading}
    isAuthenticated={isAuthenticated}
    onMarkRead={markNotificationRead}
    onMarkAllRead={markAllNotificationsRead}
    onClearAll={clearNotifications}
    mobileTopClassName={showAnnouncement ? "top-24" : "top-16"}
    title="Alerts"
    renderTrigger={({ unreadCount: triggerUnreadCount }) => (
      <span className={actionButtonClassName}>
        <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.929 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0h6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Icon>
        {triggerUnreadCount > 0 && (
          <Text className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
            {triggerUnreadCount}
          </Text>
        )}
      </span>
    )}
  />
</div>
            </div>
          </div>
        </nav>
      </header>

    </div>
  );
};