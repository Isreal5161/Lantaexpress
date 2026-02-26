// src/pages/account/EditProfile.jsx
import React from "react";

const EditProfile = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      <form className="space-y-4">
        <Input label="Full Name" />
        <Input label="Username" />
        <Input label="Phone Number" />
        <Input label="Email Address" type="email" />

        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
    />
  </div>
);

export default EditProfile;