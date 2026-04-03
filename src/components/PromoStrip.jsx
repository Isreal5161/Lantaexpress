import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "./Link";
import { Image } from "./Image";

const PromoTile = ({ item, compact = false }) => {
  const badge = item.badge || "Top deal";
  const showMobileLayout = !compact;

  return (
    <Link href={item.link || "/promotions"} className="group block h-full">
      <article className="relative h-full overflow-hidden border border-emerald-950/10 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500" />

        <div className={`grid h-full ${compact ? "grid-cols-[1.18fr_0.82fr]" : "grid-cols-[1.45fr_0.55fr]"}`}>
          <div className={`relative flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(255,247,237,0.96),_rgba(255,255,255,0.92)_58%,_rgba(236,253,245,0.9))] ${compact ? "p-3.5" : "p-2.5"}`}>
            <div>
              <span className="inline-flex bg-slate-900 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/90">
                {badge}
              </span>
              <h4 className={`mt-1.5 line-clamp-1 font-bold tracking-tight text-slate-900 ${compact ? "text-sm" : "text-[13px]"}`}>
                {item.title}
              </h4>

              {item.priceText && showMobileLayout ? (
                <div className="mt-1 inline-flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 ring-1 ring-emerald-100">
                  <span className="text-[12px] font-extrabold tracking-tight text-emerald-900">
                    {item.priceText}
                  </span>
                  {item.discountText && (
                    <span className="bg-rose-100 px-1 py-0.5 text-[8px] font-bold text-rose-600">
                      {item.discountText}
                    </span>
                  )}
                </div>
              ) : (
                <p className={`mt-0.5 line-clamp-1 text-slate-600 ${compact ? "text-[11px]" : "text-[9px]"}`}>
                  {item.subtitle || "Fresh picks curated for fast mobile shopping."}
                </p>
              )}

              {(compact && (item.priceText || item.discountText || item.urgency)) && (
                <div className="mt-1.5 space-y-1">
                  {(item.priceText || item.originalPriceText || item.discountText) && (
                    <div className="flex flex-wrap items-center gap-1 bg-emerald-50 px-1.5 py-1 ring-1 ring-emerald-100">
                      {item.priceText && (
                        <span className="text-[12px] font-extrabold tracking-tight text-emerald-900">
                          {item.priceText}
                        </span>
                      )}
                      {item.originalPriceText && (
                        <span className="text-[9px] font-medium text-slate-400 line-through">
                          {item.originalPriceText}
                        </span>
                      )}
                      {item.discountText && (
                        <span className="bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-600">
                          {item.discountText}
                        </span>
                      )}
                    </div>
                  )}

                  {item.urgency && (
                    <div className="inline-flex items-center bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 ring-1 ring-amber-200">
                      {item.urgency}
                    </div>
                  )}
                </div>
              )}

              {showMobileLayout && !item.priceText && (
                <p className="mt-0.5 line-clamp-1 text-[9px] text-slate-600">
                  {item.subtitle || "Fresh picks curated for fast mobile shopping."}
                </p>
              )}
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Shop
              </span>
              {compact ? (
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  live deals
                </span>
              ) : (
                item.urgency && (
                  <span className="bg-amber-50 px-1.5 py-0.5 text-[8px] font-semibold text-amber-700 ring-1 ring-amber-200">
                    {item.urgency}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative min-h-[84px] overflow-hidden bg-slate-100">
            {item.image ? (
              <Image
                preset={compact ? "category" : "card"}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                src={item.image}
                alt={item.title}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 via-green-500 to-lime-400">
                <svg width="56" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18l-1.5 11h-15L3 6z" fill="white" />
                  <path d="M7 6V4a3 3 0 016 0v2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-l from-slate-900/16 via-transparent to-transparent" />

            {item.priceText && compact && (
              <div className="absolute bottom-2 left-2 inline-flex items-baseline gap-1 border border-white/60 bg-white/92 px-2 py-1 shadow-sm backdrop-blur-sm">
                <span className="text-[11px] font-extrabold tracking-tight text-slate-900">
                  {item.priceText}
                </span>
                {item.discountText && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-rose-600">
                    {item.discountText}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

const PromoStrip = ({ items }) => {
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaults = items && items.length ? items : [
    { title: "Clearance Sales", subtitle: "Up to 80% off best-rated finds", link: "/hot-sales", badge: "Flash sale" },
    { title: "Petite Fashion", subtitle: "Fresh arrivals for everyday style", link: "/shop", badge: "New in" },
    { title: "Men's Fashion", subtitle: "Trending looks picked this week", link: "/shop", badge: "Trending" },
    { title: "Electronics", subtitle: "Mobile-first gadget deals", link: "/flash-sales", badge: "Hot picks" },
    { title: "Home & Kitchen", subtitle: "Upgrade your space for less", link: "/shop", badge: "Best value" },
  ];

  const mobileDots = useMemo(() => defaults.slice(0, Math.min(defaults.length, 5)), [defaults]);

  useEffect(() => {
    if (!railRef.current || defaults.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % defaults.length;
        const firstCard = railRef.current?.querySelector("[data-promo-card='true']");

        if (railRef.current && firstCard) {
          const cardWidth = firstCard.getBoundingClientRect().width + 12;
          railRef.current.scrollTo({ left: cardWidth * nextIndex, behavior: "smooth" });
        }

        return nextIndex;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [defaults.length]);

  const handleRailScroll = () => {
    if (!railRef.current) return;

    const firstCard = railRef.current.querySelector("[data-promo-card='true']");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width + 12;
    const nextIndex = Math.round(railRef.current.scrollLeft / cardWidth);
    const boundedIndex = Math.max(0, Math.min(nextIndex, defaults.length - 1));

    if (boundedIndex !== activeIndex) {
      setActiveIndex(boundedIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (!railRef.current) return;

    const firstCard = railRef.current.querySelector("[data-promo-card='true']");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width + 12;
    railRef.current.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="overflow-hidden border border-emerald-950/10 bg-[linear-gradient(135deg,#0f8f48_0%,#118a42_48%,#0f6a33_100%)] px-2.5 py-2.5 shadow-[0_16px_36px_rgba(21,128,61,0.18)] sm:px-3.5">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-100/80">Marketplace picks</p>
            <h3 className="mt-1 text-base font-bold tracking-tight text-white sm:text-lg">Featured deals</h3>
          </div>
          <Link href="/shop" className="border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
            See all
          </Link>
        </div>

        <div className="hidden gap-3 md:grid md:grid-cols-3 xl:grid-cols-5">
          {defaults.map((item, index) => (
            <PromoTile key={`${item.title}-${index}`} item={item} compact />
          ))}
        </div>

        <div className="md:hidden">
          <div
            ref={railRef}
            onScroll={handleRailScroll}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {defaults.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                data-promo-card="true"
                className="h-[88px] w-full min-w-full snap-center"
              >
                <PromoTile item={item} />
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[10px] font-medium text-emerald-50/85">Swipe compact deal cards</p>
            <div className="flex items-center gap-2">
              {mobileDots.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to featured deal ${index + 1}`}
                  className={`h-2 transition-all ${index === activeIndex ? "w-5 bg-white" : "w-2 bg-white/35"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromoStrip;
