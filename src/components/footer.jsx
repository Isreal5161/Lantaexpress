// src/components/Footer.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "./Link";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { useLocation } from "react-router-dom";

export const Footer = () => {
  const { pathname } = useLocation();
  const mobileNavItems = [
    {
      key: "logistics",
      label: "Logistics",
      href: "/logistics",
      isActive: pathname.startsWith("/logistics"),
      icon: (
        <>
          <path
            d="M4 8.5h8.5v5.5H4zM12.5 10.5h3.5l2 2.5v1H12.5z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="16.5" r="1.25" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="15.5" cy="16.5" r="1.25" stroke="currentColor" strokeWidth="1.7" />
        </>
      ),
    },
    {
      key: "shop",
      label: "Shop",
      href: "/shop",
      isActive: pathname.startsWith("/shop") || pathname.startsWith("/hot-sales") || pathname.startsWith("/flash-sales") || pathname.startsWith("/product/"),
      icon: (
        <>
          <path d="M6 7.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M7 7.5l1.2 9h7.6L17 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.25 10.5h5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ),
    },
    {
      key: "home",
      label: "Home",
      href: "/",
      isActive: pathname === "/",
      icon: (
        <>
          <path
            d="M5.5 10.5L12 5l6.5 5.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 9.75V17h9V9.75"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ),
    },
    {
      key: "cart",
      label: "Cart",
      href: "/cart",
      isActive: pathname.startsWith("/cart"),
      icon: (
        <>
          <path d="M5.5 7h2l1.4 7h7.6l1.5-5.2H8.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10.25" cy="17.25" r="1" fill="currentColor" />
          <circle cx="15.75" cy="17.25" r="1" fill="currentColor" />
        </>
      ),
    },
    {
      key: "account",
      label: "Account",
      href: "/account",
      isActive: pathname.startsWith("/account"),
      icon: (
        <>
          <circle cx="12" cy="8.25" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M6.5 18c1.6-2.1 3.45-3 5.5-3s3.9.9 5.5 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ),
    },
  ];

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
                <li><Link className="hover:text-white transition-colors" href="/shop">New Arrivals</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/flash-sales">Best Sellers</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/hot-sales">Sale</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/logistics">Logistics</Link></li>
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

      <div className="md:hidden fixed inset-x-0 bottom-0 z-50">
        <div className="relative mx-auto max-w-md">
          <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden drop-shadow-[0_-10px_22px_rgba(15,23,42,0.12)]">
            <svg
              viewBox="0 0 400 92"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M0,24 C20,24 20,12 40,12 C60,12 60,24 80,24 C100,24 100,12 120,12 C140,12 140,24 160,24 C180,24 180,12 200,12 C220,12 220,24 240,24 C260,24 260,12 280,12 C300,12 300,24 320,24 C340,24 340,12 360,12 C380,12 380,24 400,24 L400,92 L0,92 Z"
                fill="rgba(255,255,255,0.96)"
              />
              <path
                d="M0,24 C20,24 20,12 40,12 C60,12 60,24 80,24 C100,24 100,12 120,12 C140,12 140,24 160,24 C180,24 180,12 200,12 C220,12 220,24 240,24 C260,24 260,12 280,12 C300,12 300,24 320,24 C340,24 340,12 360,12 C380,12 380,24 400,24"
                fill="none"
                stroke="rgba(226,232,240,0.96)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="relative px-2 pb-0 pt-3">
            <div className="grid grid-cols-5 gap-0.5">
              {mobileNavItems.map((item) => (
                <Link key={item.key} href={item.href} className="block">
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24 }}
                    className={`relative flex min-h-[4.05rem] flex-col items-center justify-end gap-1 overflow-hidden rounded-[1.15rem] px-1 pb-1 pt-2 transition-colors duration-300 ${
                      item.isActive ? "text-green-700" : "text-slate-500"
                    }`}
                  >
                    {item.isActive ? (
                      <motion.div
                        layoutId="mobile-footer-active-pill"
                        className="absolute inset-x-1 bottom-1 top-1 rounded-[1.05rem] bg-gradient-to-b from-orange-50/80 via-white to-emerald-50/70"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : null}

                    <motion.div
                      animate={item.isActive ? { y: [0, -2, 0], scale: [1, 1.05, 1] } : { y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
                        item.isActive
                          ? "border-orange-100 bg-white text-green-700 shadow-[0_8px_18px_rgba(251,146,60,0.18)]"
                          : "border-slate-200 bg-white/88 text-slate-500"
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] ${item.isActive ? "text-green-700" : "text-slate-500"}`} viewBox="0 0 24 24" fill="none">
                        {item.icon}
                      </Icon>
                    </motion.div>

                    <motion.span
                      animate={item.isActive ? { opacity: 1, y: 0 } : { opacity: 0.86, y: 0 }}
                      className={`relative z-10 text-[9px] font-medium tracking-[0.01em] ${item.isActive ? "text-green-700" : "text-slate-500"}`}
                    >
                      {item.label}
                    </motion.span>

                    {item.isActive ? (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="relative z-10 h-1 w-4 rounded-full bg-green-600"
                      />
                    ) : null}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};