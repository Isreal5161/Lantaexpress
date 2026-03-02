// src/SplashScreen.jsx
import React, { useEffect } from "react";

export const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3000ms = 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img
        src="homescreenlogo.png"
        alt="LantaXpress Logo"
        className="w-48 h-48"
      />
    </div>
  );
};