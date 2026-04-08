// src/SplashScreen.jsx
import React from "react";
import Lottie from "lottie-react";
import { motion, useReducedMotion } from "framer-motion";
import splashLoader from "./data/splashLoader.json";

export const SplashScreen = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label="Loading LantaXpress">
      <div className="splash-screen__mesh" />
      <div className="splash-screen__glow" />

      <motion.div
        className="splash-screen__panel"
        initial={{ opacity: 0, scale: 0.97, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src="/homescreenlogo2.png"
          alt="LantaXpress"
          className="splash-screen__logo"
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="splash-screen__lottie-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          aria-hidden="true"
        >
          {prefersReducedMotion ? (
            <div className="splash-screen__loader-fallback">
              <span className="splash-screen__loader-dot" />
              <span className="splash-screen__loader-dot" />
              <span className="splash-screen__loader-dot" />
            </div>
          ) : (
            <Lottie
              animationData={splashLoader}
              loop
              autoplay
              className="splash-screen__lottie"
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};