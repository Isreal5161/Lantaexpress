// src/components/SellerHeader.jsx
import React from "react";
import { Link } from "react-router-dom";

export const SellerHeader = () => {
  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        
        {/* Logo with subtle pulse animation */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lantalogo1.jpg"
            alt="LantaXpress Logo"
            className="h-12 w-auto animate-pulse-slow"
          />
          <span className="font-bold text-xl text-green-600 tracking-tight">LantaXpress</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-800 font-medium hover:text-green-600 transition">
            Home
          </Link>
          <Link to="/shop" className="text-gray-600 font-medium hover:text-green-600 transition">
            Shop
          </Link>
          <Link to="/logistics" className="text-gray-600 font-medium hover:text-green-600 transition">
            Logistics
          </Link>
          <Link
            to="/seller-signup"
            className="px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
          >
            Become a Seller
          </Link>
        </nav>

      </div>

      {/* Mobile nav can be added later if needed */}
      
      {/* Animations style */}
      <style>
        {`
          .animate-pulse-slow {
            animation: pulse 2.5s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </header>
  );
};