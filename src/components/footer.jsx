// src/components/Footer.jsx
"use client";

import React from "react";
import { Link } from "./Link";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const pathname = useLocation().pathname;
  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <Link
                className="font-heading font-bold text-2xl text-white tracking-tight mb-4 block"
                href="#"
              >
                Lanta Express <Text className="text-green-500">.</Text>
              </Link>
              <p className="text-sm text-slate-400">
                Your destination for modern lifestyle essentials. Quality, style,
                and sustainability in every product.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="hover:text-white transition-colors" href="#">New Arrivals</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Best Sellers</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Sale</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Logistics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="hover:text-white transition-colors" href="#">Help Center</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Shipping & Returns</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Size Guide</Link></li>
                <li><Link className="hover:text-white transition-colors" href="#">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Stay in the loop</h4>
              <form className="flex gap-2">
                <input
                  placeholder="Enter your email"
                  type="email"
                  className="bg-slate-800 border-none rounded-md px-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-500"
                />
                <Button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition-colors">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            © 2026 Lanta Express Store. All rights reserved.
          </div>
        </div>
      </footer>

    {/* Modern Fintech Mobile Bottom Navigation */}
<div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">

  {/* Logistics */}
  <Link href="/logistics" className="flex flex-col items-center relative">
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        pathname.startsWith("/logistics")
          ? "bg-green-600 text-white -translate-y-2 shadow-lg"
          : "text-slate-500"
      }`}
    >
      <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 7h11v8H3V7zm11 3h4l3 3v2h-7v-5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="2" />
      </Icon>
    </div>
    <span
      className={`text-xs mt-1 transition-all ${
        pathname.startsWith("/logistics")
          ? "text-green-600 font-semibold"
          : "text-slate-500"
      }`}
    >
      Logistics
    </span>
  </Link>

  {/* Shop */}
  <Link href="/shop" className="flex flex-col items-center relative">
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        pathname.startsWith("/shop")
          ? "bg-green-600 text-white -translate-y-2 shadow-lg"
          : "text-slate-500"
      }`}
    >
      <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" />
      </Icon>
    </div>
    <span
      className={`text-xs mt-1 transition-all ${
        pathname.startsWith("/shop")
          ? "text-green-600 font-semibold"
          : "text-slate-500"
      }`}
    >
      Shop
    </span>
  </Link>

  {/* Home */}
  <Link href="/" className="flex flex-col items-center relative">
    <div
      className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
        pathname === "/"
          ? "bg-green-600 text-white -translate-y-3 shadow-xl scale-110"
          : "text-slate-500"
      }`}
    >
      <Icon className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12l9-9 9 9M4 10v10h16V10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    </div>
    <span
      className={`text-xs mt-1 transition-all ${
        pathname === "/"
          ? "text-green-600 font-semibold"
          : "text-slate-500"
      }`}
    >
      Home
    </span>
  </Link>

  {/* Cart */}
  <Link href="/cart" className="flex flex-col items-center relative">
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        pathname.startsWith("/cart")
          ? "bg-green-600 text-white -translate-y-2 shadow-lg"
          : "text-slate-500"
      }`}
    >
      <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M6 6h15l-1.5 9h-13z" stroke="currentColor" strokeWidth="2" />
      </Icon>
    </div>
    <span
      className={`text-xs mt-1 transition-all ${
        pathname.startsWith("/cart")
          ? "text-green-600 font-semibold"
          : "text-slate-500"
      }`}
    >
      Cart
    </span>
  </Link>

  {/* Account */}
  <Link href="/account" className="flex flex-col items-center relative">
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        pathname.startsWith("/account")
          ? "bg-green-600 text-white -translate-y-2 shadow-lg"
          : "text-slate-500"
      }`}
    >
      <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 12c2.7 0 5-2.3 5-5S14.7 2 12 2 7 4.3 7 7s2.3 5 5 5zM2 22c0-5 4-8 10-8s10 3 10 8"
          stroke="currentColor"
          strokeWidth="2"
        />
      </Icon>
    </div>
    <span
      className={`text-xs mt-1 transition-all ${
        pathname.startsWith("/account")
          ? "text-green-600 font-semibold"
          : "text-slate-500"
      }`}
    >
      Account
    </span>
  </Link>

</div>
    </>
  );
};