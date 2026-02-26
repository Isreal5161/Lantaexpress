// src/pages/account/ChangePassword.jsx
import React from "react";

const Password = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>

      <form className="space-y-4">
        <Input label="Current Password" type="password" />
        <Input label="New Password" type="password" />
        <Input label="Confirm New Password" type="password" />

        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Update Password
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, type }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
    />
  </div>
);

export default Password;