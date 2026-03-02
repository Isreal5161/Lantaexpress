// src/components/Hero.jsx
import React from "react";
import { Link } from "./Link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const MobileHero = () => {
  return (
    <section id="hero" className="relative bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
{/* Text + CTA Slides */}
<Swiper
  modules={[Autoplay, Pagination]}
  slidesPerView={1}
  autoplay={{ delay: 4000, disableOnInteraction: false }}
  pagination={{ clickable: true }}
  loop={true}
  className="w-full mb-4"
>
  {/* Slide 1 */}
  <SwiperSlide>
    <div className="text-center px-4 sm:px-6 h-52 flex flex-col justify-center bg-white shadow-md overflow-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
        Your Marketplace, <span className="text-green-700">Your Way</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Connect with buyers, sell with ease, and let Lanta Express handle logistics.
      </p>
      <div className="mt-3">
        <Link
          className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          href="/shop"
        >
          Shop Collection
        </Link>
      </div>
    </div>
  </SwiperSlide>

  {/* Slide 2 */}
  <SwiperSlide>
    <div className="text-center px-4 sm:px-6 h-52 flex flex-col justify-center bg-white shadow-md overflow-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
        Fast Delivery, <span className="text-green-700">All State</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Reliable logistics from pickup to doorstep. Wherever you are, we deliver safely.
      </p>
      <div className="mt-3">
        <Link
          className="px-4 py-2 bg-primary-100 text-green-700 font-medium hover:bg-primary-200 transition-colors"
          href="/track"
        >
          Track Your Order
        </Link>
      </div>
    </div>
  </SwiperSlide>

  {/* Slide 3 */}
  <SwiperSlide>
    <div className="text-center px-4 sm:px-6 h-52 flex flex-col justify-center bg-white shadow-md overflow-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
        Shop Smart, <span className="text-green-700">Live Better</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Discover trending products at unbeatable prices. Upgrade your lifestyle quickly.
      </p>
      <div className="mt-3">
        <Link
          className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          href="/shop"
        >
          Shop Now
        </Link>
      </div>
    </div>
  </SwiperSlide>
</Swiper>

{/* Image-only Swiper */}
<div className="w-full h-56 sm:h-64 overflow-hidden shadow-md">
  <Swiper
    modules={[Autoplay, Pagination]}
    slidesPerView={1}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    pagination={{ clickable: true }}
    loop={true}
    className="w-full h-full"
  >
    <SwiperSlide>
      <img
        src="/BANNER4.jpg"
        alt="Slide 1"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>
    <SwiperSlide>
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1350&q=80.jpg"
        alt="Slide 2"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>
    <SwiperSlide>
      <img
        src="/lantaexpressimage1.jpg"
        alt="Slide 3"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>
  </Swiper>
</div>    </div>
    </section>
  );
};