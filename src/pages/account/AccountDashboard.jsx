// src/pages/account/AccountDashboard.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { FaUser, FaBell, FaMapMarkerAlt, FaLock, FaEnvelope, FaCamera } from "react-icons/fa";

const AccountDashboard = () => {
  const { user, setUser, API_URL } = useOutletContext(); // Get from AccountPage
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const token = localStorage.getItem("authToken");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API_URL}/auth/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const avatarURL = preview
    ? preview
    : user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_URL.replace("/api", "")}${user.avatar}`
    : null;

  const avatarContent = avatarURL ? (
    <img
      src={avatarURL}
      alt="Profile"
      className="w-24 h-24 rounded-full border-4 border-green-100 object-cover"
    />
  ) : (
    <div className="w-24 h-24 rounded-full border-4 border-green-100 bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
      {user.name?.[0]?.toUpperCase() || "U"}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6">
        <div className="relative">
          {avatarContent}
          <label
            className={`absolute bottom-1 right-1 bg-green-600 p-2 rounded-full text-white cursor-pointer flex items-center justify-center ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaCamera size={12} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500 text-sm capitalize">{user.role}</p>
      </div>

      <div className="mt-8 space-y-3">
        <MenuLink to="edit-profile" icon={<FaUser />} label="Edit Profile" />
        <MenuLink to="notifications" icon={<FaBell />} label="Notifications" />
        <MenuLink to="shipping" icon={<FaMapMarkerAlt />} label="Shipping Address" />
        <MenuLink to="password" icon={<FaLock />} label="Change Password" />
        <MenuLink to="email" icon={<FaEnvelope />} label="Email Address" />
      </div>
    </div>
  );
};

const MenuLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-green-600">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="text-gray-400">›</span>
  </Link>
);

export default AccountDashboard;