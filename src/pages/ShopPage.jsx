// src/pages/ShopPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from '../context/CartContextTemp';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from "../service/ProductService";
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Link } from '../components/Link';
import BannerCarousel from '../components/BannerCarousel';
import { useLocation } from "react-router-dom";
import PromoModal from "../components/PromoModal";
import {
  PageLoadErrorState,
  ProductGridSkeleton,
  ShopPageSkeleton,
} from "../components/LoadingSkeletons";
import { useSessionModal } from "../hooks/useSessionModal";
import { getCategories } from "../service/CategoryService";
import { matchesProductSearch } from "../utils/productSearch";
import { FaChevronRight, FaStore, FaTag } from "react-icons/fa";

export const ShopPage = () => {
  const { addToCart } = useCart();
  const resultsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [categoryDefinitions, setCategoryDefinitions] = useState([]);
  const { isOpen, closeModal: closeShopPromo } = useSessionModal({
    storageKey: "lantaxpress:shop-promo-seen",
    delay: 1200,
    persistInSession: false,
  });

  const location = useLocation();

  const categories = useMemo(() => {
    const orderedCategories = categoryDefinitions.map((category) => category.title);
    const backendOnlyCategories = Array.from(
      new Set(
        products
          .map((product) => product?.category?.trim())
          .filter(Boolean),
      ),
    ).filter((category) => !orderedCategories.includes(category));

    return ["All Products", ...orderedCategories, ...backendOnlyCategories];
  }, [categoryDefinitions, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setPageError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load shop products:", error);
      setProducts([]);
      setPageError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search") || "";
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    } else if (!categoryParam) {
      setActiveCategory("All Products");
    }
    setSearchTerm(searchParam);
  }, [categories, location.search]);

  useEffect(() => {
    if (location.hash !== "#shop-category-results") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [activeCategory, location.hash, loading]);

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
        console.error("Failed to load shop categories:", error);
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All Products" || product.category === activeCategory;
      const matchesSearch = matchesProductSearch(product, searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchTerm]);

  const categoryCounts = useMemo(() => {
    return categories.reduce((accumulator, category) => {
      if (category === "All Products") {
        accumulator[category] = products.length;
        return accumulator;
      }

      accumulator[category] = products.filter((product) => product.category === category).length;
      return accumulator;
    }, {});
  }, [categories, products]);

  const getCategoryAccent = (category, isActive) => {
    if (isActive) {
      return "from-emerald-600 via-green-600 to-teal-600 text-white shadow-[0_14px_30px_rgba(22,163,74,0.18)] ring-0";
    }

    if (category === "All Products") {
      return "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900";
    }

    return "bg-white/90 text-slate-600 ring-1 ring-slate-200/80 hover:bg-white hover:text-slate-900 hover:ring-slate-300";
  };

  const getCategoryTagTone = (category, isActive) => {
    if (isActive) {
      return "bg-white/16 text-white/90";
    }

    if (category === "All Products") {
      return "bg-emerald-50 text-emerald-700";
    }

    return "bg-slate-100 text-slate-500";
  };

  const hasSearch = searchTerm.trim().length > 0;


  return (
    <div className="min-h-screen flex flex-col bg-white font-body text-slate-600 antialiased">
      <Header />

      {loading ? (
        <ShopPageSkeleton />
      ) : pageError ? (
        <PageLoadErrorState error={pageError} onRefresh={fetchProducts} />
      ) : (
        <>

      {/* Sticky header: breadcrumb + banner + category tabs */}
      <div className="sticky top-0 z-40 bg-white">
        <div className="border-b border-slate-200 bg-[linear-gradient(90deg,rgba(240,253,244,0.95),rgba(255,255,255,0.96),rgba(239,246,255,0.92))]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-sm sm:tracking-[0.22em]">
                <Link className="transition hover:text-slate-800" href="/">Home</Link>
                <FaChevronRight className="text-[10px] text-slate-300" />
                <span className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
                  <FaStore className="text-[11px] text-emerald-600" />
                  Shop
                </span>
                {activeCategory !== "All Products" && (
                  <>
                    <FaChevronRight className="text-[10px] text-slate-300" />
                    <span className="max-w-[10rem] truncate rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100 sm:max-w-none">
                      {activeCategory}
                    </span>
                  </>
                )}
              </nav>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 sm:text-xs">
                <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-slate-200/80">Curated marketplace picks</span>
                <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-slate-200/80">Trusted sellers</span>
                {hasSearch && (
                  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700 ring-1 ring-amber-100">
                    <FaTag className="text-[10px]" />
                    <span className="truncate">Searching: {searchTerm}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="hidden shrink-0 rounded-[22px] bg-slate-900 px-4 py-2 text-right text-white shadow-[0_16px_32px_rgba(15,23,42,0.18)] sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Browse</p>
              <p className="text-sm font-bold">{filteredProducts.length} Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
            <BannerCarousel fullBleed />
          </div>
        </div>

        <div className="overflow-x-auto bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex gap-3 py-3">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r px-4 py-3 text-left whitespace-nowrap transition-all duration-300 ${getCategoryAccent(
                      cat,
                      activeCategory === cat,
                    )}`}
                  >
                    <div className="flex min-w-[9.5rem] items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight">{cat}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-medium">
                          <span className={`rounded-full px-2 py-0.5 transition ${getCategoryTagTone(cat, activeCategory === cat)}`}>
                            {categoryCounts[cat] ?? 0} items
                          </span>
                          <span className={`${activeCategory === cat ? "text-white/70" : "text-slate-400"}`}>
                            Browse
                          </span>
                        </div>
                      </div>

                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${
                          activeCategory === cat
                            ? "bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.18)]"
                            : "bg-slate-300 group-hover:bg-emerald-500"
                        }`}
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PromoModal isOpen={isOpen} onClose={closeShopPromo} products={products} />
      </div>

      <main className="pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-12">
              {/* Product Grid full width */}
              <div ref={resultsRef} id="shop-category-results" className="w-full scroll-mt-44">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-lg font-medium">
                  {hasSearch ? `Product not found for "${searchTerm}"` : "No product available yet in this category"}
                </div>
              ) : (
                <>
                  {hasSearch && (
                    <div className="mb-4 text-sm font-medium text-slate-500">
                      Showing {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"} for "{searchTerm}"
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
        </>
      )}

      <Footer />
    </div>
  );
};