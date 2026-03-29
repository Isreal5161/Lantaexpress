import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { useNotification } from "../../context/NotificationContext";
import { NotificationDropdown } from "../../components/NotificationDropdown";

export default function Topbar({ toggleSidebar }) {
  const {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useNotification("admin");
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    refreshNotifications(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 shadow-sm">
      
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-2 sm:gap-4">
        <FaBars
          className="text-slate-600 text-lg sm:hidden cursor-pointer"
          onClick={toggleSidebar}
        />
        <h2 className="text-sm sm:text-lg font-semibold text-slate-800 truncate">
          Admin Dashboard
        </h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-6">
        <NotificationDropdown
          open={notifOpen}
          onToggle={() => setNotifOpen((current) => !current)}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          isAuthenticated
          onMarkRead={markNotificationRead}
          onMarkAllRead={markAllNotificationsRead}
          onClearAll={clearNotifications}
          title="Admin notifications"
          mobileTopClassName="top-16"
          renderTrigger={({ unreadCount: triggerUnreadCount }) => (
            <span className="text-slate-500 transition hover:text-slate-700">
              <FaBell className="cursor-pointer text-lg sm:text-xl" />
              {triggerUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-semibold text-white">
                  {triggerUnreadCount}
                </span>
              )}
            </span>
          )}
        />
        <div className="flex items-center gap-1 sm:gap-2 cursor-pointer">
          <FaUserCircle className="text-xl sm:text-2xl text-slate-600" />
          <span className="text-xs sm:text-sm font-medium hidden sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}