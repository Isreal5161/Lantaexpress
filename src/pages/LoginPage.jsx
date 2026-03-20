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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        // Save token and user info
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.name}!`);

        if (onLogin) onLogin(true);

        // Redirect based on role (optional)
        if (data.user.role === "user") navigate("/account");
        else if (data.user.role === "seller") navigate("/seller-dashboard");
        else if (data.user.role === "admin") navigate("/admin-dashboard");
      } else {
        alert(data.message || "Invalid credentials, try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Branding */}
        <div className="hidden md:flex w-1/2 bg-green-600 text-white items-center justify-center p-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg">
              Shop smart. Shop easy. Discover amazing deals every day.
            </p>
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
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
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

              {/* Forgot Password Link */}
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
              <Link
                to="/signup"
                className="text-green-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-slate-100 text-gray-500 text-center py-4 text-sm">
        © 2026 Lanta Express. All rights reserved.
      </footer>
    </div>
  );
}