// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api/auth";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleChoiceVisible, setRoleChoiceVisible] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data || data.message === "Invalid credentials") {
        throw new Error(data?.message || "Login failed");
      }

      // If seller, show role choice modal
      if (data.user.role === "seller") {
        setPendingUser(data);
        setRoleChoiceVisible(true);
        return;
      }

      // Normal login
      completeLogin(data);
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (data, roleOverride = null) => {
    const activeRole = roleOverride || data.user.role;

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("activeRole", activeRole);

    if (onLogin) onLogin(true, data.user);

    // Redirect based on role
    if (activeRole === "user") navigate("/account");
    else if (activeRole === "seller") navigate("/seller-dashboard");
    else if (activeRole === "admin") navigate("/admin-dashboard");
  };

  const handleRoleChoice = (choice) => {
    if (!pendingUser) return;
    setRoleChoiceVisible(false);
    completeLogin(pendingUser, choice);
    setPendingUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Branding */}
        <div className="hidden md:flex w-1/2 bg-green-600 text-white items-center justify-center p-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg">Shop smart. Shop easy. Discover amazing deals every day.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-slate-50 px-6 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <FaArrowLeft />
            <span className="hidden sm:inline text-sm font-medium">Home</span>
          </button>

          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Login to Your Account
            </h2>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert("Forgot password flow goes here")}
                  className="text-sm text-green-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-slate-100 text-gray-500 text-center py-4 text-sm">
        © 2026 Lanta Express. All rights reserved.
      </footer>

      {/* Role Choice Modal */}
      {roleChoiceVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-96 text-center">
            <h3 className="text-xl font-bold mb-4">Select Your Role</h3>
            <p className="mb-6 text-gray-700">
              This account is registered as a seller. How would you like to continue?
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleRoleChoice("seller")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Continue as Seller
              </button>
              <button
                onClick={() => handleRoleChoice("user")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition"
              >
                Continue as User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}