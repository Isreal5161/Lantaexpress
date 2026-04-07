import React, { useState, useEffect, useMemo, useRef } from "react";
import { useCart } from "../context/CartContextTemp";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Image } from "../components/Image";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Link } from "../components/Link";
import { Text } from "../components/Text";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaBolt, FaFireAlt, FaGift, FaLayerGroup } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { ProductCard } from "../components/ProductCard";
import Modal from "../components/Modal";
import { MobileHero } from "../components/MobileHero";
import { BecomeSeller } from "../components/BecomeSeller";
import PromotionalBanner from "../components/PromotionalBanner";
import PromotionalFlyerShowcase from "../components/PromotionalFlyerShowcase";
import PromoStrip from "../components/PromoStrip";
import { getProducts } from "../service/ProductService";
import { AnimatePresence, motion } from "framer-motion";
import {
  IndexPageSkeleton,
  PageLoadErrorState,
} from "../components/LoadingSkeletons";
import { useSessionModal } from "../hooks/useSessionModal";
import { getCategories } from "../service/CategoryService";
import { matchesProductSearch, normalizeProductSearchQuery } from "../utils/productSearch";
import {
  getEffectiveProductPrice,
  getOriginalProductPrice,
  getProductDiscountPercent,
  hasActiveProductDiscount,
} from "../utils/productPricing";
import { warmHeroMedia } from "../service/HeroService";

const formatPromoPrice = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

const categoryHeaderVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const marketingBoardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen: isModalOpen, closeModal: closeHomePromo } = useSessionModal({
    storageKey: "lantaxpress:index-promo-seen",
  });
  const promoBannerRef = useRef(null);
  const promoStripRef = useRef(null);
  const categoryTargetRef = useRef(null);
  const bannerStickyTimeoutRef = useRef(null);
  const bannerStickyReleasedRef = useRef(false);
  const [bannerSticky, setBannerSticky] = useState(false);
  const [stripSticky, setStripSticky] = useState(false);

  const [products, setProducts] = useState([]);
  const [categoryDefinitions, setCategoryDefinitions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  }, [location.search]);

  useEffect(() => {
    warmHeroMedia();
  }, []);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const categoriesWithProducts = useMemo(() => {
    const categoryMap = new Map(
      categoryDefinitions.map((category) => [
        category.title,
        {
          ...category,
          products: [],
        },
      ]),
    );

    products.forEach((product) => {
      const categoryTitle = product?.category?.trim() || "Uncategorized";

      if (!categoryMap.has(categoryTitle)) {
        categoryMap.set(categoryTitle, {
          id: `dynamic-${categoryTitle}`,
          title: categoryTitle,
          gradientFrom: "from-black",
          gradientTo: "to-green-500",
          bgColor: "bg-green",
          textColor: "text-white",
          products: [],
        });
      }

      categoryMap.get(categoryTitle).products.push(product);
    });

    return Array.from(categoryMap.values()).filter((category) => category.products.length > 0);
  }, [categoryDefinitions, products]);

  const promoSlides = useMemo(
    () =>
      categoriesWithProducts.slice(0, 2).map((category, index) => ({
        headline: index === 0 ? "Limited Time Offers" : "Flash Sales — Up to 50%",
        subheadline:
          index === 0
            ? "Free delivery on selected items this week"
            : "Hurry, sale ends tonight!",
        ctaText: index === 0 ? "Explore" : "Shop Flash",
        flyerImage: category.products[0]?.image || (index === 0 ? "/banner-flyer.jpg" : "/banner-flyer-2.jpg"),
        bgGradient: index === 0 ? "bg-gradient-to-r from-green-600 to-green-500" : "bg-gradient-to-r from-green-700 to-green-500",
        textColor: "text-white",
        flyerWidthClasses: "w-36 sm:w-44",
      })),
    [categoriesWithProducts],
  );

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setPageError(null);

    try {
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
        return;
      }

      setProducts([]);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setPageError(error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (active) {
          setCategoryDefinitions(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        if (active) {
          setCategoryDefinitions([]);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const hotDealProducts = products.slice(0, 6);
  const trendingProducts = products.slice(0, 6);
  const hasSearch = searchTerm.trim().length > 0;
  const searchResults = useMemo(
    () => products.filter((product) => matchesProductSearch(product, searchTerm)),
    [products, searchTerm],
  );
  const searchSuggestions = useMemo(() => {
    const normalizedInput = normalizeProductSearchQuery(searchInput);

    const seenProductNames = new Set();

    return products
      .filter((product) => {
        if (!product?.name) {
          return false;
        }

        if (!normalizedInput) {
          return true;
        }

        return matchesProductSearch({ ...product, brand: "", category: "", description: "" }, normalizedInput);
      })
      .filter((product) => {
        const normalizedName = normalizeProductSearchQuery(product.name);
        if (!normalizedName || seenProductNames.has(normalizedName)) {
          return false;
        }

        seenProductNames.add(normalizedName);
        return true;
      })
      .slice(0, 7);
  }, [products, searchInput]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const normalizedInput = searchInput.trim().replace(/\s+/g, " ");
    const params = new URLSearchParams(location.search);

    if (normalizedInput) {
      params.set("search", normalizedInput);
    } else {
      params.delete("search");
    }

    const nextSearch = params.toString();
    navigate(nextSearch ? `/?${nextSearch}` : "/");
    setSearchFocused(false);
  };

  const handleSuggestionSelect = (productId) => {
    setSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Keep the promo banner sticky for a few seconds, then release it permanently.
  useEffect(() => {
    const stickyTop = 160;
    const stickyDurationMs = 4500;

    const updateBannerStickyState = () => {
      if (!promoBannerRef.current || !promoStripRef.current || bannerStickyReleasedRef.current) {
        setBannerSticky(false);
        return;
      }

      const bannerRect = promoBannerRef.current.getBoundingClientRect();
      const stripRect = promoStripRef.current.getBoundingClientRect();
      const shouldStick = bannerRect.top <= stickyTop && stripRect.top > stickyTop + 24;

      if (!shouldStick) {
        setBannerSticky(false);
        return;
      }

      if (!bannerStickyTimeoutRef.current) {
        bannerStickyTimeoutRef.current = window.setTimeout(() => {
          bannerStickyReleasedRef.current = true;
          bannerStickyTimeoutRef.current = null;
          setBannerSticky(false);
        }, stickyDurationMs);
      }

      setBannerSticky(true);
    };

    updateBannerStickyState();
    window.addEventListener("scroll", updateBannerStickyState, { passive: true });
    window.addEventListener("resize", updateBannerStickyState);

    return () => {
      window.removeEventListener("scroll", updateBannerStickyState);
      window.removeEventListener("resize", updateBannerStickyState);
      if (bannerStickyTimeoutRef.current) {
        window.clearTimeout(bannerStickyTimeoutRef.current);
        bannerStickyTimeoutRef.current = null;
      }
    };
  }, []);

  // Make promo strip sticky while in view until user reaches 4th category
  useEffect(() => {
    if (!promoStripRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setStripSticky(entry.isIntersecting);
      },
      { root: null, rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );
    obs.observe(promoStripRef.current);
    return () => obs.disconnect();
  }, []);

  // When the 4th category (index 3) appears, remove promo strip stickiness
  useEffect(() => {
    if (!categoryTargetRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStripSticky(false);
      },
      { root: null, rootMargin: '-80px 0px 0px 0px', threshold: 0.2 }
    );
    obs.observe(categoryTargetRef.current);
    return () => obs.disconnect();
  }, [categoryTargetRef]);

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header hideSearchControl />

      {loadingProducts ? (
        <IndexPageSkeleton />
      ) : pageError ? (
        <PageLoadErrorState error={pageError} onRefresh={fetchProducts} />
      ) : (
        <>
          <section className="sticky top-16 z-40 border-b border-slate-100 bg-slate-50/95 py-4 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <div className="flex items-center px-4 text-slate-400">
                      <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Icon>
                    </div>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
                      placeholder="Search products, brands, and categories"
                      className="min-w-0 flex-1 bg-transparent px-1 py-4 text-sm text-slate-700 outline-none sm:text-base"
                    />
                    <button
                      type="submit"
                      className="m-2 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      Search
                    </button>
                  </div>

                  <AnimatePresence>
                    {searchFocused && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-30 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
                      >
                        <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {searchInput.trim() ? "Matching products" : "Popular searches"}
                        </div>
                        <div className="divide-y divide-slate-100">
                          {searchSuggestions.map((product, index) => (
                            <motion.button
                              key={`suggestion-${product.id}`}
                              type="button"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.16, delay: index * 0.03 }}
                              onClick={() => handleSuggestionSelect(product.id)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </Icon>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                                <p className="truncate text-xs text-slate-500">{product.category || "Uncategorized"}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </section>

          <MobileHero />

          <Modal isOpen={isModalOpen} onClose={closeHomePromo}>
            <img src="/banner6.jpg" alt="Promotional Flyer" className="w-full shadow-2xl" />
          </Modal>

          <div className="pb-16 md:pb-0">

        <PromotionalFlyerShowcase section="home" className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 sm:py-6" />

        {hasSearch && (
          <section className="py-6 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="w-full p-[2px] bg-green-700 mb-1 rounded-sm">
                <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-1 text-left">
                  Search Results
                </h2>
              </div>
              {searchResults.length === 0 ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                  No product found for "{searchTerm}".
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm font-medium text-slate-500">
                    Showing {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for "{searchTerm}"
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 -mt-1">
                    {searchResults.slice(0, 8).map((product) => (
                      <ProductCard key={`search-${product.id}`} product={product} addToCart={addToCart} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

       

        {/* Shop By Category */}
        <section id="shop_by_category" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mb-4 overflow-hidden bg-[linear-gradient(120deg,#052e16_0%,#15803d_48%,#f97316_100%)] shadow-[0_18px_40px_rgba(22,101,52,0.18)]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={marketingBoardVariants}
            >
              <div className="flex flex-col gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                    <FaLayerGroup className="text-orange-200" />
                    Explore curated aisles
                  </div>
                  <h2 className="mt-2 text-sm font-heading font-semibold uppercase tracking-[0.08em] text-white sm:text-[15px]">
                    Shop by Category
                  </h2>
                  <p className="mt-1 text-[10px] font-medium leading-5 text-green-50/90 sm:text-[11px]">
                    Quick-entry boards for shoppers who want the fastest route into the right product lane.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 border border-orange-300/50 bg-orange-400/15 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-orange-50 backdrop-blur-sm">
                    <FaBolt className="animate-pulse text-orange-200" />
                    Fast discovery
                  </span>
                  <span className="inline-flex items-center gap-1.5 border border-white/20 bg-white/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                    Swipe categories
                  </span>
                </div>
              </div>
            </motion.div>
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={2}
              spaceBetween={12}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="w-full"
            >
              {categoriesWithProducts.map(cat => (
                <SwiperSlide key={cat.id}>
                  <Link href={`/shop?category=${encodeURIComponent(cat.title)}`} className="group relative overflow-hidden h-48 block">
                    <Image
                      preset="category"
                      variant="cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-md"
                      src={cat.products?.[0]?.image || "/default-category.jpg"}
                      alt={cat.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 rounded-md">
                      <h3 className="text-white font-semibold text-sm sm:text-base">{cat.title}</h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
        {/* Promotion Banner (between Shop by Category and Hot Deals) */}
        {promoSlides.length > 0 && (
          <div ref={promoBannerRef} className={`${bannerSticky ? 'sticky top-40 z-30' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4`}>
            <PromotionalBanner
              mode="text"
              slides={promoSlides}
              slideInterval={4200}
              heightClasses="h-28 sm:h-32"
              link="/hot-sales"
            />
          </div>
        )}

        {/* Hot Deals */}
        <section id="Hot-deal" className="py-6 bg-white-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mb-4 overflow-hidden bg-[linear-gradient(120deg,#7c2d12_0%,#ea580c_44%,#facc15_100%)] shadow-[0_18px_42px_rgba(249,115,22,0.22)]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={marketingBoardVariants}
            >
              <div className="relative flex flex-col gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 lg:flex-row lg:items-center lg:justify-between">
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full bg-white/20 blur-2xl"
                  animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.35, 0.6, 0.35] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 border border-white/20 bg-black/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm">
                    <FaFireAlt className="animate-pulse text-yellow-100" />
                    Flash promotion board
                  </div>
                  <h2 className="mt-2 text-sm font-heading font-semibold uppercase tracking-[0.08em] text-white sm:text-[15px]">
                    Hot Deals
                  </h2>
                  <p className="mt-1 text-[10px] font-medium leading-5 text-orange-50/90 sm:text-[11px]">
                    High-heat offers, sharper markdowns, and faster-moving picks surfaced for immediate conversion.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 border border-yellow-200/60 bg-yellow-300/20 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    <FaGift className="text-yellow-100" />
                    Deal drop
                  </span>
                  <motion.span
                    className="inline-flex items-center gap-1.5 border border-white/20 bg-white/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Limited window
                  </motion.span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 -mt-1"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {hotDealProducts.length === 0 ? (
                <p className="col-span-full py-10 text-center text-sm text-slate-500">No products available right now.</p>
              ) : (
                hotDealProducts.map(p => (
                  <motion.div key={p.id} variants={cardVariants}>
                    <ProductCard product={p} addToCart={addToCart} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        {/* Jumia-style promo strip (uses category images where available) */}
        <div ref={promoStripRef} className={`${stripSticky ? 'sticky top-16 z-40' : ''} mt-3 mb-3`}>
          <PromoStrip items={categoriesWithProducts.slice(0, 4).map((cat, index) => {
            const leadProduct = cat.products?.[0] || {};
            const effectivePrice = getEffectiveProductPrice(leadProduct);
            const originalPrice = getOriginalProductPrice(leadProduct);
            const fallbackPrice = Number(leadProduct?.price) || Number(leadProduct?.originalPrice) || 0;
            const discountPercent = getProductDiscountPercent(leadProduct);
            const hasDiscount = hasActiveProductDiscount(leadProduct);
            const urgencyLabels = ["Ends tonight", "Limited stock", "Flash pick", "Selling fast", "Best today"];
            const badgeLabels = ["Flash sale", "Deal drop", "Hot picks", "Top value", "Best offer"];

            return {
              title: cat.title,
              subtitle: cat.products?.[0]?.name || "Curated picks for mobile shoppers",
              link: `/shop?category=${encodeURIComponent(cat.title)}`,
              image: cat.products?.[0]?.image || null,
              badge: badgeLabels[index % badgeLabels.length],
              urgency: urgencyLabels[index % urgencyLabels.length],
              priceText: (effectivePrice > 0 ? formatPromoPrice(effectivePrice) : fallbackPrice > 0 ? formatPromoPrice(fallbackPrice) : null),
              originalPriceText: hasDiscount ? formatPromoPrice(originalPrice) : null,
              discountText: hasDiscount && discountPercent > 0 ? `-${discountPercent}%` : null,
            };
          })} />
        </div>

{/* Trending Now */}
      <section id="Trending-Now" className="py-4 bg-white-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="w-full p-[2px] bg-green-700 mb-1 rounded-sm">
              <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-1 text-left">
        Trending Now
      </h2>
    </div>
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 -mt-1"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {trendingProducts.length === 0 ? (
        <p className="col-span-full py-10 text-center text-sm text-slate-500">No trending products available right now.</p>
      ) : (
        trendingProducts.map(p => (
          <motion.div key={p.id} variants={cardVariants}>
            <ProductCard product={p} addToCart={addToCart} />
          </motion.div>
        ))
      )}
    </motion.div>
  </div>
</section>

        {/* Dynamic Categories */}
        {categoriesWithProducts.map((cat, idx) => (
          <motion.section
            key={cat.id}
            ref={idx === 3 ? categoryTargetRef : null}
            className="py-7 bg-white-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={categoryHeaderVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="mb-2 overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 shadow-[0_12px_28px_rgba(22,101,52,0.16)]"
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4.5">
                  <div>
                    <h2 className="text-sm font-heading font-semibold tracking-[0.08em] text-white sm:text-base text-left uppercase">
                      {cat.title}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-green-50/90 sm:text-xs">
                      Browse more {cat.title.toLowerCase()} deals in the shop.
                    </p>
                  </div>

                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.title)}#shop-category-results`}
                      className="group inline-flex items-center gap-2.5 border border-orange-300/80 bg-orange-500 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_18px_rgba(249,115,22,0.38)] transition-all duration-200 hover:bg-orange-400 hover:shadow-[0_12px_22px_rgba(249,115,22,0.45)] sm:px-4 sm:text-xs"
                    >
                      <span className="hidden border-r border-white/35 pr-2 text-[10px] font-extrabold tracking-[0.22em] text-orange-100 sm:inline-flex">
                        Shop
                      </span>
                      <span>See more</span>
                      <motion.span
                        aria-hidden="true"
                        className="inline-flex text-sm"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 -mt-1">
                {cat.products.map(p => (
                  <motion.div
                    key={p.id}
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.988 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="h-full"
                  >
                    <ProductCard product={p} addToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}

      </div>

      <BecomeSeller position="right" offsetBottom="100" />
        </>
      )}

      <Footer />
    </div>
  );
};