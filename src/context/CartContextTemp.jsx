import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart (handle duplicates)
  const addToCart = (product) => {
    // Check if product already in cart
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      // If already in cart, increase quantity
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // First time adding, set quantity = 1
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => useContext(CartContext);