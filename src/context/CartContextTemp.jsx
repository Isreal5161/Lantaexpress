import React, { createContext, useContext, useEffect, useState } from "react";
import { getScopedStorageKey, migrateLegacyStorageKey } from "../utils/userScopedStorage";

const CartContext = createContext();
const CART_STORAGE_KEY = "lantaxpress_cart";

const getProductId = (product) => product?.id || product?._id || product?.productId || null;
const resolveShippingMethod = (value) => (value === "home_delivery" ? "home_delivery" : "pickup_station");
const buildCartKey = (id, shippingMethod) => `${id}::${resolveShippingMethod(shippingMethod)}`;

const getCartIdentity = (value, shippingMethod) => {
  if (value && typeof value === "object") {
    return {
      id: value.id || value.productId || value._id || null,
      shippingMethod: resolveShippingMethod(value.selectedShippingMethod || value.shippingMethod),
      cartKey: value.cartKey || (value.id || value.productId || value._id ? buildCartKey(value.id || value.productId || value._id, value.selectedShippingMethod || value.shippingMethod) : null),
    };
  }

  if (typeof value === "string" && value.includes("::")) {
    const [id, method] = value.split("::");
    return {
      id,
      shippingMethod: resolveShippingMethod(method),
      cartKey: buildCartKey(id, method),
    };
  }

  const id = value || null;
  return {
    id,
    shippingMethod: shippingMethod ? resolveShippingMethod(shippingMethod) : null,
    cartKey: id && shippingMethod ? buildCartKey(id, shippingMethod) : null,
  };
};

const matchesCartItem = (item, value, shippingMethod) => {
  const identity = getCartIdentity(value, shippingMethod);

  if (identity.cartKey) {
    return item.cartKey === identity.cartKey;
  }

  return String(item.id) === String(identity.id);
};

const normalizeCartItem = (product = {}) => {
  const id = getProductId(product);

  if (!id) {
    return null;
  }

  const parsedQuantity = Number(product.quantity);
  const parsedStock = Number(product.stock);
  const selectedShippingMethod = resolveShippingMethod(product.selectedShippingMethod || product.shippingMethod);

  return {
    ...product,
    id,
    cartKey: buildCartKey(id, selectedShippingMethod),
    image: product.image || product.images?.[0] || "",
    stock: Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : 0,
    quantity: Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1,
    selectedShippingMethod,
  };
};

const loadStoredCart = (storageKey = getScopedStorageKey(CART_STORAGE_KEY)) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    migrateLegacyStorageKey(CART_STORAGE_KEY, storageKey);
    const storedCart = JSON.parse(window.localStorage.getItem(storageKey) || "[]");

    if (!Array.isArray(storedCart)) {
      return [];
    }

    return storedCart.map(normalizeCartItem).filter(Boolean);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [storageKey, setStorageKey] = useState(() => getScopedStorageKey(CART_STORAGE_KEY));
  const [cartItems, setCartItems] = useState(() => loadStoredCart(getScopedStorageKey(CART_STORAGE_KEY)));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncCartFromStorage = () => {
      const nextStorageKey = getScopedStorageKey(CART_STORAGE_KEY);
      setStorageKey(nextStorageKey);
      setCartItems(loadStoredCart(nextStorageKey));
    };

    window.addEventListener("storage", syncCartFromStorage);
    window.addEventListener("auth-state-changed", syncCartFromStorage);

    return () => {
      window.removeEventListener("storage", syncCartFromStorage);
      window.removeEventListener("auth-state-changed", syncCartFromStorage);
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
      const existing = prev.find((item) => item.cartKey === normalizedProduct.cartKey);

      if (existing) {
        return prev.map((item) =>
          item.cartKey === normalizedProduct.cartKey
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

  const removeFromCart = (value, shippingMethod) => {
    setCartItems((prev) => prev.filter((item) => !matchesCartItem(item, value, shippingMethod)));
  };

  const increaseQuantity = (value, shippingMethod) => {
    setCartItems((prev) =>
      prev.map((item) =>
        matchesCartItem(item, value, shippingMethod)
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, Math.max(Number(item.stock) || 0, 1)),
            }
          : item
      )
    );
  };

  const decreaseQuantity = (value, shippingMethod) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          matchesCartItem(item, value, shippingMethod) ? { ...item, quantity: item.quantity - 1 } : item
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