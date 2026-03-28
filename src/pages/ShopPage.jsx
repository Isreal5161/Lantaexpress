// src/pages/ShopPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from '../context/CartContextTemp';
import { ProductCard } from '../components/ProductCard';
import { getProductsByCategory } from "../service/ProductService"; // use new category fetch
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Link } from '../components/Link';
import BannerCarousel from '../components/BannerCarousel';
import { useLocation } from "react-router-dom";
import PromoModal from "../components/PromoModal";
import { ProductGridSkeleton } from "../components/LoadingSkeletons";
import { useSessionModal } from "../hooks/useSessionModal";

export const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [loading, setLoading] = useState(false);
  const { isOpen, closeModal: closeShopPromo } = useSessionModal({
    storageKey: "lantaxpress:shop-promo-seen",
    delay: 1200,
  });

  const categories = [
    "All Products", "Phone/Device", "Perfumes & Cosmetics","Home & Living", "Agriculture & Livestocks",
    "Fashion", "Electronics","Sports & Fitness","Toys & Hobbies",
    "Automotive & Accessories","Books & Stationery","Used Materials", "Cereals"
  ];
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [location.search]);

  // Fetch products whenever category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProductsByCategory(activeCategory);
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory]);


  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

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

        <PromoModal isOpen={isOpen} onClose={closeShopPromo} />
      </div>

      <main className="pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-12">
              {/* Product Grid full width */}
              <div className="w-full">
              {loading ? (
                <ProductGridSkeleton count={8} imageClassName="h-52" />
              ) : products.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-lg font-medium">
                  No product available yet in this category
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};