import React, { useEffect, useState } from "react";
import { HeaderSearchControl } from "./HeaderSearchControl";
import { useCart } from "../context/CartContextTemp";
import { useNotification } from "../context/NotificationContext";
import { Link } from "./Link";
import { Icon } from "./Icon";
import { NotificationDropdown } from "./NotificationDropdown";

const AccountHeader = () => {
  const actionButtonClassName = "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900";
  const { cartCount } = useCart();
  const {
    notifications,
    unreadCount,
    notificationCount,
    loading,
    isAuthenticated,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useNotification("user");
  const [notifOpen, setNotifOpen] = useState(false);
  const activeNotificationCount = unreadCount ?? notificationCount;

  useEffect(() => {
    refreshNotifications(false);
  }, [refreshNotifications]);

  return (
    <>
      <header>
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <Link
                className="flex items-center gap-2 font-heading font-bold text-xl text-slate-900"
                href="/"
              >
                <img
                  src="/lantalogo1.jpg"
                  alt="Logo"
                  className="h-10 w-auto"
                />
                My Account
              </Link>

              {/* Right Icons */}
              <div className="flex items-center gap-2 sm:gap-3">

                {/* Search */}
                <HeaderSearchControl buttonClassName={actionButtonClassName} mobileTopClassName="top-16" />

                {/* Notification */}
                <NotificationDropdown
                  open={notifOpen}
                  onToggle={() => setNotifOpen((current) => !current)}
                  onClose={() => setNotifOpen(false)}
                  notifications={notifications}
                  unreadCount={activeNotificationCount}
                  loading={loading}
                  isAuthenticated={isAuthenticated}
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={markAllNotificationsRead}
                  onClearAll={clearNotifications}
                  title="Account notifications"
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
                        <span className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                          {triggerUnreadCount}
                        </span>
                      )}
                    </span>
                  )}
                />

                {/* Cart */}
                <Link className={actionButtonClassName} href="/cart">
                  <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>

                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default AccountHeader;