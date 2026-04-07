import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Image } from "./Image";
import { Icon } from "./Icon";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContextTemp";
import { useCartButton } from "../context/CartButtonContext";
import { useWishlist } from "../context/WishlistContext";
import { RatingStars } from "./RatingStars";
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
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { visibleProductId, showCartForProduct, hideCart } = useCartButton();
  const cardRef = useRef(null);

  const [showButton, setShowButton] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const isWishlisted = isInWishlist(product.id);

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

    if ((Number(product.stock) || 0) <= 0) {
      return;
    }

    isInCart ? removeFromCart(product.id) : addToCart(product);
    showCartForProduct(product.id);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isCardActive = visibleProductId === product.id;

  const handleCardActivation = (e) => {
    if (!isTouchDevice || e.target.closest("button")) {
      return;
    }

    if (!isCardActive) {
      e.preventDefault();
      e.stopPropagation();
      showCartForProduct(product.id);
    }
  };

  const isCartVisible = showButton || isCardActive;

  const effectivePrice = getEffectiveProductPrice(product);
  const originalPrice = getOriginalProductPrice(product);
  const hasDiscount = hasActiveProductDiscount(product);
  const discountPercent = getProductDiscountPercent(product);
  const price = formatCurrency(convertPrice(effectivePrice, userCurrency), userCurrency);
  const originalPriceLabel = formatCurrency(convertPrice(originalPrice, userCurrency), userCurrency);
  const averageRating = Number(product.averageRating || 0);
  const reviewCount = Number(product.reviewCount || 0);
  const hasReviews = reviewCount > 0;
  const promoSlides = [];

  if (hasDiscount) {
    promoSlides.push({
      id: "discount",
      content: (
        <div className="flex h-full flex-col justify-center text-left">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-600">
            Discount price
          </span>
          <div className="mt-0.5 flex items-center gap-2 text-xs leading-none">
            <span className="text-slate-400 line-through">{originalPriceLabel}</span>
            <span className="font-semibold text-red-600">Save {discountPercent}%</span>
          </div>
        </div>
      ),
    });
  }

  if (hasReviews) {
    promoSlides.push({
      id: "reviews",
      content: (
        <div className="flex h-full flex-col justify-center text-left">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Customer reviews
          </span>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <RatingStars
              rating={averageRating}
              reviewCount={reviewCount}
              showCount
              sizeClass="h-3.5 w-3.5"
              textClass="text-[11px] text-slate-500"
            />
            <span className="text-[11px] font-semibold text-emerald-700">
              {averageRating.toFixed(1)}/5
            </span>
          </div>
        </div>
      ),
    });
  }

  if (hasDiscount && hasReviews) {
    promoSlides.push({
      id: "combined",
      content: (
        <div className="flex h-full flex-col justify-center text-left">
          <div className="flex items-center gap-2 text-xs leading-none">
            <span className="text-slate-400 line-through">{originalPriceLabel}</span>
            <span className="font-semibold text-red-600">Save {discountPercent}%</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <RatingStars
              rating={averageRating}
              reviewCount={reviewCount}
              showCount
              sizeClass="h-3.5 w-3.5"
              textClass="text-[11px] text-slate-500"
            />
            <span className="text-[11px] font-semibold text-emerald-700">
              {averageRating.toFixed(1)}/5
            </span>
          </div>
        </div>
      ),
    });
  }

  useEffect(() => {
    if (promoSlides.length <= 1) {
      setActivePromoIndex(0);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActivePromoIndex((currentIndex) => (currentIndex + 1) % promoSlides.length);
    }, 3600);

    return () => window.clearInterval(intervalId);
  }, [promoSlides.length]);

  return (
    <div
      ref={cardRef}
      className={[
        "relative h-full overflow-hidden border border-gray-200 bg-white group mt-0 first:mt-0",
        "flex flex-col transform-gpu transition-all duration-300 ease-out",
        isCardActive
          ? "z-10 scale-[1.03] -translate-y-1 border-emerald-300 shadow-[0_20px_45px_-18px_rgba(15,23,42,0.35)]"
          : "scale-100 translate-y-0 shadow-sm",
      ].join(" ")}
      onMouseEnter={() => !isTouchDevice && setShowButton(true)}
      onMouseLeave={() => !isTouchDevice && setShowButton(false)}
    >
      <Link
        to={`/product/${product.id}`}
        className="relative flex h-full flex-col"
        onClick={handleCardActivation}
      >
        <div className="flex w-full aspect-[2/3] items-center justify-center bg-slate-50 overflow-hidden relative p-3">
          <Image
            preset="card"
            variant="contain"
            className={[
              "h-full w-full object-contain transition-transform duration-300",
              isCardActive ? "scale-110" : "group-hover:scale-105",
            ].join(" ")}
            src={product.image}
            alt={product.name}
          />

          {/* Cart Button */}
          <button
            onClick={handleCartToggle}
            disabled={(Number(product.stock) || 0) <= 0 && !isInCart}
            className={`absolute bottom-3 right-3 p-3 rounded-full shadow-md transform hover:scale-110 transition-all duration-300 
              ${isCartVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              ${isInCart ? "bg-green-600 text-white animate-pulse" : "bg-white text-slate-700 hover:bg-green-100"}
              ${((Number(product.stock) || 0) <= 0 && !isInCart) ? "cursor-not-allowed opacity-100 !translate-y-0 bg-slate-200 text-slate-400 hover:bg-slate-200" : ""}
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

      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-pressed={isWishlisted}
        className={`absolute top-2 right-2 rounded-full p-1.5 transition-all ${isWishlisted ? "bg-red-50 text-red-500 opacity-100" : "bg-white text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-500"}`}
      >
        <Icon className="h-5 w-5" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"}>
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Icon>
      </button>

      <div className="relative flex flex-1 flex-col px-2 py-2">
        <h3 className="text-sm text-slate-700 font-medium line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1">Brand: {product.brand}</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{price}</p>
        {promoSlides.length > 0 && (
          <div className="mt-1.5 h-[2.9rem] overflow-hidden">
            <div
              className="transition-transform duration-1000 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateY(-${activePromoIndex * 2.9}rem)` }}
            >
              {promoSlides.map((slide) => (
                <div key={slide.id} className="h-[2.9rem]" aria-hidden={slide.id !== promoSlides[activePromoIndex]?.id}>
                  {slide.content}
                </div>
              ))}
            </div>
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
      </Link>

      {isTouchDevice && isCardActive && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-full bg-slate-950/80 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
          Tap To View product
        </div>
      )}
    </div>
  );
};