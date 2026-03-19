import React, { useState, useEffect } from "react";
import { Link } from "./Link";
import { motion, AnimatePresence } from "framer-motion";

const PromotionalBanner = ({
  mode = "image", // 'image' or 'text'
  images = ["/banner1.jpg"],
  interval = 4500,
  link = "/promotions",
  heightClasses = "h-36 sm:h-40 md:h-44",
  // text mode props
  headline = "Exclusive Deals",
  subheadline = "Tap to see today's offers",
  ctaText = "Shop now",
  bgGradient = "bg-gradient-to-r from-yellow-400 to-yellow-500",
  textColor = "text-slate-900",
  // optional flyer image
  flyerImage = null,
  flyerAlt = "Promotional flyer",
  flyerWidthClasses = "w-36 sm:w-44 md:w-56",
  // slides: array of { headline, subheadline, ctaText, flyerImage, bgGradient, textColor }
  slides = null,
  slideInterval = 4000,
}) => {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (mode === "image") {
      if (!images || images.length <= 1) return;
      const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
      return () => clearInterval(t);
    }
    return undefined;
  }, [images, interval, mode]);

  // slide rotator for text mode
  useEffect(() => {
    if (mode !== "text") return undefined;
    const s = slides && slides.length > 0 ? slides : null;
    if (!s || s.length <= 1) return undefined;
    const t = setInterval(() => setCurrent((c) => (c + 1) % s.length), slideInterval);
    return () => clearInterval(t);
  }, [mode, slides, slideInterval]);

  if (mode === "text") {
    const s = slides && slides.length > 0 ? slides : [{ headline, subheadline, ctaText, flyerImage, bgGradient, textColor }];

    return (
      <Link href={link} className="block">
        <div className={`w-full relative overflow-hidden ${heightClasses} ${bgGradient}`}>
          {/* decorative shapes */}
          <div className="absolute -left-10 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -right-14 -bottom-8 w-32 h-32 bg-white/8 rounded-full blur-2xl" />

          <div className="relative z-10 h-full">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={current}
                className="absolute inset-0 flex items-center justify-between px-4 sm:px-8"
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -120, opacity: 0 }}
                transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex-1 pr-4">
                  <motion.h3
                    className={`text-lg sm:text-2xl md:text-3xl font-extrabold ${s[current].textColor || textColor}`}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ textShadow: "0 6px 18px rgba(0,0,0,0.12)" }}
                  >
                    {s[current].headline}
                  </motion.h3>

                  {s[current].subheadline && (
                    <motion.p
                      className="text-xs sm:text-sm opacity-95 mt-1 text-white/95 max-w-lg"
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.12, duration: 0.45 }}
                    >
                      {s[current].subheadline}
                    </motion.p>
                  )}
                </div>

                {/* flyer image - hidden on very small screens */}
                {s[current].flyerImage && (
                  <motion.div className={`hidden sm:block ${s[current].flyerWidthClasses || flyerWidthClasses} h-full flex-shrink-0 ml-4`} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                    <img src={s[current].flyerImage} alt={s[current].flyerAlt || flyerAlt} className="w-full h-full object-cover rounded-none shadow-md" />
                  </motion.div>
                )}

                <motion.div className="absolute right-4 bottom-3" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.6 }}>
                  <motion.span className="inline-block bg-white text-green-700 px-4 py-2 text-sm sm:text-base rounded-none font-semibold shadow-sm cursor-pointer" whileHover={{ scale: 1.05 }} animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.6, delay: 0.9 }}>{s[current].ctaText || ctaText}</motion.span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={link} className="block">
      <div className={`w-full relative overflow-hidden bg-gray-100 ${heightClasses}`}>
        {images.map((src, i) => (
          <motion.img
            key={`${src}-${i}`}
            src={src}
            alt={`promo-${i}`}
            className="w-full h-full object-contain object-center absolute inset-0 bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute" }}
          />
        ))}

        {/* subtle gradient overlay + small CTA (sharp corners) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        <div className="absolute left-4 bottom-3 text-white pointer-events-none">
          <h3 className="text-sm sm:text-base font-semibold">Exclusive Deals</h3>
          <p className="text-xs opacity-90">Tap to see today's offers</p>
        </div>
        <div className="absolute right-3 bottom-3">
          <span className="inline-block bg-green-600 text-white px-3 py-1 text-xs rounded-none">Shop now</span>
        </div>
      </div>
    </Link>
  );
};

export default PromotionalBanner;
