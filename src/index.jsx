import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { CartProvider } from './context/CartContextTemp';
import { NotificationProvider } from "./context/NotificationContext";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { CartButtonProvider } from './context/CartButtonContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <NotificationProvider>
      <CartButtonProvider>
      <CartProvider>
            <App />
        </CartProvider>
        </CartButtonProvider>
    </NotificationProvider>
  </React.StrictMode>
);

// ✅ Register CRA-ready service worker
serviceWorkerRegistration.register();