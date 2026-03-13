// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/globals.css";

// Public Pages
import { IndexPage } from "./pages/IndexPage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { LogisticsPage } from "./pages/LogisticsPage";
import { TrackorderPage } from "./pages/TrackorderPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { CheckoutPage } from "./pages/CheckoutPage";

// Account Pages
import AccountPage from "./pages/AccountPage";
import AccountDashboard from "./pages/account/AccountDashboard";
import EditProfile from "./pages/account/EditProfile";
import Notifications from "./pages/account/Notifications";
import ShippingAddress from "./pages/account/ShippingAddress";
import Password from "./pages/account/Password";
import EmailAddress from "./pages/account/EmailAddress";

// Seller Pages
import SellerLogin from "./pages/seller/SellerLogin";
import SellerSignup from "./pages/seller/SellerSignup";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerDashboardHome from "./pages/seller/SellerDashboardHome";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerIncomePage from "./pages/seller/SellerIncomePage";
import SellerWithdrawPage from "./pages/seller/SellerWithdrawPage";
import SellerProfilePage from "./pages/seller/SellerProfilePage";
import SellerSettingsPage from "./pages/seller/SellerSettingsPage";

// Admin Pages
import Dashboard from "./AdminPanel/pages/Dashboard";
import Users from "./AdminPanel/pages/Users";
import Sellers from "./AdminPanel/pages/Sellers";
import Products from "./AdminPanel/pages/Products";
import Logistics from "./AdminPanel/pages/Logistics";
import SellerDetailPage from "./AdminPanel/components/SellerDetails";

// Admin Submenu Pages
import UserOrders from "./AdminPanel/pages/UserOrders";
import UserTracking from "./AdminPanel/pages/UserTracking";

import SellerOrdersAdmin from "./AdminPanel/pages/SellerOrdersAdmin";
import SellerProductsAdmin from "./AdminPanel/pages/SellerProductsAdmin";
import SellerPayments from "./AdminPanel/pages/SellerPayments";
import SellerRequests from "./AdminPanel/pages/SellerRequests";

import OrderLocations from "./AdminPanel/pages/OrderLocations";
import LogisticsRequest from "./AdminPanel/pages/LogisticsRequest";
import SellerOrders from "./AdminPanel/pages/SellerOrders";

// Context & Routes
import { SellerAuthProvider } from "./context/SellerAuthContext";
import ProtectedSellerRoute from "./routes/ProtectedSellerRoute";

const App = () => {
  const [showSplash, setShowSplash] = useState(false);

  const getIsLoggedIn = () => !!localStorage.getItem("user");
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn());

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("hasVisited", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLoginStateChange = (loggedIn, userData) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <SellerAuthProvider>
      {showSplash && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-700 z-50">
          <img src="/homescreenlogo.png" alt="LantaXpress Logo" className="w-48 h-48" />
        </div>
      )}

      <div style={{ visibility: showSplash ? "hidden" : "visible" }}>
        <Router>
          <ScrollToTop />
          <Routes>

            {/* PUBLIC PAGES */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/track" element={<TrackorderPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* ADMIN PANEL ROUTES */}
            <Route path="/AdminPanel/dashboard" element={<Dashboard />} />

            {/* USERS */}
            <Route path="/AdminPanel/users" element={<Users />} />
            <Route path="/AdminPanel/users/orders" element={<UserOrders />} />
            <Route path="/AdminPanel/users/tracking" element={<UserTracking />} />

            {/* SELLERS */}
            <Route path="/AdminPanel/sellers" element={<Sellers />} />
            <Route path="/AdminPanel/sellers/orders" element={<SellerOrdersAdmin />} />

            {/* BRAND ORDERS DETAILS - using sellerBrand */}
            <Route
              path="/AdminPanel/sellers/orders/:sellerBrand"
              element={<SellerOrders />}
            />

            <Route path="/AdminPanel/sellers/products" element={<SellerProductsAdmin />} />
            <Route path="/AdminPanel/sellers/payments" element={<SellerPayments />} />
            <Route path="/AdminPanel/sellers/requests" element={<SellerRequests />} />

            {/* SELLER DETAILS */}
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/sellers/:sellerId" element={<SellerDetailPage />} />

            {/* PRODUCTS */}
            <Route path="/AdminPanel/products" element={<Products />} />

            {/* LOGISTICS */}
            <Route path="/AdminPanel/logistics" element={<Logistics />} />
            <Route path="/AdminPanel/logistics/location" element={<OrderLocations />} />
            <Route path="/AdminPanel/logistics/requests" element={<LogisticsRequest />} />

            {/* SELLER AUTH */}
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller-signup" element={<SellerSignup />} />

            {/* SELLER DASHBOARD */}
            <Route
              path="/seller-dashboard/*"
              element={
                <ProtectedSellerRoute>
                  <SellerDashboardPage />
                </ProtectedSellerRoute>
              }
            >
              <Route index element={<SellerDashboardHome />} />
              <Route path="products" element={<SellerProductsPage />} />
              <Route path="orders" element={<SellerOrdersPage />} />
              <Route path="income" element={<SellerIncomePage />} />
              <Route path="withdraw" element={<SellerWithdrawPage />} />
              <Route path="profile" element={<SellerProfilePage />} />
              <Route path="settings" element={<SellerSettingsPage />} />
            </Route>

            {/* USER AUTH */}
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/account" replace />
                ) : (
                  <LoginPage onLogin={() => handleLoginStateChange(true)} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ? (
                  <Navigate to="/account" replace />
                ) : (
                  <SignupPage onSignup={() => handleLoginStateChange(true)} />
                )
              }
            />

            {/* CHECKOUT */}
            <Route
              path="/checkout"
              element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/login" replace />}
            />

            {/* ACCOUNT */}
            <Route
              path="/account"
              element={
                isLoggedIn ? (
                  <AccountPage onSignOut={() => handleLoginStateChange(false)} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<AccountDashboard />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="shipping" element={<ShippingAddress />} />
              <Route path="password" element={<Password />} />
              <Route path="email" element={<EmailAddress />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </SellerAuthProvider>
  );
};

export default App;