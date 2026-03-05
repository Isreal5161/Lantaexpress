// src/context/SellerAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const SellerAuthContext = createContext();

export const SellerAuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);

  // Load seller from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSeller = localStorage.getItem("currentSeller");
      if (storedSeller) setSeller(JSON.parse(storedSeller));
    }
  }, []);

  // Login
  const login = (sellerData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentSeller", JSON.stringify(sellerData));
    }
    setSeller(sellerData);
  };

  // Logout
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentSeller");
    }
    setSeller(null);
  };

  // Convenience: check if seller is logged in
  const isLoggedIn = !!seller;

  return (
    <SellerAuthContext.Provider value={{ seller, login, logout, isLoggedIn }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

// Custom hook to use seller auth context
export const useSellerAuth = () => useContext(SellerAuthContext);