import React from "react";
import { useCart } from "../context/CartContextTemp";
import { useNotification } from "../context/NotificationContext";
import { Link } from "./Link";
import { Icon } from "./Icon";

const AccountHeader = () => {
  const { cartCount } = useCart();
  const { notificationCount } = useNotification();

  return (
    <>
      <header>
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <Link
                className="flex items-center gap-2 font-heading font-bold text-xl text-slate-900"
                href="/"
              >
                <img
                  src="/lantalogo1.jpg"
                  alt="Logo"
                  className="h-10 w-auto"
                />
                My Account
              </Link>

              {/* Right Icons */}
              <div className="flex items-center space-x-6">

                {/* Search */}
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                  <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>
                </button>

                {/* Notification */}
                <button className="relative text-slate-400 hover:text-slate-900 transition-colors">
                  <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
                      a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341
                      C7.67 6.165 6 8.388 6 11v3.159
                      c0 .538-.214 1.055-.595 1.436L4 17h5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>

                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white w-4 h-4 rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <Link className="relative text-slate-400 hover:text-slate-900 transition-colors" href="/cart">
                  <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>

                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-800 text-xs font-semibold text-white w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default AccountHeader;