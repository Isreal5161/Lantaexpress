import React, { useRef } from "react";
import { Link } from "./Link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

export const MobileHero = () => {
  const textSwiperRef = useRef(null);
  const imageSwiperRef = useRef(null);

  const slides = [
    {
      title: "Your Marketplace, ",
      highlight: "Your Way",
      desc: "Connect with buyers, sell with ease, and let Lanta Express handle logistics.",
      btnText: "Shop Collection",
      btnLink: "/shop",
      btnStyle: "bg-green-600 text-white",
      image: "/BANNER4.jpg",
      promoImg:
        "https://images.unsplash.com/photo-1606813908004-7f75f8d14d0b?auto=format&fit=crop&w=200&q=80",
    },
    {
      title: "Fast Delivery, ",
      highlight: "All State",
      desc: "Reliable logistics from pickup to doorstep.",
      btnText: "Track Your Order",
      btnLink: "/track",
      btnStyle: "bg-green-100 text-green-700",
      image: "/banner5.jpg",
      promoImg:
        "https://images.unsplash.com/photo-1567427018141-0584cfcbf1e6?auto=format&fit=crop&w=200&q=80",
    },
    {
      title: "Shop Smart, ",
      highlight: "Live Better",
      desc: "Discover trending products at unbeatable prices.",
      btnText: "Shop Now",
      btnLink: "/shop",
      btnStyle: "bg-green-600 text-white",
      image: "/lantaexpressimage1.jpg",
      promoImg:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
    },
    {
      title: "Buy and Earn ",
      highlight: "LantaCoin",
      desc: "Shop on Lanta Express and earn LantaCoin rewards with every purchase!",
      btnText: "Start Earning",
      btnLink: "/earn",
      btnStyle: "bg-green-600 text-white",
      image: "/LantaCoin.png",
      coinImg: "/LantaCoin.png",
    },
  ];

  // Animations
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  const highlightAnim = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200 },
    },
  };

  return (
    <section className="relative bg-white pt-3 md:pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* IMAGE SLIDER */}
          <div className="h-[220px] sm:h-[260px] md:h-[340px]">
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => (imageSwiperRef.current = swiper)}
              onRealIndexChange={(swiper) => {
                if (
                  textSwiperRef.current &&
                  textSwiperRef.current.realIndex !== swiper.realIndex
                ) {
                  textSwiperRef.current.slideToLoop(swiper.realIndex);
                }
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              speed={800}
              allowTouchMove={false}
              className="h-full overflow-hidden"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt=""
                      className="w-full h-full object-contain md:object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* TEXT SLIDER */}
          <div className="h-[240px] sm:h-[280px] md:h-[340px]">
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => (textSwiperRef.current = swiper)}
              onRealIndexChange={(swiper) => {
                if (
                  imageSwiperRef.current &&
                  imageSwiperRef.current.realIndex !== swiper.realIndex
                ) {
                  imageSwiperRef.current.slideToLoop(swiper.realIndex);
                }
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              speed={800}
              allowTouchMove={false}
              className="h-full"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full flex flex-col justify-center gap-4 px-5 bg-white shadow-xl relative overflow-hidden"
                  >

                    {/* Floating Promo */}
                    {slide.promoImg && !slide.coinImg && (
                      <motion.img
                        src={slide.promoImg}
                        alt=""
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-4 right-4 w-16 h-16 rounded-full object-cover shadow-lg"
                      />
                    )}

                    {/* Rotating Coin */}
                    {slide.coinImg && (
                      <motion.img
                        src={slide.coinImg}
                        alt=""
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 6,
                          ease: "linear",
                        }}
                        className="absolute top-4 right-4 w-14 h-14 object-contain"
                      />
                    )}

                    {/* TEXT */}
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-3"
                    >
                      <motion.h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                        <motion.span variants={item}>
                          {slide.title}
                        </motion.span>

                        <motion.span
                          variants={highlightAnim}
                          className="inline-block ml-1 bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent"
                        >
                          {slide.highlight}
                        </motion.span>
                      </motion.h1>

                      <motion.p
                        variants={item}
                        className="text-sm md:text-base text-slate-500"
                      >
                        {slide.desc}
                      </motion.p>

                      {/* 🔥 PREMIUM BUTTON */}
                      <motion.div variants={item}>
                        <motion.div
                          initial={{ scale: 0.8, y: 20, opacity: 0 }}
                          animate={{
                            scale: 1,
                            y: [0, -6, 0],
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2,
                            y: {
                              repeat: Infinity,
                              duration: 1.2,
                              ease: "easeInOut",
                            },
                          }}
                        >
                          <Link
                            href={slide.btnLink}
                            className={`px-5 py-2 font-medium rounded-none ${slide.btnStyle} shadow-md hover:scale-105 active:scale-95 transition-transform duration-200`}
                          >
                            {slide.btnText}
                          </Link>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};