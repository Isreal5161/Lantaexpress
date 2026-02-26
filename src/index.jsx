import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { CartProvider } from './context/CartContextTemp';
import { NotificationProvider } from "./context/NotificationContext";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <NotificationProvider>
    <CartProvider>
      <App />
    </CartProvider>
    </NotificationProvider>
  </React.StrictMode>
);
