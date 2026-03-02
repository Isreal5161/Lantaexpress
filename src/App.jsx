// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';

import { LogisticsPage } from './pages/LogisticsPage';
import { IndexPage } from './pages/IndexPage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { TrackorderPage } from './pages/TrackorderPage';

import AccountPage from "./pages/AccountPage";
import AccountDashboard from "./pages/account/AccountDashboard";
import EditProfile from "./pages/account/EditProfile";
import Notifications from "./pages/account/Notifications";
import ShippingAddress from "./pages/account/ShippingAddress";
import Password from "./pages/account/Password";
import EmailAddress from "./pages/account/EmailAddress";

// Splash Screen Component
const SplashScreen = ({ onFinish }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3-second delay
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-500 z-50">
      <img
        src="/homescreenlogo.png"
        alt="LantaXpress Logo"
        className="w-48 h-48"
      />
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/track" element={<TrackorderPage />} />

        {/* Nested Account Routes */}
        <Route path="/account" element={<AccountPage />}>
          <Route index element={<AccountDashboard />} />            {/* /account */}
          <Route path="edit-profile" element={<EditProfile />} />  {/* /account/edit-profile */}
          <Route path="notifications" element={<Notifications />} />  {/* /account/notifications */}
          <Route path="shipping" element={<ShippingAddress />} />     {/* /account/shipping */}
          <Route path="password" element={<Password />} />             {/* /account/password */}
          <Route path="email" element={<EmailAddress />} />           {/* /account/email */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;