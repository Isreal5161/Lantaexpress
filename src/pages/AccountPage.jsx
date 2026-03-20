import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import AccountHeader from "../components/AccountHeader";
import AccountSidebar from "../components/AccountSidebar";
import { Footer } from "../components/footer";

const API_URL = "http://localhost:5000/api, https://lantaxpressbackend.onrender.com"; // adjust if needed

const AccountPage = ({ onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine visibility of buttons
  const showBackButton = location.pathname !== "/account"; // Only show back on nested pages
  const showSignOutButton = location.pathname === "/account"; // Only show sign out on dashboard

  // Fetch current user info from backend using JWT token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // redirect if not logged in
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user)); // save for fallback
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user info. Using local data if available.");

        // Fallback to localStorage if backend fails
        const localUser = JSON.parse(localStorage.getItem("currentUser"));
        if (localUser) {
          setUser(localUser);
        } else {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Sign Out Handler
  const handleSignOut = () => {
    // Clear all relevant auth info
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    // Notify parent about logout
    if (onSignOut) onSignOut(false);

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  const userName = user?.name || "Guest";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-600 font-bold text-xl">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <AccountHeader />

      <div className="flex-1 pb-24">
        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar for desktop */}
          <div className="hidden md:block md:w-1/4">
            <AccountSidebar user={user} />
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
                <h1 className="text-2xl font-bold mb-6">Welcome, {userName}!</h1>
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