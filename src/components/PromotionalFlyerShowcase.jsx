import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "./Link";
import { getPromotionFlyers } from "../service/PromotionService";

const createFilledRow = (flyers, totalSlots = 5) => {
  if (!flyers.length) {
    return [];
  }

  const filledFlyers = Array.from({ length: totalSlots }, (_, index) => {
    const flyer = flyers[index % flyers.length];
    return {
      ...flyer,
      id: `${flyer.id}-${index}`,
    };
  });

  return filledFlyers;
};

export const PromotionalFlyerShowcase = ({ section, className = "", compact = false }) => {
  const [flyers, setFlyers] = useState([]);
  const railRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadFlyers = async () => {
      const items = await getPromotionFlyers(section);
      if (mounted) {
        setFlyers(items);
      }
    };

    loadFlyers();

    return () => {
      mounted = false;
    };
  }, [section]);

  const orderedFlyers = useMemo(
    () => [...flyers].sort((firstFlyer, secondFlyer) => (firstFlyer.sortOrder || 0) - (secondFlyer.sortOrder || 0)),
    [flyers]
  );
  const rowFlyers = useMemo(() => createFilledRow(orderedFlyers), [orderedFlyers]);

  useEffect(() => {
    if (orderedFlyers.length <= 1) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail) {
        return;
      }

      const firstCard = rail.querySelector("[data-flyer-card='true']");
      if (!firstCard) {
        return;
      }

      const cardWidth = firstCard.getBoundingClientRect().width + 8;
      const nextLeft = rail.scrollLeft + cardWidth;
      const maxLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);

      rail.scrollTo({
        left: nextLeft >= maxLeft ? 0 : nextLeft,
        behavior: "smooth",
      });
    }, 4200);

    return () => window.clearInterval(timerId);
  }, [orderedFlyers.length]);

  if (!orderedFlyers.length) {
    return null;
  }

  return (
    <section className={className}>
      <div className="border border-slate-200 bg-white p-2 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:p-2.5">
        <div
          ref={railRef}
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {rowFlyers.map((flyer, index) => (
            <motion.div
              key={flyer.id}
              data-flyer-card="true"
              initial={{ opacity: 0, x: 16, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.03 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`shrink-0 ${compact ? "w-[114px] sm:w-[126px]" : "w-[122px] sm:w-[136px] lg:w-[148px]"}`}
            >
              <Link href={flyer.link} className="group block">
                <div className="relative overflow-hidden border border-slate-200 bg-white aspect-[10/11]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,250,252,0.96),_rgba(241,245,249,0.88)_60%,_rgba(226,232,240,0.88))]" />
                  {flyer.mediaType === "video" ? (
                    <video
                      src={flyer.image}
                      className="absolute inset-0 h-full w-full object-contain p-0.5"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={flyer.image}
                      alt={flyer.title || "Promotion flyer"}
                      className="absolute inset-0 h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent p-1.5">
                    <span className="block truncate bg-white/95 px-1.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-900">
                      {flyer.title || "Deal"}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalFlyerShowcase;