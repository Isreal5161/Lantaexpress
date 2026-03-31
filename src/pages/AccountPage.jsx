// src/pages/account/AccountPage.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import AccountHeader from "../components/AccountHeader";
import AccountSidebar from "../components/AccountSidebar";
import { Footer } from "../components/footer";

// API base URL (use REACT_APP_API_BASE to override)
const API_URL = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

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
        const storedUserRaw = localStorage.getItem("currentUser") || localStorage.getItem("user");
        let storedUser = null;

        if (storedUserRaw) {
          try {
            storedUser = JSON.parse(storedUserRaw);
          } catch {
            storedUser = null;
          }
        }

        const mergedUser = {
          ...(storedUser || {}),
          ...(data.user || {}),
          country: data.user?.country || storedUser?.country || "Nigeria",
        };

        setUser(mergedUser);
        localStorage.setItem("currentUser", JSON.stringify(mergedUser));
        localStorage.setItem("user", JSON.stringify(mergedUser));
      } catch (err) {
        console.error(err);
        const localUserRaw = localStorage.getItem("currentUser") || localStorage.getItem("user");
        if (localUserRaw) {
          try {
            const localUser = JSON.parse(localUserRaw);
            setUser(localUser);
          } catch {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            navigate("/login");
          }
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
      <div className="min-h-screen flex flex-col bg-slate-100">
        <div className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="skeleton-shimmer h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="skeleton-shimmer h-3 w-24 rounded-full bg-slate-200" />
                <div className="skeleton-shimmer h-4 w-32 rounded-full bg-slate-200" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="skeleton-shimmer h-10 w-10 rounded-full bg-slate-200" />
              <div className="skeleton-shimmer h-10 w-10 rounded-full bg-slate-200" />
              <div className="skeleton-shimmer h-10 w-10 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="flex-1 pb-18">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 md:flex-row">
            <aside className="hidden md:block md:w-72">
              <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-4">
                  <div className="skeleton-shimmer h-16 w-16 rounded-2xl bg-slate-200" />
                  <div className="flex-1 space-y-3">
                    <div className="skeleton-shimmer h-4 w-28 rounded-full bg-slate-200" />
                    <div className="skeleton-shimmer h-3 w-20 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="skeleton-shimmer h-11 rounded-2xl bg-slate-200" />
                  ))}
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-sm sm:p-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="skeleton-shimmer h-4 w-24 rounded-full bg-slate-200" />
                    <div className="skeleton-shimmer h-8 w-52 rounded-full bg-slate-200" />
                    <div className="skeleton-shimmer h-4 w-72 max-w-full rounded-full bg-slate-200" />
                  </div>
                  <div className="skeleton-shimmer h-11 w-36 rounded-2xl bg-slate-200" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div className="skeleton-shimmer h-4 w-24 rounded-full bg-slate-200" />
                        <div className="skeleton-shimmer h-10 w-10 rounded-2xl bg-slate-200" />
                      </div>
                      <div className="space-y-3">
                        <div className="skeleton-shimmer h-7 w-20 rounded-full bg-slate-200" />
                        <div className="skeleton-shimmer h-3 w-28 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 sm:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="skeleton-shimmer h-5 w-40 rounded-full bg-slate-200" />
                      <div className="skeleton-shimmer h-3 w-52 rounded-full bg-slate-200" />
                    </div>
                    <div className="hidden sm:block skeleton-shimmer h-10 w-24 rounded-2xl bg-slate-200" />
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm">
                        <div className="skeleton-shimmer h-12 w-12 rounded-2xl bg-slate-200" />
                        <div className="flex-1 space-y-3">
                          <div className="skeleton-shimmer h-4 w-40 rounded-full bg-slate-200" />
                          <div className="skeleton-shimmer h-3 w-56 max-w-full rounded-full bg-slate-200" />
                        </div>
                        <div className="skeleton-shimmer h-9 w-20 rounded-full bg-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AccountHeader />

      <div className="flex-1 pb-18">
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