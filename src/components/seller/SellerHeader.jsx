import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotifications, MdMenu, MdAccountCircle } from "react-icons/md";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { useNotification } from "../../context/NotificationContext";
import { NotificationDropdown } from "../NotificationDropdown";

const SellerHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { seller } = useSellerAuth();
  const {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useNotification("seller");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    refreshNotifications(false);
  }, []);

  const sellerLogo = seller?.logo || null;

  const handleLogout = () => {
    localStorage.removeItem("currentSeller");
    localStorage.removeItem("sellerToken");
    navigate("/seller-login");
  };

  const handleNotificationToggle = () => {
    if (!notifOpen) {
      refreshNotifications(true);
    }
    setNotifOpen((current) => !current);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-8 h-16">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* Mobile Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 hover:text-black"
          >
            <MdMenu size={26} />
          </button>

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/lantalogo1.jpg"
              alt="LantaXpress Logo"
              className="h-8 w-auto"
            />
            <span className="font-extrabold text-lg tracking-wide text-green-600">
             LantaXeller
            </span>
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">

          {/* Notifications */}
          <NotificationDropdown
            open={notifOpen}
            onToggle={handleNotificationToggle}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            unreadCount={unreadCount}
            loading={loading}
            isAuthenticated
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllNotificationsRead}
            onClearAll={clearNotifications}
            title="Seller notifications"
            mobileTopClassName="top-16"
            renderTrigger={({ unreadCount: triggerUnreadCount }) => (
              <span className="text-gray-600 transition hover:text-black">
                <MdNotifications size={24} />
                {triggerUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                    {triggerUnreadCount}
                  </span>
                )}
              </span>
            )}
          />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              {sellerLogo ? (
                <img
                  src={sellerLogo}
                  alt={seller?.brandName || "Seller logo"}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-green-100"
                />
              ) : (
                <MdAccountCircle size={28} />
              )}
              <span className="hidden md:block font-medium">
                {seller?.brandName || "Your Brand"}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-md border">
                <button
                  onClick={() => navigate("/seller-dashboard")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/seller-dashboard/orders")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Orders
                </button>
                <button
                  onClick={() => navigate("/seller-dashboard/analytics")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Analytics
                </button>
                <button
                  onClick={() => navigate("/seller-dashboard/settings")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Settings
                </button>

                <hr />

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default SellerHeader;