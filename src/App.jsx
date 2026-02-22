import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';
import { LogisticsPage } from './pages/LogisticsPage';
import { IndexPage } from './pages/IndexPage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { TrackorderPage } from './pages/TrackorderPage';


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/track" element={<TrackorderPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
