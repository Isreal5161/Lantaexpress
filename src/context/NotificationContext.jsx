import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Order shipped" },
    { id: 2, message: "New discount available" },
  ]);

  const notificationCount = notifications.length;

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, notificationCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);