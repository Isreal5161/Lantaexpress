import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const PromoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Keep confetti short and limited to reduce performance impact on mobile
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
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
          className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {showConfetti && windowSize.width >= 640 && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={40}
              gravity={0.22}
              recycle={false}
              run={showConfetti}
            />
          )}

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.6, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 12 }}
            className="relative w-[80%] max-w-[260px] bg-white rounded-2xl shadow-2xl overflow-visible pb-12"
          >
            {/* Sliding Products */}
            <div className="bg-gray-100 p-1 overflow-hidden rounded-t-2xl">
              <motion.div
                className="flex gap-1"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              >
                {[...products, ...products].map((product, index) => (
                  <div key={index} className="min-w-[60px] bg-white p-1 text-center shadow-sm rounded-lg">
                    <img src={product.img} alt="product" className="w-12 h-12 object-cover mx-auto rounded-md" />
                    <p className="text-[9px] font-semibold mt-1">{product.price}</p>
                    <p className="text-[8px] text-yellow-500">⭐ {product.rating}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Header */}
            <div className="bg-green-600 text-white p-2 text-center rounded-b-xl">
              <h2 className="text-sm font-bold">Hot Flash Deals 🔥</h2>
              <p className="text-[9px] mt-1">Earn & Buy FREE</p>
            </div>

            {/* Body */}
            <div className="p-2 text-center">
              <div className="bg-black text-white py-1 mb-2 text-[9px] font-semibold rounded">
                Ends In: <div className="text-xs">{formatTime(timeLeft)}</div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleRedirect}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white w-full py-1.5 text-xs font-semibold rounded-lg"
              >
                Shop Now
              </motion.button>

              <p className="text-[8px] text-gray-500 mt-1">Limited time 🚀</p>
            </div>
          </motion.div>

          {/* Close Button OUTSIDE the Modal with Bounce Animation */}
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            className="mt-3 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-lg font-bold border"
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;