// src/context/CartButtonContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartButtonContext = createContext();

export const CartButtonProvider = ({ children }) => {
  const [visibleProductId, setVisibleProductId] = useState(null);

  const showCartForProduct = (productId) => setVisibleProductId(productId);
  const hideCart = () => setVisibleProductId(null);

  return (
    <CartButtonContext.Provider
      value={{ visibleProductId, showCartForProduct, hideCart }}
    >
      {children}
    </CartButtonContext.Provider>
  );
};

export const useCartButton = () => useContext(CartButtonContext);