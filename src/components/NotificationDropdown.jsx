import React, { useEffect, useRef } from "react";

const formatTimestamp = (value) => {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return date.toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const NotificationDropdown = ({
  open,
  onToggle,
  onClose,
  notifications,
  unreadCount,
  loading,
  error,
  isAuthenticated,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onRetry,
  renderTrigger,
  title = "Notifications",
  emptyMessage = "No notifications yet.",
  guestMessage = "Sign in to view your notifications.",
  mobileTopClassName = "top-16",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={onToggle} className="relative">
        {renderTrigger({ unreadCount, open })}
      </button>

      {open && (
        <div className={`fixed left-3 right-3 ${mobileTopClassName} z-[80] rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80 sm:max-w-[22rem]`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="text-xs text-slate-500">
                {loading ? "Refreshing..." : `${unreadCount} unread`}
              </p>
            </div>
            {isAuthenticated && notifications.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-medium text-red-600 transition hover:text-red-700"
                >
                  Clear all
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-xs font-medium text-green-700 transition hover:text-green-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="px-4 py-6 text-sm text-slate-500">{guestMessage}</div>
          ) : error ? (
            <div className="px-4 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left">
                <p className="text-sm font-semibold text-slate-900">Notifications unavailable</p>
                <p className="mt-1 text-sm text-slate-500">{error.message || "Failed to load notifications."}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-green-700"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">{emptyMessage}</div>
          ) : (
            <div className="max-h-[min(60vh,26rem)] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification._id || notification.id || notification.createdAt}
                  className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${notification.read ? "bg-white" : "bg-green-50/70"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${notification.read ? "bg-slate-200" : "bg-green-600"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 text-slate-800">{notification.message}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">{formatTimestamp(notification.createdAt)}</p>
                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() => onMarkRead(notification._id || notification.id)}
                            className="text-xs font-medium text-green-700 transition hover:text-green-800"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
