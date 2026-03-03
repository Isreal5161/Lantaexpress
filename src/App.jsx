// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';

import { LogisticsPage } from './pages/LogisticsPage';
import { IndexPage } from './pages/IndexPage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { TrackorderPage } from './pages/TrackorderPage';

import AccountPage from "./pages/AccountPage";
import AccountDashboard from "./pages/account/AccountDashboard";
import EditProfile from "./pages/account/EditProfile";
import Notifications from "./pages/account/Notifications";
import ShippingAddress from "./pages/account/ShippingAddress";
import Password from "./pages/account/Password";
import EmailAddress from "./pages/account/EmailAddress";

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [showSplash, setShowSplash] = useState(false);

  // Track login status in state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    // Splash screen check
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

  // Function to update login state when user logs in/out
  const handleLoginStateChange = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-700 z-50">
          <img
            src="/homescreenlogo.png"
            alt="LantaXpress Logo"
            className="w-48 h-48"
          />
        </div>
      )}

      <div style={{ visibility: showSplash ? "hidden" : "visible" }}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/track" element={<TrackorderPage />} />

            {/* Auth Pages */}
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

            {/* Protected Account Routes */}
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

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;