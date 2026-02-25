import React, { useEffect, useState } from "react";
import { useCart } from '../context/CartContextTemp';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from "../service/ProductService";
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import BannerCarousel from '../components/BannerCarousel';

export const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <nav className="flex text-sm font-medium text-slate-500">
            <Link className="hover:text-slate-900" href="/"> Home </Link>
            <span className="mx-2"> / </span>
            <span className="text-slate-900"> Shop </span>
            <div className="px-4 sm:px-6 lg:px-8">
  <BannerCarousel />
</div>
          </nav>

         </div>
      </div>
      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
<aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
  {/* Categories */}
 {/* Horizontal Categories */}
<div className="overflow-x-auto bg-white border-b border-slate-200 py-2">
  <ul className="flex space-x-4 px-4">
    {["All Products", "Electronics","Home & Living", "Agriculture & Livestocks", "Fashion", "Phone/Device","Sports & Fitness","Toys & Hobbies","Automotive & Accessories","Books & Stationery","Used Materials", "Cereals"].map((cat, idx) => (
      <li key={idx}>
        <Link
          href="#"
          className="inline-block text-slate-700 hover:text-green-600 px-3 py-2 font-medium whitespace-nowrap border-b-2 border-transparent hover:border-green-500 transition-all"
        >
          {cat}
        </Link>
      </li>
    ))}
  </ul>
</div>

  {/* Optional: Price Range, Colors, etc. */}
</aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};