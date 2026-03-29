import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const fallbackProducts = [
  { id: 1, name: "Runner", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", price: 25999, rating: "4.5" },
  { id: 2, name: "Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", price: 85000, rating: "4.7" },
];

const conversionRates = { NGN: 1, USD: 0.0026 };

const nigeriaStates = new Set([
  "abia", "adamawa", "akwa ibom", "anambra", "bauchi", "bayelsa", "benue", "borno",
  "cross river", "delta", "ebonyi", "edo", "ekiti", "enugu", "fct", "gombe", "imo",
  "jigawa", "kaduna", "kano", "katsina", "kebbi", "kogi", "kwara", "lagos", "nasarawa",
  "niger", "ogun", "ondo", "osun", "oyo", "plateau", "rivers", "sokoto", "taraba",
  "yobe", "zamfara",
]);

const getCurrencyFromUserContext = () => {
  if (typeof window === "undefined") return "NGN";

  const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("user");

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      const explicitCurrency = parsedUser?.currency;
      const country = parsedUser?.country;
      const state = parsedUser?.state;

      if (typeof explicitCurrency === "string" && explicitCurrency.trim()) {
        return explicitCurrency.trim().toUpperCase() === "NGN" ? "NGN" : "USD";
      }

      if (typeof country === "string" && country.trim()) {
        const normalizedCountry = country.trim().toLowerCase();
        if (normalizedCountry === "nigeria") return "NGN";
        return "USD";
      }

      if (typeof state === "string" && state.trim()) {
        const normalizedState = state.trim().toLowerCase();
        if (nigeriaStates.has(normalizedState)) {
          return "NGN";
        }
      }
    } catch {
      return "NGN";
    }
  }

  const locale = navigator.language || "en-NG";
  const countryCode = locale.split("-")[1]?.toUpperCase();
  return countryCode === "NG" ? "NGN" : "USD";
};

const convertPrice = (amount, targetCurrency = "NGN") => {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return 0;
  return numericAmount * (conversionRates[targetCurrency] || 1);
};

const formatPrice = (price, currency = "NGN") => {
  const amount = Number(price);
  if (Number.isNaN(amount)) return "₦0";

  const locale = currency === "NGN" ? "en-NG" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount);
};

const PromoModal = ({ isOpen, onClose, products = [] }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600);
  const userCurrency = useMemo(() => getCurrencyFromUserContext(), [isOpen]);
  const promoProducts = useMemo(() => {
    if (products.length > 0) {
      return products.slice(0, 2).map((product, index) => ({
        id: product.id || index,
        name: product.name || "Featured item",
        image: product.image || "/placeholder.png",
        price: product.price,
        rating: "4.8",
      }));
    }

    return fallbackProducts;
  }, [products]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(3600);
      return undefined;
    }

    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleRedirect = () => {
    onClose();
    navigate("/shop");
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10020] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="my-auto w-full max-w-[300px] sm:max-w-[720px]"
          >
            <div className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:rounded-[28px]">
              <motion.div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/70 blur-3xl"
                animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-amber-200/70 blur-3xl"
                animate={{ scale: [1.04, 0.94, 1.04], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative grid gap-0 sm:grid-cols-[1.08fr_0.92fr]">
                <div className="border-b border-emerald-100 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)] px-4 py-4 sm:border-b-0 sm:border-r sm:px-6 sm:py-5 md:px-7 md:py-6">
                  <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:text-xs">
                    Flash picks
                  </span>
                  <h2 className="mt-2 max-w-sm text-lg font-bold leading-tight text-slate-900 sm:mt-3 sm:text-2xl">
                    Quick deals curated for every screen.
                  </h2>
                  <p className="mt-2 max-w-md text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                    Top picks. Better prices. Limited stock.
                  </p>

                  <div className="mt-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg sm:mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200 sm:text-[11px]">
                      Offer closes in
                    </p>
                    <div className="mt-1 text-xl font-bold tracking-[0.14em] sm:text-[2rem] sm:tracking-[0.16em]">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:gap-3">
                    <motion.button
                      onClick={handleRedirect}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 sm:py-3"
                    >
                      See deals
                    </motion.button>
                    <button
                      onClick={onClose}
                      className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:py-3"
                    >
                      Not now
                    </button>
                  </div>
                </div>

                <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-6 md:py-6">
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {promoProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm"
                      >
                        <img src={product.image} alt={product.name} className="h-14 w-full rounded-xl object-cover sm:h-20" />
                        <p className="mt-2 truncate text-[11px] font-semibold text-slate-900 sm:text-xs">{product.name}</p>
                        <p className="text-[11px] font-semibold text-slate-700">{formatPrice(convertPrice(product.price, userCurrency), userCurrency)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-500 sm:mt-4 sm:text-xs">
                    Fresh picks, ready to shop.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2.5 sm:pt-3">
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-600 shadow-lg transition hover:scale-105 hover:text-slate-900 sm:h-11 sm:w-11 sm:text-xl"
                aria-label="Close promotional modal"
              >
                ×
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PromoModal;