// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    if (!acceptPrivacy) {
      alert("You must accept the Privacy & Policy to sign up.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      alert("Email already registered. Please login.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("authToken", "dummy-token");

    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Branding */}
        <div className="hidden md:flex w-1/2 bg-green-600 text-white items-center justify-center p-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Join LantaXpress</h1>
            <p className="text-lg">
              Sign up and start shopping smart. Discover amazing deals every day.
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
              Create Your Account
            </h2>

            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>

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

              {/* Privacy & Policy */}
             <div className="flex items-center gap-2">
               <input
  type="checkbox"
  id="acceptPolicy"
  checked={acceptPrivacy}
  onChange={(e) => setAcceptPrivacy(e.target.checked)}
  className="w-4 h-4 accent-green-600"
  required
/>
            <label htmlFor="acceptPolicy" className="text-sm text-gray-600">
            I accept the{" "}
            <Link
            to="/privacy-policy"
            className="text-green-600 hover:underline"
            target="_blank"
             >
            Privacy & Policy
    </Link>
  </label>
</div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300"
              >
                Sign Up
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-slate-100 text-gray-500 text-center py-4 text-sm">
        © 2026 Lanta Express. All rights reserved.
      </footer>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-xl p-8 text-center shadow-2xl animate-scaleIn">
            <div className="text-green-600 text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Your account has been created successfully.
            </p>
            <button
              onClick={() => navigate("/account")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition"
            >
              Continue to Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}