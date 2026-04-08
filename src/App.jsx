// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/globals.css";
import { SplashScreen } from "./SplashScreen";
import { AppBootSkeleton } from "./components/LoadingSkeletons";

// Public Pages
import { IndexPage } from "./pages/IndexPage";
import { ShopPage } from "./pages/ShopPage";
import HotSalesPage from "./pages/HotSalesPage";
import FlashSalesPage from "./pages/FlashSalesPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { LogisticsPage } from "./pages/LogisticsPage";
import { LogisticsBookingPage } from "./pages/LogisticsBookingPage";
import { TrackorderPage } from "./pages/TrackorderPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ShippingReturnsPolicyPage from "./pages/ShippingReturnsPolicyPage";

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
import { SellerLandingPage } from "./pages/seller/SellerPage"; 

// Admin Pages
import Dashboard from "./AdminPanel/pages/Dashboard";
import Users from "./AdminPanel/pages/Users";
import Sellers from "./AdminPanel/pages/Sellers";
import Products from "./AdminPanel/pages/Products";
import Promotions from "./AdminPanel/pages/Promotions";
import HeroSlides from "./AdminPanel/pages/HeroSlides";
import Logistics from "./AdminPanel/pages/Logistics";
import SellerDetailPage from "./AdminPanel/components/SellerDetails";
import AdminLogin from "./AdminPanel/AdminLogin";

// Admin Submenu Pages
import UserTracking from "./AdminPanel/pages/UserTracking";
import SellerOrdersAdmin from "./AdminPanel/pages/SellerOrdersAdmin";
import SellerProductsAdmin from "./AdminPanel/pages/SellerProductsAdmin";
import SellerPayments from "./AdminPanel/pages/SellerPayments";
import SellerRequests from "./AdminPanel/pages/SellerRequests";
import OrderLocations from "./AdminPanel/pages/OrderLocations";
import LogisticsRequest from "./AdminPanel/pages/LogisticsRequest";
import SellerOrders from "./AdminPanel/pages/SellerOrders";
import { purgeInvalidAdminSession } from "./AdminPanel/utils/adminSession";

// Context & Routes
import { SellerAuthProvider } from "./context/SellerAuthContext";
import ProtectedSellerRoute from "./routes/ProtectedSellerRoute";

// ✅ ADMIN ROUTE PROTECTION
const AdminRoute = ({ children }) => {
  if (!purgeInvalidAdminSession()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const SPLASH_SESSION_KEY = "lantaxpress:splash-seen";

const shouldShowSplashOnLoad = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return window.sessionStorage.getItem(SPLASH_SESSION_KEY) !== "true";
};

const App = () => {
  const [showSplash, setShowSplash] = useState(shouldShowSplashOnLoad);
  const [showInitialRouteSkeleton, setShowInitialRouteSkeleton] = useState(() => !shouldShowSplashOnLoad());

  const getIsLoggedIn = () => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("user");
    return !!(token && storedUser && storedUser !== "undefined");
  };
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn());

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }

    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
      }
      setShowSplash(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    if (showSplash || !showInitialRouteSkeleton) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowInitialRouteSkeleton(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [showInitialRouteSkeleton, showSplash]);

  const handleLoginStateChange = (loggedIn, userData) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-state-changed"));
    }
  };

  return (
    <SellerAuthProvider>
      {showSplash ? (
        <SplashScreen />
      ) : showInitialRouteSkeleton ? (
        <AppBootSkeleton pathname={typeof window !== "undefined" ? window.location.pathname : "/"} />
      ) : (
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Routes>

            {/* PUBLIC PAGES */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/hot-sales" element={<HotSalesPage />} />
            <Route path="/flash-sales" element={<FlashSalesPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/logistics/book" element={<LogisticsBookingPage />} />
            <Route path="/track" element={<TrackorderPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/shipping-returns" element={<ShippingReturnsPolicyPage />} />

            {/* ADMIN LOGIN */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 🔐 ADMIN PANEL (PROTECTED) */}
            <Route path="/AdminPanel/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

            {/* USERS */}
            <Route path="/AdminPanel/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/AdminPanel/users/tracking" element={<AdminRoute><UserTracking /></AdminRoute>} />

            {/* SELLERS */}
            <Route path="/AdminPanel/sellers" element={<AdminRoute><Sellers /></AdminRoute>} />
            <Route path="/AdminPanel/sellers/orders" element={<AdminRoute><SellerOrdersAdmin /></AdminRoute>} />

            <Route
              path="/AdminPanel/sellers/orders/:sellerBrand"
              element={<AdminRoute><SellerOrders /></AdminRoute>}
            />

            <Route path="/AdminPanel/sellers/products" element={<AdminRoute><SellerProductsAdmin /></AdminRoute>} />
            <Route path="/AdminPanel/sellers/payments" element={<AdminRoute><SellerPayments /></AdminRoute>} />
            <Route path="/AdminPanel/sellers/requests" element={<AdminRoute><SellerRequests /></AdminRoute>} />

            {/* SELLER DETAILS */}
            <Route path="/sellers" element={<AdminRoute><Sellers /></AdminRoute>} />
            <Route path="/sellers/:sellerId" element={<AdminRoute><SellerDetailPage /></AdminRoute>} />

            {/* PRODUCTS */}
            <Route path="/AdminPanel/products" element={<AdminRoute><Products /></AdminRoute>} />
            <Route path="/AdminPanel/promotions" element={<AdminRoute><Promotions /></AdminRoute>} />
            <Route path="/AdminPanel/hero-slides" element={<AdminRoute><HeroSlides /></AdminRoute>} />

            {/* LOGISTICS */}
            <Route path="/AdminPanel/logistics" element={<AdminRoute><Logistics /></AdminRoute>} />
            <Route path="/AdminPanel/logistics/location" element={<AdminRoute><OrderLocations /></AdminRoute>} />
            <Route path="/AdminPanel/logistics/requests" element={<AdminRoute><LogisticsRequest /></AdminRoute>} />

            <Route path="/seller" element={<SellerLandingPage />} />

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
      )}
    </SellerAuthProvider>
  );
};

export default App;