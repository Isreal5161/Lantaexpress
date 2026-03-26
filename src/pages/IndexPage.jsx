import React, { useState, useEffect, useRef } from "react";
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
import { categories } from "../service/dummyCategories";
import "swiper/css";
import "swiper/css/pagination";
import { ProductCard } from "../components/ProductCard";
import Modal from "../components/Modal";
import { MobileHero } from "../components/MobileHero";
import { BecomeSeller } from "../components/BecomeSeller";
import PromotionalBanner from "../components/PromotionalBanner";
import PromoStrip from "../components/PromoStrip";
import { getProducts } from "../service/ProductService";
import { motion } from "framer-motion";

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
  const { cartItems, addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const promoBannerRef = useRef(null);
  const promoStripRef = useRef(null);
  const categoryTargetRef = useRef(null);
  const [bannerSticky, setBannerSticky] = useState(true);
  const [stripSticky, setStripSticky] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, name: "Wireless Headphones", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Smart Watch", price: 250, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Designer Handbag", price: 180, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Gaming Mouse", price: 60, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Leather Wallet", price: 45, image: "https://images.unsplash.com/photo-1600185366207-3f7ee2c2c7c2?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Bluetooth Speaker", price: 80, image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=500&q=80" },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          // merge approved products into the local products state and deduplicate by id
          setProducts(prev => {
            const combined = [...data, ...prev];
            const map = new Map();
            for (const item of combined) {
              if (!item) continue;
              const id = (item.id || item._id || '').toString();
              if (!id) continue;
              if (!map.has(id)) map.set(id, { ...item, id });
            }
            return Array.from(map.values());
          });

          // Also merge approved products into the categories list so category sections show them
          try {
            data.forEach(p => {
              if (!p || !p.category) return;
              const cat = categories.find(c => c.title === p.category);
              const mapped = {
                id: (p.id || p._id || '').toString(),
                name: p.name,
                brand: p.brand || "",
                stock: p.stock || 0,
                price: p.price || 0,
                image: p.image || "/default-product.jpg",
                category: p.category,
                description: p.description || "",
              };
              if (cat) {
                // avoid duplicates by string id
                if (!cat.products.some(x => (x.id || '').toString() === mapped.id.toString())) {
                  cat.products.unshift(mapped);
                }
              }
            });
          } catch (err) {
            console.warn('Failed to merge products into categories', err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const padProducts = (list) => {
    const padded = [...list];
    while (padded.length < 6) {
      padded.push({ id: `dummy-${padded.length}`, name: "Coming Soon", price: 0, image: "/default-product.jpg" });
    }
    return padded;
  };

  const hotDealProducts = padProducts(products.slice(0, 6));
  const trendingProducts = padProducts(products.slice(0, 6));

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
      <Header />

    
   <MobileHero />

      

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <img src="/banner6.jpg" alt="Promotional Flyer" className="w-full shadow-2xl" />
      </Modal>

      <div className="pb-20 md:pb-0">

       

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
              {categories.map(cat => (
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
        <div ref={promoBannerRef} className={`${bannerSticky ? 'sticky top-16 z-50' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4`}>
          <PromotionalBanner
            mode="text"
            slides={[
              {
                headline: "Limited Time Offers",
                subheadline: "Free delivery on selected items this week",
                ctaText: "Explore",
                flyerImage: categories?.[0]?.products?.[0]?.image || "/banner-flyer.jpg",
                bgGradient: "bg-gradient-to-r from-green-600 to-green-500",
                textColor: "text-white",
                flyerWidthClasses: "w-36 sm:w-44",
              },
              {
                headline: "Flash Sales — Up to 50%",
                subheadline: "Hurry, sale ends tonight!",
                ctaText: "Shop Flash",
                flyerImage: categories?.[1]?.products?.[0]?.image || "/banner-flyer-2.jpg",
                bgGradient: "bg-gradient-to-r from-green-700 to-green-500",
                textColor: "text-white",
                flyerWidthClasses: "w-36 sm:w-44",
              },
            ]}
            slideInterval={4200}
            heightClasses="h-28 sm:h-32"
            link="/promotions"
          />
        </div>

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
              {hotDealProducts.map(p => (
                <motion.div key={p.id} variants={cardVariants}>
                  <ProductCard product={p} addToCart={addToCart} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Jumia-style promo strip (uses category images where available) */}
        <div ref={promoStripRef} className={`${stripSticky ? 'sticky top-16 z-40' : ''} mt-3 mb-3`}>
          <PromoStrip items={categories.map(cat => ({
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
      {trendingProducts.map(p => (
        <motion.div key={p.id} variants={cardVariants}>
          <ProductCard product={p} addToCart={addToCart} />
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

        {/* Dynamic Categories */}
        {categories.map((cat, idx) => (
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
      <Footer />
    </div>
  );
};