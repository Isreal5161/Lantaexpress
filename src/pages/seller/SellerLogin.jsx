// src/pages/seller/SellerLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";
import { SellerHeader } from "../../components/SellerHeader";

const API_AUTH = process.env.REACT_APP_API_URL || "https://lantaxpressbackend.onrender.com/api/auth";

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
      const res = await fetch(`${API_AUTH}/login`, {
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
      if (data.user?.sellerApprovalStatus === "pending") {
        setError("Your seller account is pending admin approval. Dashboard access is limited until approval.");
      }
      navigate("/seller-dashboard");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] font-body text-slate-800">
      <SellerHeader />

      <main className="overflow-hidden px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="relative isolate overflow-hidden rounded-[34px] bg-[#071a10] text-white shadow-[0_30px_110px_rgba(2,12,7,0.3)]">
            <img src="/lantaexpressimage1.jpg" alt="Seller login background" className="absolute inset-0 h-full w-full object-cover" />
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/Seller.mov"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/lantaexpressimage1.jpg"
            />
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(7,26,16,0.92),rgba(7,26,16,0.58)_48%,rgba(7,26,16,0.86)),radial-gradient(circle_at_top_right,rgba(57,181,115,0.24),transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100 backdrop-blur-md">
                  Seller access
                </div>
                <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Welcome back to the seller side of LantaXpress.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
                  Sign in to manage products, follow orders, and keep your seller operation moving with confidence.
                </p>
              </div>

              <div className="mt-10">
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                  <video
                    className="h-[240px] w-full rounded-[22px] object-cover sm:h-[320px]"
                    src="/SmartSeller.mov"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/lantaexpressimage2.jpg"
                  />
                  <div className="absolute inset-x-6 bottom-6 hidden rounded-[22px] border border-white/20 bg-slate-950/65 p-4 text-white backdrop-blur-md sm:block">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Seller dashboard</p>
                    <p className="mt-2 text-base font-bold">A cleaner login experience leading into products, payouts, and seller growth.</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md sm:hidden">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Seller dashboard</p>
                  <p className="mt-2 text-base font-bold leading-7">A cleaner login experience leading into products, payouts, and seller growth.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="flex items-center gap-4 rounded-[24px] border border-green-100 bg-gradient-to-r from-green-50 to-white p-5">
              <img src="/lantalogo1.jpg" alt="LantaXeller Logo" className="h-14 w-14 rounded-2xl object-contain bg-white p-2 shadow-sm" />
              <div>
                <h2 className="text-2xl font-black text-green-700">Seller Login</h2>
                <p className="mt-1 text-sm text-slate-600">Access your store tools, orders, and income flow.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Business email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your business email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-14 text-sm outline-none transition focus:border-green-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-green-600 px-6 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-700"
              >
                {loading ? "Logging in..." : "Login to Seller Dashboard"}
              </button>
            </form>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Need an account?</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Create your seller profile and start listing products in a guided flow.</p>
              </div>
              <div className="rounded-[24px] bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">Approval note</p>
                <p className="mt-2 text-sm leading-6 text-green-700">New sellers may be reviewed before full dashboard access is enabled.</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              Don’t have a seller account?{" "}
              <Link to="/seller-signup" className="font-semibold text-green-700 hover:underline">
                Create Account
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SellerLogin;