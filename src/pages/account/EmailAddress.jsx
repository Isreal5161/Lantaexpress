// src/pages/account/EmailAddress.jsx
import React from "react";

const EmailAddress = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Email Address</h2>

      <div className="p-4 border rounded-lg bg-gray-50 mb-6">
        <p className="text-sm text-gray-600">Current Email:</p>
        <p className="font-medium">albert@example.com</p>
      </div>

      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
        Change Email
      </button>
    </div>
  );
};

export default EmailAddress;