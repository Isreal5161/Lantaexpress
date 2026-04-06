// src/SplashScreen.jsx
import React from "react";
import { motion } from "framer-motion";

export const SplashScreen = () => {
  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label="Loading LantaXpress">
      <div className="splash-screen__aurora splash-screen__aurora--one" />
      <div className="splash-screen__aurora splash-screen__aurora--two" />
      <div className="splash-screen__aurora splash-screen__aurora--three" />

      <motion.div
        className="splash-screen__brand"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="splash-screen__logo-stage">
          <div className="splash-screen__halo" />
          <motion.div
            className="splash-screen__ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
          <motion.img
            src="/iconlogo.png"
            alt="LantaXpress"
            className="splash-screen__logo"
            initial={{ opacity: 0, scale: 0.9, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <motion.p
          className="splash-screen__subtitle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.42 }}
        >
          Loading your marketplace
        </motion.p>

        <motion.div
          className="splash-screen__loader"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
        >
          <span className="splash-screen__loader-track">
            <span className="splash-screen__loader-bar" />
          </span>
          <span className="splash-screen__loader-label">Preparing LantaXpress</span>
        </motion.div>
      </motion.div>
    </div>
  );
};