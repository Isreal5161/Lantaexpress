// src/pages/seller/SellerLandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCartIcon, BoltIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { SellerHeader } from "../../components/SellerHeader";
 // Correct path

export const SellerLandingPage = () => {
  return (
    <div className="w-full min-h-screen font-sans bg-gray-50">

      {/* Animated Header */}
      <SellerHeader />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 overflow-hidden pt-16">
        
        {/* Background floating circles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-20 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white opacity-20 rounded-full animate-bounce-slower"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white opacity-15 rounded-full animate-bounce"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">
            Welcome to <span className="text-green-200">LantaXeller</span>
          </h1>
          <p className="text-white text-lg sm:text-xl md:text-2xl mb-6 animate-fadeIn delay-200">
            Start selling with ease and reach thousands of customers.
          </p>
          <Link
            to="/seller-signup"
            className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105 animate-bounce"
          >
            Become a Seller
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Sell With Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center">
              <ShoppingCartIcon className="mx-auto w-12 h-12 text-green-600 mb-4 animate-bounce" />
              <h3 className="font-semibold text-lg mb-2">Easy Setup</h3>
              <p>Create your store in minutes and start selling immediately.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center">
              <BoltIcon className="mx-auto w-12 h-12 text-green-600 mb-4 animate-bounce" />
              <h3 className="font-semibold text-lg mb-2">Reach Customers</h3>
              <p>Access thousands of buyers across Nigeria and beyond.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center">
              <ChartBarIcon className="mx-auto w-12 h-12 text-green-600 mb-4 animate-bounce" />
              <h3 className="font-semibold text-lg mb-2">Fast Payments</h3>
              <p>Receive payments instantly with secure transactions.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center">
              <Cog6ToothIcon className="mx-auto w-12 h-12 text-green-600 mb-4 animate-bounce" />
              <h3 className="font-semibold text-lg mb-2">Analytics</h3>
              <p>Track your sales and grow your business with insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-400 text-white text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Selling?</h2>
        <Link
          to="/seller-signup"
          className="inline-block px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
        >
          Become a Seller
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        &copy; {new Date().getFullYear()} LantaXpress. All Rights Reserved.
      </footer>

      {/* Tailwind Animations */}
      <style>
        {`
          .animate-bounce { animation: bounce 2s infinite; }
          .animate-bounce-slow { animation: bounce 6s infinite; }
          .animate-bounce-slower { animation: bounce 10s infinite; }
          .animate-fadeIn { animation: fadeIn 1.5s ease forwards; opacity: 0; }
          .animate-fadeIn.delay-200 { animation-delay: 0.2s; }

          @keyframes fadeIn { to { opacity: 1; } }
        `}
      </style>
    </div>
  );
};