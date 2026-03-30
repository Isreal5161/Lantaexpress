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
import { useLocation, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { ProductCard } from "../components/ProductCard";
import Modal from "../components/Modal";
import { MobileHero } from "../components/MobileHero";
import { BecomeSeller } from "../components/BecomeSeller";
import PromotionalBanner from "../components/PromotionalBanner";
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
  const [bannerSticky, setBannerSticky] = useState(true);
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

  // Observe when promo strip enters view -> hide banner (remove stickiness)
  useEffect(() => {
    if (!promoStripRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBannerSticky(false);
        } else {
          setBannerSticky(true);
        }
      },
      { root: null, rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );
    obs.observe(promoStripRef.current);
    return () => obs.disconnect();
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
          <section className="border-b border-slate-100 bg-slate-50/80 py-4">
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

          <div className="pb-20 md:pb-0">

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
            <div className="w-full p-[3px] bg-green-700 mb-2">
              <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-2 text-left">
                Shop by Category
              </h2>
            </div>
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
          <div ref={promoBannerRef} className={`${bannerSticky ? 'sticky top-16 z-50' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4`}>
            <PromotionalBanner
              mode="text"
              slides={promoSlides}
              slideInterval={4200}
              heightClasses="h-28 sm:h-32"
              link="/promotions"
            />
          </div>
        )}

        {/* Hot Deals */}
        <section id="Hot-deal" className="py-6 bg-white-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full p-[2px] bg-green-700 mb-1 rounded-sm">
              <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-1 text-left">
                Hot Deals
              </h2>
            </div>
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
          <PromoStrip items={categoriesWithProducts.map(cat => ({
            title: cat.title,
            subtitle: cat.products?.[0]?.name || '',
            link: `/shop?category=${encodeURIComponent(cat.title)}`,
            image: cat.products?.[0]?.image || null,
          }))} />
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
          <section key={cat.id} ref={idx === 3 ? categoryTargetRef : null} className="py-6 bg-white-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="w-full p-[2px] bg-green-700 mb-1 rounded-sm">
                <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-1 text-left">
                  {cat.title}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 -mt-1">
                {cat.products.map(p => (
                  <ProductCard key={p.id} product={p} addToCart={addToCart} />
                ))}
              </div>
            </div>
          </section>
        ))}

      </div>

      <BecomeSeller position="right" offsetBottom="100" />
        </>
      )}

      <Footer />
    </div>
  );
};