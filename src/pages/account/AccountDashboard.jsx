// src/pages/account/AccountDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBell,
  FaMapMarkerAlt,
  FaLock,
  FaEnvelope,
  FaCamera,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api, https://lantaxpressbackend.onrender.com";

const AccountDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null); // temporary preview for selected file

  // Fetch current user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      } catch (err) {
        console.error(err);
        const localUser = JSON.parse(localStorage.getItem("currentUser"));
        if (localUser) {
          setUser(localUser);
        } else {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle profile image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
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

      // Update user state & global localStorage
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setPreview(null); // remove preview after upload
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-600 font-bold text-xl">
        Loading your account...
      </div>
    );
  }

  if (!user) return null;

  // Avatar content: preview > uploaded avatar > fallback first letter
  const avatarContent = preview ? (
    <img
      src={preview}
      alt="Preview"
      className="w-24 h-24 rounded-full border-4 border-green-100 object-cover"
    />
  ) : user.avatar ? (
    <img
      src={`http://localhost:5000${user.avatar}`}
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
      {/* Profile Section */}
      <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6">
        <div className="relative">
          {avatarContent}

          {/* Upload button */}
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

      {/* Menu Links */}
      <div className="mt-8 space-y-3">
        <MenuLink to="edit-profile" icon={<FaUser />} label="Edit Profile" />
        <MenuLink to="notifications" icon={<FaBell />} label="Notifications" />
        <MenuLink
          to="shipping"
          icon={<FaMapMarkerAlt />}
          label="Shipping Address"
        />
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