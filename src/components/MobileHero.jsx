import React, { useEffect, useRef, useState } from "react";
import { Link } from "./Link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { getHeroSlides } from "../service/HeroService";
import "swiper/css";

export const MobileHero = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadSlides = async () => {
      const heroSlides = await getHeroSlides();
      if (mounted) {
        setSlides(heroSlides);
      }
    };

    loadSlides();

    return () => {
      mounted = false;
    };
  }, []);

  if (!slides.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_36%,#f7fee7_100%)] pt-3 md:pt-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.16),_rgba(255,255,255,0)_58%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4400, disableOnInteraction: false }}
            loop
            speed={900}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className={`relative overflow-hidden bg-gradient-to-br ${slide.surface}`}>
                  <div className="absolute inset-0 opacity-60">
                    <div className={`absolute -left-10 top-0 h-36 w-36 rounded-full bg-gradient-to-br ${slide.accent} blur-3xl`} />
                    <div className="absolute right-0 top-8 h-32 w-32 rounded-full bg-white/70 blur-2xl" />
                    <div className="absolute inset-y-0 left-[56%] hidden w-px bg-white/55 lg:block" />
                  </div>

                  <div className="relative grid grid-cols-1 gap-4 min-[0px]:min-h-0 lg:min-h-[430px] lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-0">
                    <div className="relative z-20 flex min-w-0 flex-col justify-between px-5 pb-0 pt-6 sm:px-7 sm:pt-7 lg:px-8 lg:pb-8 lg:pt-8">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-slate-950 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                          <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${slide.accent}`} />
                          {slide.eyebrow}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 lg:hidden">
                          <span className="border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 shadow-sm">
                            {slide.badge}
                          </span>
                          <span className="border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
                            {activeIndex + 1} / {slides.length}
                          </span>
                        </div>

                        <motion.h1
                          initial={{ opacity: 0, y: 22 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: 0.05 }}
                          className="mt-4 max-w-xl text-[1.7rem] font-black leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-[2.1rem] lg:text-[3rem]"
                        >
                          {slide.title} <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}>{slide.highlight}</span>
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.42, delay: 0.12 }}
                          className="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7"
                        >
                          {slide.desc}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.42, delay: 0.18 }}
                          className="mt-5 flex flex-wrap gap-2"
                        >
                          {slide.metrics.map((metric) => (
                            <span key={metric} className="border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700 shadow-sm">
                              {metric}
                            </span>
                          ))}
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.46, delay: 0.22 }}
                        className="mt-6 flex flex-wrap items-center gap-3 pb-2 lg:pb-0"
                      >
                        <Link href={slide.primaryLink} className={`bg-gradient-to-r ${slide.accent} px-5 py-3 text-sm font-bold text-white shadow-[0_16px_28px_rgba(15,23,42,0.12)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`}>
                          {slide.primaryText}
                        </Link>
                        <Link href={slide.secondaryLink} className="border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950">
                          {slide.secondaryText}
                        </Link>
                      </motion.div>
                    </div>

                    <div className="relative z-10 flex items-center justify-center overflow-hidden px-4 pb-5 pt-0 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
                      <motion.div
                        initial={{ opacity: 0, x: 32, scale: 0.94 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.52, delay: 0.16 }}
                        className="relative flex h-[180px] w-full max-w-[300px] items-center justify-center border border-white/60 bg-white/75 shadow-[0_20px_36px_rgba(15,23,42,0.1)] backdrop-blur-sm sm:h-[220px] sm:max-w-[340px] lg:h-[300px] lg:max-w-[360px]"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.78),rgba(255,255,255,0.24))]" />
                        {slide.mediaType === "video" ? (
                          <video
                            src={slide.mediaUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="relative z-10 h-full w-full object-contain p-3"
                          />
                        ) : (
                          <img
                            src={slide.mediaUrl}
                            alt={slide.highlight}
                            className={`relative z-10 h-full w-full ${slide.imageFit || "object-cover"} p-3`}
                          />
                        )}

                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-3 top-3 hidden border border-white/70 bg-white/92 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 shadow-lg lg:block"
                        >
                          {slide.badge}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.38, delay: 0.24 }}
                          className="absolute bottom-3 right-3 hidden border border-slate-200 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-lg lg:block"
                        >
                          {activeIndex + 1} / {slides.length}
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.highlight}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    swiperRef.current?.slideToLoop(index);
                  }}
                  aria-label={`Go to hero slide ${index + 1}`}
                  className={`h-1.5 transition-all ${activeIndex === index ? "w-8 bg-green-600" : "w-3 bg-slate-200"}`}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Curated for marketplace speed</p>
          </div>
        </div>
      </div>
    </section>
  );
};