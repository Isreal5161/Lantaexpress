import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import PromotionalFlyerShowcase from "../components/PromotionalFlyerShowcase";
import { ProductCard } from "../components/ProductCard";
import { getFlashSaleProducts, getMostWantedProducts } from "../service/ProductService";

const CampaignRail = ({ eyebrow, title, products, accent }) => {
  if (!products.length) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
        {title} is empty right now. Admin can feature approved seller products here from the product manager.
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.28em] ${accent}`}>{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const FlashSalesPage = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [mostWantedProducts, setMostWantedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const [flashItems, wantedItems] = await Promise.all([getFlashSaleProducts(), getMostWantedProducts()]);
        setFlashProducts(flashItems);
        setMostWantedProducts(wantedItems);
      } catch (loadError) {
        setError(loadError.message || "Failed to load flash sales.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0%,#f8fafc_24%,#ffffff_58%,#fefce8_100%)]">
      <Header />

      <main className="pb-24 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-700 ring-1 ring-cyan-200">
              Flash sales
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
              <span className="rounded-full bg-white px-3 py-2 ring-1 ring-amber-200">{flashProducts.length} flash picks</span>
              <span className="rounded-full bg-white px-3 py-2 ring-1 ring-emerald-200">{mostWantedProducts.length} most wanted</span>
            </div>
          </div>
          <PromotionalFlyerShowcase section="flash-sales" compact />
        </div>

        <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading campaign products...</div>
          ) : error ? (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>
          ) : (
            <>
              <CampaignRail
                eyebrow="Fast exit deals"
                title="Flash sales"
                products={flashProducts}
                accent="text-amber-600"
              />
              <CampaignRail
                eyebrow="High-demand shelf"
                title="Most wanted"
                products={mostWantedProducts}
                accent="text-emerald-600"
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FlashSalesPage;