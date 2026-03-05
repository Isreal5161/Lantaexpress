// src/routes/ProtectedSellerRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSellerAuth } from "../context/SellerAuthContext";

const ProtectedSellerRoute = ({ children }) => {
  const { seller } = useSellerAuth();

  // If no seller is logged in, redirect to seller login page
  if (!seller) {
    return <Navigate to="/seller-login" replace />;
  }

  // Otherwise, render the children (protected dashboard)
  return children;
};

export default ProtectedSellerRoute;