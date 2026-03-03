// src/pages/ShopPage.jsx
import React, { useEffect, useState } from "react";
// <-- add useState & useEffect
import { useCart } from '../context/CartContextTemp';
import { ProductCard } from '../components/ProductCard';
import { getProductsByCategory } from "../service/ProductService"; // use new category fetch
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import BannerCarousel from '../components/BannerCarousel';

export const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [loading, setLoading] = useState(false);

  const categories = [
    "All Products", "Phone/Device", "Perfumes & Cosmetics","Home & Living", "Agriculture & Livestocks",
    "Fashion", "Electronics","Sports & Fitness","Toys & Hobbies",
    "Automotive & Accessories","Books & Stationery","Used Materials", "Cereals"
  ];

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

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex text-sm font-medium text-slate-500">
            <Link className="hover:text-slate-900" href="/"> Home </Link>
            <span className="mx-2"> / </span>
            <span className="text-slate-900"> Shop </span>
          </nav>
          <div className="px-4 sm:px-6 lg:px-8">
            <BannerCarousel />
          </div>
        </div>
      </div>

      <main className="pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar / Horizontal Categories */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
              <div className="overflow-x-auto bg-white border-b border-slate-200 py-2">
                <ul className="flex space-x-4 px-4">
                  {categories.map((cat, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`inline-block text-slate-700 px-3 py-2 font-medium whitespace-nowrap border-b-2 transition-all
                          ${activeCategory === cat
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
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-20 text-gray-500">Loading products...</div>
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