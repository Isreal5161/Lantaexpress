import React, { useState, useEffect } from "react";
import { Link } from "./Link";
import { motion, AnimatePresence } from "framer-motion";

const PromotionalBanner = ({
  mode = "image",
  images = ["/banner1.jpg"],
  interval = 4500,
  link = "/promotions",
  heightClasses = "h-40 sm:h-44 md:h-52",

  // text mode
  headline = "Exclusive Deals",
  subheadline = "Tap to see today's offers",
  ctaText = "Shop now",
  bgGradient = "bg-gradient-to-r from-yellow-400 to-yellow-500",
  textColor = "text-slate-900",

  // flyer
  flyerImage = null,
  flyerAlt = "Promotional flyer",

  // slides
  slides = null,
  slideInterval = 4000,
}) => {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(0);

  // IMAGE MODE ROTATION
  useEffect(() => {
    if (mode === "image") {
      if (!images || images.length <= 1) return;

      const t = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, interval);

      return () => clearInterval(t);
    }
  }, [images, interval, mode]);

  // TEXT MODE ROTATION
  useEffect(() => {
    if (mode !== "text") return;

    const s = slides && slides.length > 0 ? slides : null;
    if (!s || s.length <= 1) return;

    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % s.length);
    }, slideInterval);

    return () => clearInterval(t);
  }, [mode, slides, slideInterval]);

  // ================= TEXT MODE =================
  if (mode === "text") {
    const s =
      slides && slides.length > 0
        ? slides
        : [{ headline, subheadline, ctaText, flyerImage, bgGradient, textColor }];

    return (
      <Link href={link} className="block">
        <div className={`w-full relative overflow-hidden ${heightClasses} ${bgGradient}`}>

          {/* background blur shapes */}
          <div className="absolute -left-10 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -right-14 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="absolute inset-0 flex items-center px-4 sm:px-8"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >

                {/* TEXT */}
                <div className="flex-1 pr-24 sm:pr-40 md:pr-56">
                  <h3 className={`text-base sm:text-2xl font-bold ${s[current].textColor || textColor}`}>
                    {s[current].headline}
                  </h3>

                  {s[current].subheadline && (
                    <p className="text-xs sm:text-sm mt-1 text-white/90">
                      {s[current].subheadline}
                    </p>
                  )}
                </div>

                {/* ✅ MOBILE + DESKTOP IMAGE FIXED */}
                {s[current].flyerImage && (
                  <motion.div
                    className="absolute right-0 bottom-0 w-24 sm:w-40 md:w-56 h-full opacity-95"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={s[current].flyerImage}
                      alt={s[current].flyerAlt || flyerAlt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* CTA */}
                <div className="absolute left-4 bottom-3">
                  <span className="bg-white text-green-700 px-3 py-1 text-xs sm:text-sm font-semibold shadow-sm">
                    {s[current].ctaText || ctaText}
                  </span>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Link>
    );
  }

  // ================= IMAGE MODE =================
  return (
    <Link href={link} className="block">
      <div className={`w-full relative overflow-hidden ${heightClasses}`}>

        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`promo-${i}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20" />

        {/* text */}
        <div className="absolute left-3 bottom-3 text-white z-30">
          <h3 className="text-sm sm:text-base font-semibold">{headline}</h3>
          <p className="text-xs opacity-90">{subheadline}</p>
        </div>

        {/* CTA */}
        <div className="absolute right-3 bottom-3 z-30">
          <span className="bg-green-600 text-white px-3 py-1 text-xs">
            {ctaText}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PromotionalBanner;