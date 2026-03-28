import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PromoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600);

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

  const products = [
    { id: 1, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", price: "$25.99", rating: "4.5" },
    { id: 2, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", price: "$85.00", rating: "4.7" },
    { id: 3, img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", price: "$52.00", rating: "4.3" },
  ];

  const handleRedirect = () => {
    onClose();
    navigate("/shop");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
          >
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

            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-lg font-semibold text-slate-600 shadow-sm transition hover:scale-105 hover:text-slate-900"
              aria-label="Close promotional modal"
            >
              ×
            </button>

            <div className="relative border-b border-emerald-100 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)] px-6 pb-5 pt-6">
              <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Flash picks
              </span>
              <h2 className="mt-4 max-w-xs text-2xl font-bold leading-tight text-slate-900">
                Fast deals without the heavy popout.
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Jump into today&apos;s best-value products before the timer runs out.
              </p>
            </div>

            <div className="relative px-6 py-5">
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  Offer closes in
                </p>
                <div className="mt-2 text-3xl font-bold tracking-[0.2em]">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                    <img src={product.img} alt="Featured product" className="h-20 w-full rounded-xl object-cover" />
                    <p className="mt-2 text-xs font-semibold text-slate-900">{product.price}</p>
                    <p className="text-[11px] text-amber-500">★ {product.rating}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <motion.button
                  onClick={handleRedirect}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25"
                >
                  See deals
                </motion.button>
                <button
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Not now
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                This promo now opens once per visit to keep the shop page lighter.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;