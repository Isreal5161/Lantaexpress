import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "./Link";

const PromoTile = ({ item }) => (
  <Link href={item.link || "/promotions"} className="block">
    <div className="bg-white rounded-none shadow-sm overflow-hidden w-40 sm:w-44 md:w-48 hover:scale-105 transform transition-transform duration-200">
      <div className="h-20 flex items-center justify-center bg-gray-100 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center">
            <svg width="56" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18l-1.5 11h-15L3 6z" fill="white" />
              <path d="M7 6V4a3 3 0 016 0v2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <div className="px-3 py-2 text-center">
        <h4 className="text-sm font-semibold text-slate-800 truncate">{item.title}</h4>
        <p className="text-xs text-slate-600 mt-1">{item.subtitle}</p>
      </div>
    </div>
  </Link>
);

const PromoStrip = ({ items }) => {
  const defaults = items && items.length ? items : [
    { title: "Clearance Sales", subtitle: "Up to 80% Off", link: "/promotions" },
    { title: "Petite Fashion", subtitle: "New Arrivals", link: "/shop" },
    { title: "Men's Fashion", subtitle: "Trending", link: "/shop" },
    { title: "Electronics", subtitle: "Hot Deals", link: "/shop" },
    { title: "Home & Kitchen", subtitle: "Top Picks", link: "/shop" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-green-700 to-green-700 p-3 rounded-none">{/* green brand strip */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Featured</h3>
          <div className="text-sm text-white/90">See all</div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            slidesPerView={'auto'}
            spaceBetween={12}
            navigation
            className="py-2"
          >
            {defaults.map((it, idx) => (
              <SwiperSlide key={idx} style={{ width: 'auto' }}>
                <PromoTile item={it} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PromoStrip;
