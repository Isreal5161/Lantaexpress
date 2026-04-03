import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import PromotionalFlyerShowcase from "../components/PromotionalFlyerShowcase";
import { ProductCard } from "../components/ProductCard";
import { getHotDeals } from "../service/ProductService";

export const HotSalesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const items = await getHotDeals();
        setProducts(items);
      } catch (loadError) {
        setError(loadError.message || "Failed to load hot sales.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);
  const highestDiscount = useMemo(
    () => featuredProducts.reduce((largest, product) => Math.max(largest, Number(product.discountPercent) || 0), 0),
    [featuredProducts]
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fff4eb_26%,#ffffff_58%,#f8fafc_100%)]">
      <Header />

      <main className="pb-24 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-700 ring-1 ring-orange-200">
              Hot sales
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
              <span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">{products.length} deals</span>
              <span className="rounded-full bg-white px-3 py-2 ring-1 ring-orange-200">Up to {highestDiscount || 0}% off</span>
            </div>
          </div>
          <PromotionalFlyerShowcase section="hot-sales" compact />
        </div>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">Hot deals</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Discounted products</h2>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-orange-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading hot sales...</div>
          ) : error ? (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-[28px] border border-orange-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">No discounted products are live right now.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HotSalesPage;