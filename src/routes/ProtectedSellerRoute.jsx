// src/routes/ProtectedSellerRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSellerAuth } from "../context/SellerAuthContext";
import { isSellerApproved } from "../utils/sellerApproval";

const ProtectedSellerRoute = ({ children }) => {
  const { seller, initialized } = useSellerAuth();
  const location = useLocation();

  // While we haven't checked localStorage yet, don't redirect — render nothing (or a loader)
  if (!initialized) return null;

  // If no seller is logged in after initialization, redirect to seller login page
  if (!seller) {
    return <Navigate to="/seller-login" replace />;
  }

  if (!isSellerApproved(seller) && location.pathname !== "/seller-dashboard") {
    return <Navigate to="/seller-dashboard" replace />;
  }

  // Otherwise, render the children (protected dashboard)
  return children;
};

export default ProtectedSellerRoute;