// src/pages/account/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const countries = ["Nigeria", "United States", "United Kingdom", "Canada", "Ghana", "South Africa"];

const EditProfile = () => {
  const { user, setUser, API_URL } = useOutletContext();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "Nigeria",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        country: user.country || "Nigeria",
      });
      return;
    }

    const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      setFormData({
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
        email: parsedUser.email || "",
        country: parsedUser.country || "Nigeria",
      });
    } catch {
      setFormData((current) => ({ ...current, country: "Nigeria" }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in again.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const mergedUser = {
        ...(user || {}),
        ...formData,
        ...(data.user || {}),
      };

      setUser(mergedUser);
      localStorage.setItem("currentUser", JSON.stringify(mergedUser));
      localStorage.setItem("user", JSON.stringify(mergedUser));
      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
        <Select label="Country" name="country" value={formData.country} onChange={handleChange} options={countries} />

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default EditProfile;