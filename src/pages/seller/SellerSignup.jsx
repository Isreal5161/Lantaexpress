// src/pages/seller/SellerSignup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";
import "../../styles/globals.css";
import { getCategories } from "../../service/CategoryService";
import { SellerHeader } from "../../components/SellerHeader";

const nigeriaStates = [
  "Lagos","Abuja (FCT)","Oyo","Ogun","Rivers","Kano",
  "Kaduna","Anambra","Delta","Enugu","Osun","Ekiti"
];

const API_AUTH = process.env.REACT_APP_API_URL || "https://lantaxpressbackend.onrender.com/api/auth";

const SellerSignup = () => {
  const navigate = useNavigate();
  const { login } = useSellerAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    brandName: "",
    description: "",
    categories: [],
    logo: null,
    logoPreview: "",
    country: "Nigeria",
    state: "",
    address: "",
    password: "",
    confirmPassword: "",
    agree: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "agree") {
      setFormData({ ...formData, agree: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryChange = (category) => {
    const selectedCategories = Array.from(category.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      categories: selectedCategories,
    }));
  };

  const toggleCategorySelection = (categoryTitle) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryTitle)
        ? prev.categories.filter((category) => category !== categoryTitle)
        : [...prev.categories, categoryTitle],
    }));
  };

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (active) {
          setCategoriesList(
            Array.from(
              new Set(
                (data || [])
                  .map((category) => category?.title?.trim())
                  .filter(Boolean)
              )
            )
          );
        }
      } catch (error) {
        console.error("Failed to load seller signup categories:", error);
        if (active) {
          setCategoriesList([]);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Logo must be under 1MB");
        return;
      }
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agree) {
      alert("You must agree to the terms");
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.fullName);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("password", formData.password);
      formPayload.append("role", "seller");
      formPayload.append("brandName", formData.brandName);
      formPayload.append("description", formData.description);
      formPayload.append("categories", JSON.stringify(formData.categories));
      formPayload.append("state", formData.state);
      formPayload.append("address", formData.address);
      if (formData.logo) {
        formPayload.append("logo", formData.logo);
      }

      const res = await fetch(`${API_AUTH}/register`, {
        method: "POST",
        body: formPayload,
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Unexpected response from server: ${await res.text()}`);
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Save token & seller info
      localStorage.setItem("sellerToken", data.token);
      localStorage.setItem("currentSeller", JSON.stringify(data.user));

      login(data.user);
      if (data.user?.sellerApprovalStatus === "pending") {
        alert("Seller account created. Your account is now pending admin approval.");
      }
      navigate("/seller-dashboard");
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] font-body text-slate-800">
      <SellerHeader />

      <main className="overflow-hidden px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.98fr_1.02fr]">
          <section className="relative isolate overflow-hidden rounded-[34px] bg-[#071a10] text-white shadow-[0_30px_110px_rgba(2,12,7,0.3)]">
            <img src="/lantaexpressimage2.jpg" alt="Seller signup background" className="absolute inset-0 h-full w-full object-cover" />
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/SmartSeller.mov"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/lantaexpressimage2.jpg"
            />
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(7,26,16,0.92),rgba(7,26,16,0.58)_48%,rgba(7,26,16,0.86)),radial-gradient(circle_at_top_right,rgba(57,181,115,0.24),transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100 backdrop-blur-md">
                  Seller onboarding
                </div>
                <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Create a seller account that feels like the start of a real business journey.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
                  Set up your brand, choose product categories, and prepare your store for approval with a cleaner, more lively signup experience.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">What you unlock</p>
                  <p className="mt-2 text-base font-bold">Product management, seller dashboard access, order tracking, and income monitoring.</p>
                </div>
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                  <video
                    className="h-[220px] w-full rounded-[22px] object-cover sm:h-[280px]"
                    src="/Seller.mov"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/lantaexpressimage1.jpg"
                  />
                  <div className="absolute inset-x-6 bottom-6 hidden rounded-[22px] border border-white/20 bg-slate-950/65 p-4 text-white backdrop-blur-md sm:block">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Seller launch</p>
                    <p className="mt-2 text-base font-bold">A stronger first impression before your seller even reaches the dashboard.</p>
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md sm:hidden">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Seller launch</p>
                  <p className="mt-2 text-base font-bold leading-7">A stronger first impression before your seller even reaches the dashboard.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 rounded-[24px] border border-green-100 bg-gradient-to-r from-green-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img src="/lantalogo1.jpg" alt="LantaXeller Logo" className="h-14 w-14 rounded-2xl object-contain bg-white p-2 shadow-sm" />
                <div>
                  <h2 className="text-2xl font-black text-green-700">Create Seller Account</h2>
                  <p className="mt-1 text-sm text-slate-600">Three simple steps to set up your store details.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/seller-login"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Home
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`rounded-2xl px-4 py-4 text-center text-sm font-semibold transition-all ${
                    step === num
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  Step {num}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-green-700">Personal Information</h2>
              <input type="text" name="fullName" placeholder="Full Name"
                value={formData.fullName} onChange={handleChange} required
                className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
              <input type="email" name="email" placeholder="Email"
                value={formData.email} onChange={handleChange} required
                className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
              <input type="tel" name="phone" placeholder="Phone Number"
                value={formData.phone} onChange={handleChange} required
                className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-green-700">Brand Information</h2>
              <input type="text" name="brandName" placeholder="Brand Name"
                value={formData.brandName} onChange={handleChange} required
                className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
              <textarea name="description" placeholder="Store Description"
                value={formData.description} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
              <div>
                <p className="font-medium mb-2 text-green-800">Select Categories</p>
                <div className="rounded-2xl border border-green-200 bg-green-50/70 p-3 sm:p-4">
                  {categoriesList.length === 0 ? (
                    <p className="text-sm text-green-700">No categories available right now.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {categoriesList.map((cat) => {
                        const isSelected = formData.categories.includes(cat);

                        return (
                          <label
                            key={cat}
                            className={`flex min-h-[52px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                              isSelected
                                ? "border-green-600 bg-green-600 text-white shadow-sm"
                                : "border-green-200 bg-white text-green-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCategorySelection(cat)}
                              className="h-4 w-4 shrink-0 accent-green-600"
                            />
                            <span className="leading-snug">{cat}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-green-700">Tap one or more categories that match your store.</p>
              </div>
              <div>
                <p className="font-medium mb-2 text-green-800">Upload Brand Logo</p>
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="mb-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-green-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-green-700" />
                </div>
                {formData.logoPreview && (
                  <img src={formData.logoPreview} alt="Preview"
                    className="mt-2 h-28 w-28 object-cover rounded-full border-2 border-green-200 shadow" />
                )}
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-green-700">Location & Security</h2>
              <input type="text" value="Nigeria" disabled
                className="mb-4 min-h-14 w-full rounded-2xl border border-green-100 bg-green-50 px-4 text-sm text-green-700" />

              <select name="state" value={formData.state} onChange={handleChange} required
                className="mb-4 min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white">
                <option value="">Select State</option>
                {nigeriaStates.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>

              <input type="text" name="address" placeholder="Business Address"
                value={formData.address} onChange={handleChange} required
                className="mb-4 min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />

              {/* Password Fields */}
              <div className="relative mb-4">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-14 text-sm outline-none transition focus:border-green-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {formData.showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type={formData.showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-14 text-sm outline-none transition focus:border-green-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword })}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {formData.showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label className="flex items-center space-x-2 rounded-2xl bg-slate-50 px-4 py-4">
                <input type="checkbox" name="agree"
                  checked={formData.agree} onChange={handleChange}
                  className="accent-green-600" />
                <span className="text-green-800">I agree to Seller Terms & Policy</span>
              </label>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between border-t border-slate-100 pt-6">
            {step > 1 && (
              <button type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-2xl bg-green-100 px-6 py-3 font-medium text-green-700 transition hover:bg-green-200">
                Back
              </button>
            )}

            {step < 3 ? (
              <button type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto rounded-2xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700">
                Next
              </button>
            ) : (
              <button type="submit"
                className="ml-auto rounded-2xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800">
                {loading ? "Registering..." : "Create Seller Account"}
              </button>
            )}
          </div>
        </form>
            <p className="mt-8 text-center text-sm text-slate-600">
              Already have a seller account?{" "}
              <Link to="/seller-login" className="font-semibold text-green-700 hover:underline">
                Sign In
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SellerSignup;