// src/context/SellerAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const SellerAuthContext = createContext();
const API_AUTH = process.env.REACT_APP_API_URL || "https://lantaxpressbackend.onrender.com/api/auth";

export const SellerAuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load seller from localStorage on mount
  useEffect(() => {
    const initializeSeller = async () => {
      if (typeof window === "undefined") {
        return;
      }

      const storedSeller = localStorage.getItem("currentSeller");
      const sellerToken = localStorage.getItem("sellerToken");

      if (storedSeller) {
        try {
          setSeller(JSON.parse(storedSeller));
        } catch (error) {
          localStorage.removeItem("currentSeller");
        }
      }

      if (!sellerToken) {
        setInitialized(true);
        return;
      }

      try {
        const response = await fetch(`${API_AUTH}/me`, {
          headers: { Authorization: `Bearer ${sellerToken}` },
        });
        const data = await response.json();

        if (!response.ok || data.user?.role !== "seller") {
          throw new Error(data.message || "Failed to load seller session");
        }

        localStorage.setItem("currentSeller", JSON.stringify(data.user));
        setSeller(data.user);
      } catch (error) {
        localStorage.removeItem("currentSeller");
        localStorage.removeItem("sellerToken");
        setSeller(null);
      } finally {
        setInitialized(true);
      }
    };

    initializeSeller();
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
      localStorage.removeItem("sellerToken");
    }
    setSeller(null);
  };

  // Convenience: check if seller is logged in
  const isLoggedIn = !!seller;

  return (
    <SellerAuthContext.Provider value={{ seller, login, logout, isLoggedIn, initialized }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

// Custom hook to use seller auth context
export const useSellerAuth = () => useContext(SellerAuthContext);