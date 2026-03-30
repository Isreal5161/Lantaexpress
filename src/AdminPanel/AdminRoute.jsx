import React from "react";
import { Navigate } from "react-router-dom";
import { purgeInvalidAdminSession } from "./utils/adminSession";

const AdminRoute = ({ children }) => {
  if (!purgeInvalidAdminSession()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;