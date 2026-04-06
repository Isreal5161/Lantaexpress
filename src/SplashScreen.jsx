// src/SplashScreen.jsx
import React from "react";
import { motion } from "framer-motion";

const featureChips = ["Fast delivery", "Trusted sellers", "Daily deals"];

export const SplashScreen = () => {
  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label="Loading LantaXpress">
      <div className="splash-screen__aurora splash-screen__aurora--one" />
      <div className="splash-screen__aurora splash-screen__aurora--two" />
      <div className="splash-screen__aurora splash-screen__aurora--three" />

      <motion.div
        className="splash-screen__panel"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="splash-screen__eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          Marketplace experience
        </motion.span>

        <div className="splash-screen__logo-stage">
          <div className="splash-screen__halo" />

          <motion.div
            className="splash-screen__ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          <span className="splash-screen__orbit-dot splash-screen__orbit-dot--one" />
          <span className="splash-screen__orbit-dot splash-screen__orbit-dot--two" />
          <span className="splash-screen__orbit-dot splash-screen__orbit-dot--three" />

          <motion.div
            className="splash-screen__logo-shell"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src="/homescreenlogo.png" alt="LantaXpress" className="splash-screen__logo" />
          </motion.div>
        </div>

        <motion.h1
          className="splash-screen__title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.42 }}
        >
          LantaXpress
        </motion.h1>

        <motion.p
          className="splash-screen__subtitle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.42 }}
        >
          Fresh deals, reliable sellers, and faster delivery in one marketplace.
        </motion.p>

        <div className="splash-screen__chips" aria-hidden="true">
          {featureChips.map((chip, index) => (
            <motion.span
              key={chip}
              className="splash-screen__chip"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 + index * 0.08, duration: 0.38 }}
            >
              {chip}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="splash-screen__loader"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.4 }}
        >
          <span className="splash-screen__loader-track">
            <span className="splash-screen__loader-bar" />
          </span>
          <span className="splash-screen__loader-label">Preparing your storefront</span>
        </motion.div>
      </motion.div>
    </div>
  );
};