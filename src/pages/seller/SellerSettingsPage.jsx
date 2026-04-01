// src/pages/seller/SellerSettingsPage.jsx
import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";

const SellerSettingsPage = () => {
  const [seller, setSeller] = useState({
    brandName: "",
    email: "",
    address: "",
    state: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    messages: true,
    promotions: false,
  });
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });

  const openFeedbackModal = (title, message, tone = "default") => {
    setFeedbackModal({ open: true, title, message, tone });
  };

  // Load seller data from localStorage
  useEffect(() => {
    const currentSeller = JSON.parse(localStorage.getItem("currentSeller")) || {};
    setSeller({
      brandName: currentSeller.brandName || "",
      email: currentSeller.email || "",
      address: currentSeller.address || "",
      state: currentSeller.state || "",
    });
  }, []);

  const handleSellerChange = (e) => {
    const { name, value } = e.target;
    setSeller((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("currentSeller", JSON.stringify(seller));
    openFeedbackModal("Profile Updated", "Profile updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      openFeedbackModal("Password Update Failed", "New passwords do not match!", "danger");
      return;
    }
    // Simulate backend call here
    openFeedbackModal("Password Updated", "Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Seller Settings</h2>

      {/* Profile Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="brandName"
            placeholder="Brand Name"
            value={seller.brandName}
            onChange={handleSellerChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={seller.email}
            onChange={handleSellerChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={seller.address}
            onChange={handleSellerChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={seller.state}
            onChange={handleSellerChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
          />
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={passwords.current}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="new"
            placeholder="New Password"
            value={passwords.new}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="orders"
              checked={notifications.orders}
              onChange={handleNotificationsChange}
              className="h-4 w-4 accent-green-600"
            />
            Notify me about new orders
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="messages"
              checked={notifications.messages}
              onChange={handleNotificationsChange}
              className="h-4 w-4 accent-green-600"
            />
            Notify me about messages
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="promotions"
              checked={notifications.promotions}
              onChange={handleNotificationsChange}
              className="h-4 w-4 accent-green-600"
            />
            Notify me about promotions
          </label>
        </div>
      </section>

      <ConfirmationModal
        isOpen={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onCancel={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        onConfirm={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        confirmLabel="OK"
        hideCancel
        tone={feedbackModal.tone}
      />

    </div>
  );
};

export default SellerSettingsPage;