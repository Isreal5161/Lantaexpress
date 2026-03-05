// src/pages/seller/SellerLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";

const SellerLogin = () => {
  const navigate = useNavigate();
  const { login } = useSellerAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password");
      return;
    }

    // Temporary login data
    const sellerData = {
      email: formData.email,
      brandName: "Your Brand", // replace with backend data
      fullName: "Seller Name",
    };

    login(sellerData);
    navigate("/seller-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 px-4 py-8">

      {/* Welcome Section */}
      <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-xl border border-green-100 flex items-center space-x-4 mb-10">
        <img src="lantalogo1.jpg" alt="LantaXeller Logo" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="text-2xl font-bold text-green-700">Welcome Back to LantaXeller!</h1>
          <p className="text-green-800 mt-1 text-sm">Login to manage your store and track sales.</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-green-100">
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Business Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have a seller account?{" "}
          <Link to="/seller-signup" className="text-green-600 font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;