import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1500);

    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-full flex flex-col items-center justify-center bg-[#16a34a] transition-opacity duration-1000 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo (Use transparent PNG if possible) */}
      <img
        src="SplashScreenlogo2.png"
        alt="LantaXpress"
        className="w-56 sm:w-64 animate-bounce mb-6"
      />

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}