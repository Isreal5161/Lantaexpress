import React from "react";
import AccountHeader from "../components/AccountHeader";
import AccountSidebar from "../components/AccountSidebar";
import { Footer } from '../components/footer';

const AccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <AccountHeader />

      {/* Main layout */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <AccountSidebar />

        {/* Main content */}
        <section className="flex-1 p-4 md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-semibold text-gray-700">Profile Info</h2>
              <p className="text-gray-500 mt-2">Edit your personal information here.</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-semibold text-gray-700">Orders</h2>
              <p className="text-gray-500 mt-2">Track your recent orders.</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-semibold text-gray-700">Settings</h2>
              <p className="text-gray-500 mt-2">Manage your account preferences.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    
    </div>
  );
};

export default AccountPage;