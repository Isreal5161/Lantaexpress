// src/pages/seller/SellerLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";

// Auto-detect backend URL
const getApiUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000/api/auth";
  }
  return "https://lantaxpressbackend.onrender.com/api/auth";
};

const SellerLogin = () => {
  const navigate = useNavigate();
  const { login } = useSellerAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError(""); // clear previous error

    try {
      const res = await fetch(`${getApiUrl()}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Unexpected response from server: ${await res.text()}`);
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.user.role !== "seller") {
        setError("This account is not registered as a seller");
        return;
      }

      // Save token & seller info
      localStorage.setItem("sellerToken", data.token);
      localStorage.setItem("currentSeller", JSON.stringify(data.user));

      login(data.user);
      navigate("/seller-dashboard");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 4.5c3.038 0 5.857 1.856 7.071 4.5-1.214 2.644-4.033 4.5-7.071 4.5S4.143 11.644 2.929 9 6.962 4.5 10 4.5zM10 8a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
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