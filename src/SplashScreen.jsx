// src/SplashScreen.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const SplashScreen = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label="Loading LantaXpress">
      <div className="splash-screen__mesh" />
      <div className="splash-screen__glow" />

      <motion.div
        className="splash-screen__card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="splash-screen__card-highlight" />

        <motion.img
          src="/homescreenlogo2.png"
          alt="LantaXpress"
          className="splash-screen__logo"
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="splash-screen__loader-shell"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          aria-hidden="true"
        >
          {prefersReducedMotion ? (
            <div className="splash-screen__loader-fallback">
              <span className="splash-screen__loader-core" />
            </div>
          ) : (
            <>
              <motion.span
                className="splash-screen__loader-ring splash-screen__loader-ring--outer"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="splash-screen__loader-ring splash-screen__loader-ring--inner"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <span className="splash-screen__loader-core" />
              <span className="splash-screen__loader-halo" />
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};