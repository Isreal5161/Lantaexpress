import React, { createContext, useContext, useEffect, useState } from "react";
import { getScopedStorageKey, migrateLegacyStorageKey } from "../utils/userScopedStorage";

const WishlistContext = createContext();
const WISHLIST_STORAGE_KEY = "lantaxpress_wishlist";

const getProductId = (product) => product?.id || product?._id || product?.productId || null;

const normalizeWishlistItem = (product = {}) => {
  const id = getProductId(product);

  if (!id) {
    return null;
  }

  return {
    ...product,
    id,
    image: product.image || product.images?.[0] || "",
    addedAt: product.addedAt || new Date().toISOString(),
  };
};

const loadStoredWishlist = (storageKey = getScopedStorageKey(WISHLIST_STORAGE_KEY)) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    migrateLegacyStorageKey(WISHLIST_STORAGE_KEY, storageKey);
    const storedWishlist = JSON.parse(window.localStorage.getItem(storageKey) || "[]");

    if (!Array.isArray(storedWishlist)) {
      return [];
    }

    return storedWishlist.map(normalizeWishlistItem).filter(Boolean);
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [storageKey, setStorageKey] = useState(() => getScopedStorageKey(WISHLIST_STORAGE_KEY));
  const [wishlistItems, setWishlistItems] = useState(() => loadStoredWishlist(getScopedStorageKey(WISHLIST_STORAGE_KEY)));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncWishlistFromStorage = () => {
      const nextStorageKey = getScopedStorageKey(WISHLIST_STORAGE_KEY);
      setStorageKey(nextStorageKey);
      setWishlistItems(loadStoredWishlist(nextStorageKey));
    };

    window.addEventListener("storage", syncWishlistFromStorage);
    window.addEventListener("auth-state-changed", syncWishlistFromStorage);

    return () => {
      window.removeEventListener("storage", syncWishlistFromStorage);
      window.removeEventListener("auth-state-changed", syncWishlistFromStorage);
    };
  }, []);

  const addToWishlist = (product) => {
    const normalizedProduct = normalizeWishlistItem(product);

    if (!normalizedProduct) {
      return;
    }

    setWishlistItems((prev) => {
      if (prev.some((item) => String(item.id) === String(normalizedProduct.id))) {
        return prev;
      }

      return [normalizedProduct, ...prev];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  const toggleWishlist = (product) => {
    const id = getProductId(product);
    if (!id) {
      return false;
    }

    const exists = wishlistItems.some((item) => String(item.id) === String(id));

    if (exists) {
      removeFromWishlist(id);
      return false;
    }

    addToWishlist(product);
    return true;
  };

  const isInWishlist = (productId) => wishlistItems.some((item) => String(item.id) === String(productId));
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
