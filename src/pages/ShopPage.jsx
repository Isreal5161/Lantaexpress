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

  const hasSearch = searchTerm.trim().length > 0;


  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

      {loading ? (
        <ShopPageSkeleton />
      ) : pageError ? (
        <PageLoadErrorState error={pageError} onRefresh={fetchProducts} />
      ) : (
        <>

      {/* Sticky header: breadcrumb + banner + category tabs */}
      <div className="sticky top-0 z-40 bg-white">
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <nav className="flex text-sm font-medium text-slate-500">
              <Link className="hover:text-slate-900" href="/"> Home </Link>
              <span className="mx-2"> / </span>
              <span className="text-slate-900"> Shop </span>
            </nav>
            <div className="px-4 sm:px-6 lg:px-8" />
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
            <BannerCarousel fullBleed />
          </div>
        </div>

        <div className="overflow-x-auto bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex space-x-4 py-2">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-block text-slate-700 px-3 py-2 font-medium whitespace-nowrap border-b-2 transition-all ${
                      activeCategory === cat
                        ? "border-green-500 text-green-600"
                        : "border-transparent hover:border-green-500 hover:text-green-600"
                    }`}
                  >
                    {cat}
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