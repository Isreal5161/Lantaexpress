import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import AccountHeader from "../components/AccountHeader";
import AccountSidebar from "../components/AccountSidebar";
import { Footer } from "../components/footer";

const AccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/account";  // Only on nested pages
  const showSignOutButton = location.pathname === "/account"; // Only on main dashboard

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AccountHeader />
      <div className="pb-24">
<div className="pb-20 md:pb-0">
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-3xl">

            {/* Minimal Back Arrow */}
            {showBackButton && (
              <button
                onClick={() => navigate("/account")}
                className="text-gray-700 hover:text-gray-900 mb-4"
              >
                <FaArrowLeft size={18} />
              </button>
            )}

            <Outlet />

            {/* Conditional Sign Out Button */}
            {showSignOutButton && (
              <button className="mt-6 w-full bg-green-600 text-white py-3 font-medium hover:bg-green-700 transition">
                <div className="flex items-center justify-center gap-2">
                  <FaSignOutAlt />
                  Sign Out
                </div>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    </div>
    </div>
  );
};

export default AccountPage;