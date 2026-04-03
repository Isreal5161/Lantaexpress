import { useState, useEffect } from "react";

const BannerCarousel = ({ className = "", maxWidth = "max-w-5xl", fullBleed = false }) => {
  const slides = [
    {
      src: "/banner1.jpg",
      label: "Top Deals",
      accent: "from-emerald-500/95 to-green-600/95",
    },
    {
      src: "/BANNER2.jpg",
      label: "Trending Picks",
      accent: "from-orange-500/95 to-amber-500/95",
    },
    {
      src: "/BANNER3.jpg",
      label: "Fresh Arrivals",
      accent: "from-sky-500/95 to-cyan-500/95",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const getSlideMotionClasses = (index) => {
    if (index === currentIndex) {
      return "translate-y-0 opacity-100 z-10";
    }

    const previousIndex = (currentIndex - 1 + slides.length) % slides.length;

    if (index === previousIndex) {
      return "-translate-y-full opacity-0 z-0";
    }

    return "translate-y-full opacity-0 z-0";
  };

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // fullBleed: render the image at its natural/responsive size without the card wrapper
  if (fullBleed) {
    return (
      <div className={`w-full ${className} py-0`}>
        <div className="w-full flex justify-center">
          <div className="w-auto">
            <div className="relative grid place-items-center overflow-hidden">
              {slides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.src}
                  alt={`Banner ${index + 1}`}
                  className={`col-start-1 row-start-1 transform transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${getSlideMotionClasses(index)}`}
                  style={{ width: 'auto', maxWidth: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'center' }}
                />
              ))}

              <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                <div className="hidden rounded-2xl bg-slate-950/72 px-3 py-2 text-white shadow-lg backdrop-blur-md sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Marketplace Highlight</p>
                  <p className="mt-1 text-sm font-semibold">{slides[currentIndex].label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`${maxWidth} mx-auto rounded-lg shadow-md overflow-hidden bg-white`}>
        <div className="relative w-full overflow-hidden h-28 sm:h-36 md:h-44 lg:h-56 xl:h-64 flex items-center justify-center">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.src}
              alt={`Banner ${index + 1}`}
              className={`absolute transform transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${getSlideMotionClasses(index)}`}
              style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain', objectPosition: 'center' }}
            />
          ))}

          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
            <div className="rounded-2xl bg-slate-950/72 px-3 py-2 text-white shadow-lg backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Marketplace Highlight</p>
              <p className="mt-1 text-sm font-semibold">{slides[currentIndex].label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;