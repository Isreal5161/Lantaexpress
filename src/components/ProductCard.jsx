import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Image } from "./Image";
import { Icon } from "./Icon";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContextTemp";
import { useCartButton } from "../context/CartButtonContext";
import {
  getEffectiveProductPrice,
  getOriginalProductPrice,
  getProductDiscountPercent,
  hasActiveProductDiscount,
} from "../utils/productPricing";

// Helper for formatting currency dynamically
const formatCurrency = (amount, currency = "NGN") => {
  const currencySymbols = { NGN: "₦", USD: "$", EUR: "€" };
  return `${currencySymbols[currency] || currency} ${amount.toLocaleString()}`;
};

// Optional: simple conversion rates
const convertPrice = (amount, targetCurrency = "NGN") => {
  const rates = { NGN: 1, USD: 0.0026, EUR: 0.0023 };
  return amount * (rates[targetCurrency] || 1);
};

export const ProductCard = ({ product, userCurrency = "NGN" }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { visibleProductId, showCartForProduct, hideCart } = useCartButton();
  const cardRef = useRef(null);

  const [showButton, setShowButton] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isTouchDevice = useRef(
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  ).current;

  useEffect(() => {
    setIsInCart(cartItems.some((item) => item.id === product.id));
  }, [cartItems, product.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(event.target)) hideCart();
    };
    if (visibleProductId === product.id)
      document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [visibleProductId, product.id, hideCart]);

  const handleCartToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isInCart ? removeFromCart(product.id) : addToCart(product);
    showCartForProduct(product.id);
  };

  const handleMobileTap = (e) => {
    if (isTouchDevice) {
      if (e.target.closest("button")) return;
      e.stopPropagation();
      showCartForProduct(product.id);
    }
  };

  const isCartVisible = showButton || visibleProductId === product.id;

  const effectivePrice = getEffectiveProductPrice(product);
  const originalPrice = getOriginalProductPrice(product);
  const hasDiscount = hasActiveProductDiscount(product);
  const discountPercent = getProductDiscountPercent(product);
  const price = formatCurrency(convertPrice(effectivePrice, userCurrency), userCurrency);
  const originalPriceLabel = formatCurrency(convertPrice(originalPrice, userCurrency), userCurrency);

  return (
    <div
      ref={cardRef}
      className="relative border border-gray-200 bg-white overflow-hidden group flex flex-col mt-0 first:mt-0"
      onMouseEnter={() => !isTouchDevice && setShowButton(true)}
      onMouseLeave={() => !isTouchDevice && setShowButton(false)}
      onClick={handleMobileTap}
    >
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden relative">
          <Image
            variant="cover"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={product.image}
            alt={product.name}
          />

          {/* Cart Button */}
          <button
            onClick={handleCartToggle}
            className={`absolute bottom-3 right-3 p-3 rounded-full shadow-md transform hover:scale-110 transition-all duration-300 
              ${isCartVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              ${isInCart ? "bg-green-600 text-white animate-pulse" : "bg-white text-slate-700 hover:bg-green-100"}
            `}
          >
            <ShoppingCart size={18} />
          </button>

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount && (
              <div className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                -{discountPercent}%
              </div>
            )}
            {product.status === "pending" && (
              <div className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-slate-900">
                Pending
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
        <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Icon>
      </div>

      <div className="px-2 py-2 relative">
        <h3 className="text-sm text-slate-700 font-medium line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1">Brand: {product.brand}</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{price}</p>
        {hasDiscount && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-slate-400 line-through">{originalPriceLabel}</span>
            <span className="font-medium text-red-600">Save {discountPercent}%</span>
          </div>
        )}
        <p className={`text-xs mt-1 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </p>

        {product.stock > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
            />
          </div>
        )}

        {product.description && (
          <p
            className="mt-1 text-xs text-slate-500 line-clamp-1 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {product.description}
          </p>
        )}

        {showTooltip && product.description && (
          <div className="absolute z-10 left-0 top-full mt-1 w-full bg-white border border-gray-200 p-2 text-xs text-slate-700 shadow-lg rounded-md">
            {product.description}
          </div>
        )}
      </div>
    </div>
  );
};