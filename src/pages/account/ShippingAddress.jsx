// src/pages/account/ShippingAddress.jsx
import React from "react";

const ShippingAddress = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

      <div className="p-4 border rounded-lg bg-gray-50 mb-6">
        <p className="font-medium">Albert Florest</p>
        <p className="text-sm text-gray-600">
          12 Lagos Street, Ikeja, Lagos, Nigeria
        </p>
        <p className="text-sm text-gray-600">+234 800 000 0000</p>
      </div>

      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
        Update Address
      </button>
    </div>
  );
};

export default ShippingAddress;