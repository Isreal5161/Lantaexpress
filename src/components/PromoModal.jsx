import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const PromoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(3600);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Confetti auto-stop after 4s
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Countdown
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const products = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      price: "$25.99",
      rating: "4.5",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      price: "$85.00",
      rating: "4.7",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      price: "$52.00",
      rating: "4.3",
    },
  ];

  const handleRedirect = () => {
    onClose(); // close modal first
    navigate("/shop"); // smooth client-side navigation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={120}
              gravity={0.3}
            />
          )}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.6, y: -120 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 12,
            }}
            className="bg-white w-[75%] max-w-[230px] shadow-2xl relative overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-1 right-2 text-gray-500 text-sm"
            >
              ✕
            </button>

            {/* Auto Sliding Products */}
            <div className="bg-gray-100 p-2 overflow-hidden">
              <motion.div
                className="flex gap-2"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "linear",
                }}
              >
                {[...products, ...products].map((product, index) => (
                  <div
                    key={index}
                    className="min-w-[70px] bg-white  p-1 text-center shadow-sm"
                  >
                    <img
                      src={product.img}
                      alt="product"
                      className="w-14 h-14 object-cover mx-auto"
                    />
                    <p className="text-[10px] font-semibold mt-1">
                      {product.price}
                    </p>
                    <p className="text-[9px] text-yellow-500">
                      ⭐ {product.rating}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Header */}
            <div className="bg-green-600 text-white p-2 text-center">
              <h2 className="text-sm font-bold">Hot Flash Deals 🔥</h2>
              <p className="text-[10px] mt-1">Earn & Buy FREE</p>
            </div>

            {/* Body */}
            <div className="p-2 text-center">
              <div className="bg-black text-white py-1 mb-2 text-[10px] font-semibold">
                Ends In:
                <div className="text-xs">{formatTime(timeLeft)}</div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleRedirect}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0px 0px 0px rgba(34,197,94,0.4)",
                    "0px 0px 12px rgba(34,197,94,0.8)",
                    "0px 0px 0px rgba(34,197,94,0.4)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="bg-green-600 text-white w-full py-1.5 text-xs font-semibold"
              >
                Shop Now
              </motion.button>

              <p className="text-[9px] text-gray-500 mt-1">
                Limited time 🚀
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;