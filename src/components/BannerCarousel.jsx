import { useState, useEffect } from "react";

const BannerCarousel = ({ className = "", maxWidth = "max-w-5xl", fullBleed = false }) => {
  const images = ["/banner1.jpg", "/BANNER2.jpg", "/BANNER3.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // fullBleed: render the image at its natural/responsive size without the card wrapper
  if (fullBleed) {
    return (
      <div className={`w-full ${className} py-0`}>
        <div className="w-full flex justify-center">
          <div className="w-auto">
            <div className="grid place-items-center overflow-hidden">
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Banner ${index + 1}`}
                  className={`col-start-1 row-start-1 transition-opacity duration-700 ${
                    index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={{ width: 'auto', maxWidth: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'center' }}
                />
              ))}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-green-600' : 'bg-white/60'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
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
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Banner ${index + 1}`}
              className={`absolute transition-opacity duration-700 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain', objectPosition: 'center' }}
            />
          ))}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-green-600' : 'bg-white/60'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;