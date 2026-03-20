// src/pages/account/AccountPage.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import AccountHeader from "../components/AccountHeader";
import AccountSidebar from "../components/AccountSidebar";
import { Footer } from "../components/footer";

// API URL - local in dev, Render in production
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://lantaxpressbackend.onrender.com/api";

const AccountPage = ({ onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const showBackButton = location.pathname !== "/account";
  const showSignOutButton = location.pathname === "/account";

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
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
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      } catch (err) {
        console.error(err);
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

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    if (onSignOut) onSignOut(false);
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
      <AccountHeader />

      <div className="flex-1 pb-24">
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="hidden md:block md:w-1/4">
            <AccountSidebar user={user} />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-3xl">
              {showBackButton && (
                <button
                  onClick={() => navigate("/account")}
                  className="text-gray-700 hover:text-gray-900 mb-4 flex items-center gap-2"
                >
                  <FaArrowLeft size={18} />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
              )}

              {showSignOutButton && (
                <h1 className="text-2xl font-bold mb-6">Welcome, {userName}!</h1>
              )}

              {/* Pass user to nested routes (Dashboard) via context or props */}
              <Outlet context={{ user, setUser, API_URL }} />

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

        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;