import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // Example animated icon, you can swap

export const BecomeSeller = ({ position = "right" }) => {
  return (
    <Link
      to="/become-seller"
      className={`
        fixed ${position}-4 top-1/3 z-50 flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-l-lg shadow-lg hover:bg-green-700 transition-all
        hover:scale-105 transform
        animate-bounce-slow
      `}
    >
      <ShoppingCart className="w-6 h-6 animate-spin-slow" />
      <span className="font-semibold">Become a Seller</span>
    </Link>
  );
};