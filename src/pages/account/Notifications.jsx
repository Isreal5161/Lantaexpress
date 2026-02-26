// src/pages/account/Notifications.jsx
import React from "react";
import { useNotification } from "../../context/NotificationContext";

const Notifications = () => {
  const { notifications } = useNotification();

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="p-3 border rounded-lg bg-gray-50"
            >
              {note.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;