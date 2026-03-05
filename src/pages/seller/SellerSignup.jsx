// src/pages/seller/SellerSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";

const nigeriaStates = [
  "Lagos","Abuja (FCT)","Oyo","Ogun","Rivers","Kano",
  "Kaduna","Anambra","Delta","Enugu","Osun","Ekiti"
];

const categoriesList = [
  "Fashion",
  "Electronics",
  "Beauty",
  "Home & Kitchen",
  "Groceries",
  "Phones & Accessories",
  "Computers",
  "Baby Products",
  "Sports",
  "Health"
];

const SellerSignup = () => {
  const navigate = useNavigate();
  const { login } = useSellerAuth();
  const [step, setStep] = useState(1);

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
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Logo must be under 1MB");
        return;
      }
      setFormData({
        ...formData,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!formData.agree) {
      alert("You must agree to the terms");
      return;
    }

    const sellerData = {
      fullName: formData.fullName,
      brandName: formData.brandName,
      email: formData.email,
      phone: formData.phone,
      description: formData.description,
      categories: formData.categories,
      logoPreview: formData.logoPreview,
      country: formData.country,
      state: formData.state,
      address: formData.address,
    };

    login(sellerData);
    navigate("/seller-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 px-4 py-8">

      {/* Welcome Section */}
      <div className="bg-white w-full max-w-3xl p-6 rounded-3xl shadow-xl border border-green-100 flex items-center space-x-4 mb-10">
        <img src="lantalogo1.jpg" alt="LantaXeller Logo" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="text-3xl font-bold text-green-700">Welcome to LantaXeller!</h1>
          <p className="text-green-800 mt-1">Create your seller account and start selling with ease.</p>
        </div>
      </div>

      {/* Signup Form Card */}
      <div className="bg-white w-full max-w-3xl p-10 rounded-3xl shadow-xl border border-green-100">

        {/* Stepper */}
        <div className="flex justify-between mb-10">
          {[1,2,3].map((num) => (
            <div
              key={num}
              className={`flex-1 text-center py-3 rounded-full mx-1 font-medium transition-all
              ${step === num ? "bg-green-600 text-white shadow-lg scale-105" : "bg-green-100 text-green-700"}`}
            >
              Step {num}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-green-700 mb-4">Personal Information</h2>
              <input type="text" name="fullName" placeholder="Full Name"
                value={formData.fullName} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <input type="email" name="email" placeholder="Email"
                value={formData.email} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <input type="tel" name="phone" placeholder="Phone Number"
                value={formData.phone} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-green-700 mb-4">Brand Information</h2>

              <input type="text" name="brandName" placeholder="Brand Name"
                value={formData.brandName} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <textarea name="description" placeholder="Store Description"
                value={formData.description} onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <div>
                <p className="font-medium mb-2 text-green-800">Select Categories</p>
                <div className="grid grid-cols-2 gap-3">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:text-green-700 transition">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="accent-green-600"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2 text-green-800">Upload Brand Logo</p>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="mb-2" />
                {formData.logoPreview && (
                  <img
                    src={formData.logoPreview}
                    alt="Preview"
                    className="mt-2 h-28 w-28 object-cover rounded-full border-2 border-green-200 shadow"
                  />
                )}
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-green-700 mb-4">Location & Security</h2>

              <input type="text" value="Nigeria"
                disabled className="w-full border rounded-xl px-4 py-3 bg-green-50 text-green-700" />

              <select name="state" value={formData.state} onChange={handleChange} required
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none">
                <option value="">Select State</option>
                {nigeriaStates.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>

              <input type="text" name="address" placeholder="Business Address"
                value={formData.address} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <input type="password" name="password" placeholder="Password"
                value={formData.password} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <input type="password" name="confirmPassword" placeholder="Confirm Password"
                value={formData.confirmPassword} onChange={handleChange}
                required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:outline-none" />

              <label className="flex items-center space-x-2">
                <input type="checkbox" name="agree"
                  checked={formData.agree} onChange={handleChange}
                  className="accent-green-600"
                />
                <span className="text-green-800">I agree to Seller Terms & Policy</span>
              </label>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition">
                Back
              </button>
            )}

            {step < 3 ? (
              <button type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition">
                Next
              </button>
            ) : (
              <button type="submit"
                className="ml-auto px-6 py-2 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition">
                Create Seller Account
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerSignup;