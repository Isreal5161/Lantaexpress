// src/components/Header.jsx
import React from "react";
import { useCart } from "../context/CartContextTemp";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Link } from "./Link";
import { Text } from "./Text";

export const Header = () => {
  const { cartCount } = useCart(); // <-- using cartCount instead of cartItems.length

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-green-900 text-white text-xs font-medium py-2 text-center tracking-wide">
        FREE SHIPPING ON ALL ORDERS OVER $50
      </div>

      {/* Navigation */}
      <header>
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link
                  className="flex items-center gap-2 font-heading font-bold text-2xl text-slate-900 tracking-tight"
                  href="/"
                >
                  <img
                    src="/lantalogo1.jpg"
                    alt="Lanta Logo"
                    className="h-12 w-auto"
                  />
                  Lanta Express
                  <Text className="text-green-700">.</Text>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <Link className="text-slate-900 font-medium hover:text-green-700 transition-colors" href="/">
                  Home
                </Link>
                <Link className="text-slate-500 font-medium hover:text-green-700 transition-colors" href="/shop">
                  Shop
                </Link>
                <Link className="text-slate-500 font-medium hover:text-green-700 transition-colors" href="/logistics">
                  Logistics
                </Link>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-6">
                <Button className="text-slate-400 hover:text-slate-900 transition-colors">
                  <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>
                </Button>

                <Link className="text-slate-400 hover:text-slate-900 transition-colors relative" href="/cart">
                  <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>

                  {/* Cart count badge */}
                  {cartCount > 0 && (
                    <Text className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </Text>
                  )}
                </Link>
              </div>

            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center bg-slate-100 rounded-md px-3 py-2">
          <Icon className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Icon>
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm ml-2 w-full"
          />
        </div>
      </div>
    </>
  );
};