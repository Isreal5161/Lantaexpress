import { useState, useEffect } from "react";

const BannerCarousel = () => {
  const images = [
    "/banner1.jpg",
    "/BANNER2.jpg",
    "/BANNER3.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Banner ${index + 1}`}
          className={`absolute top-0 left-0 w-full 
            h-[100px] sm:h-[120px] md:h-[150px] 
            lg:h-[150px] xl:h-[150px] object-cover 
            transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );
};

export default BannerCarousel;