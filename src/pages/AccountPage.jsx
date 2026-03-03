// src/pages/AccountPage.jsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import AccountHeader from "../components/AccountHeader";
import AccountSidebar from "../components/AccountSidebar";
import { Footer } from "../components/footer";

const AccountPage = ({ onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine visibility of buttons
  const showBackButton = location.pathname !== "/account"; // Only show back on nested pages
  const showSignOutButton = location.pathname === "/account"; // Only show sign out on dashboard

  // Get logged-in user from localStorage
  // src/pages/AccountPage.jsx
let currentUser;
try {
  const storedUser = localStorage.getItem("user");
  currentUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.warn("Failed to parse user from localStorage:", error);
  currentUser = null;
}

const userName = currentUser?.name || "Guest";

  // Sign Out Handler
  const handleSignOut = () => {
    // Clear all relevant auth info
    localStorage.removeItem("user");       // used by App.jsx to track login
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    // Notify App about logout
    if (onSignOut) onSignOut(false);

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <AccountHeader />

      <div className="flex-1 pb-24">
        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Sidebar for desktop */}
          <div className="hidden md:block md:w-1/4">
            
          </div>

          {/* Main content area */}
          <div className="flex-1 p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-3xl">

              {/* Back button for nested routes */}
              {showBackButton && (
                <button
                  onClick={() => navigate("/account")}
                  className="text-gray-700 hover:text-gray-900 mb-4 flex items-center gap-2"
                >
                  <FaArrowLeft size={18} />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
              )}

              {/* Welcome message on dashboard */}
              {showSignOutButton && (
                <h1 className="text-2xl font-bold mb-6">Welcome, {userName}</h1>
              )}

              {/* Nested account pages */}
              <Outlet />

              {/* Sign Out button on dashboard */}
              {showSignOutButton && (
                <button
                  onClick={handleSignOut}
                  className="mt-6 w-full bg-green-600 text-white py-3 font-medium rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;