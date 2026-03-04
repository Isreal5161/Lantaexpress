// src/pages/PrivacyPolicyPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white py-6 px-4 md:px-12">
        <h1 className="text-3xl font-bold">Privacy & Policy</h1>
        <p className="text-green-100 mt-2">
          Your privacy matters to us. Please read our policy carefully.
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 max-w-4xl mx-auto">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to Lanta Express. We respect your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Personal information such as name, email, and contact details.</li>
            <li>Usage data like your browsing patterns and interaction with our services.</li>
            <li>Payment information when you make purchases.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>To provide and maintain our services.</li>
            <li>To process transactions and send purchase confirmations.</li>
            <li>To improve user experience and customize our offerings.</li>
            <li>To communicate updates, offers, or important notices.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
          <p className="text-gray-700">
            We use industry-standard measures to protect your data from unauthorized access, disclosure, or destruction. 
            However, no method of transmission over the Internet or electronic storage is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Sharing Your Data</h2>
          <p className="text-gray-700">
            We do not sell your personal data. We may share information with trusted partners to provide services or comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Cookies & Tracking</h2>
          <p className="text-gray-700">
            We may use cookies or similar technologies to enhance your browsing experience and analyze site traffic.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Your Rights</h2>
          <p className="text-gray-700">
            You have the right to access, update, or request deletion of your personal data. Contact us at 
            <span className="text-green-600 font-medium"> support@lantaexpress.com</span>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update our Privacy Policy occasionally. The latest version will always be available on this page.
          </p>
        </section>

        <div className="text-center mt-6">
          <Link
            to="/signup"
            className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition"
          >
            Back to Sign Up
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 text-gray-500 text-center py-4 text-sm">
        © 2026 Lanta Express. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;