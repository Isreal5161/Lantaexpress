// src/pages/account/Notifications.jsx
import React, { useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";

const Notifications = () => {
  const {
    notifications,
    loading,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    unreadCount,
  } = useNotification("user");

  useEffect(() => {
    refreshNotifications(true);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? "Refreshing notifications..." : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearNotifications}
              className="inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Clear all
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="inline-flex items-center justify-center rounded-lg border border-green-200 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
              >
                Mark all as read
              </button>
            )}
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications at this moment.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((note) => (
            <div
              key={note._id || note.id}
              className={`rounded-lg border p-4 ${note.read ? "bg-gray-50" : "bg-green-50/70 border-green-100"}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-slate-800">{note.message}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Just now"}
                  </p>
                </div>
                {!note.read && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(note._id || note.id)}
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium text-green-700 transition hover:text-green-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;