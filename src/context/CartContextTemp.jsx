import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const CART_STORAGE_KEY = "lantaxpress_cart";

const getProductId = (product) => product?.id || product?._id || product?.productId || null;

const normalizeCartItem = (product = {}) => {
  const id = getProductId(product);

  if (!id) {
    return null;
  }

  const parsedQuantity = Number(product.quantity);
  const parsedStock = Number(product.stock);

  return {
    ...product,
    id,
    image: product.image || product.images?.[0] || "",
    stock: Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : 0,
    quantity: Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1,
  };
};

const loadStoredCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");

    if (!Array.isArray(storedCart)) {
      return [];
    }

    return storedCart.map(normalizeCartItem).filter(Boolean);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadStoredCart);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncCartFromStorage = () => {
      setCartItems(loadStoredCart());
    };

    window.addEventListener("storage", syncCartFromStorage);

    return () => {
      window.removeEventListener("storage", syncCartFromStorage);
    };
  }, []);

  const addToCart = (product) => {
    const normalizedProduct = normalizeCartItem(product);

    if (!normalizedProduct) {
      return;
    }

    if ((Number(normalizedProduct.stock) || 0) <= 0) {
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(normalizedProduct.id));

      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(normalizedProduct.id)
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + normalizedProduct.quantity,
                  Math.max(Number(normalizedProduct.stock) || 0, 1),
                ),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...normalizedProduct,
          quantity: Math.min(normalizedProduct.quantity, Math.max(Number(normalizedProduct.stock) || 0, 1)),
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, Math.max(Number(item.stock) || 0, 1)),
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(id) ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((t, item) => t + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);