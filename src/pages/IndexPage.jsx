import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContextTemp";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Image } from "../components/Image";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from "../components/Link";
import { Text } from "../components/Text";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { categories } from "../service/dummyCategories";
import "swiper/css";
import "swiper/css/pagination";
import { ProductCard } from "../components/ProductCard";
import Modal from "../components/Modal";
import { MobileHero as MobileHero } from "../components/MobileHero"; // rename to avoid conflict

// Import your product service
import { getProducts } from "../service/ProductService";

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
  const { cartItems, addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Start with an empty array or dummy array
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Designer Handbag",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      name: "Gaming Mouse",
      price: 60,
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
    },
  ]);

  // Fetch products from backend/service on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data); // update products state with fetched data
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);
{categories.map((category) => (
  <section key={category.id} className="py-12 bg-white-50">
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Category Title with Gradient Border */}
      <div className={`w-full p-[1px] bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} mb-6`}>
        <h2 className={`text-lg sm:text-xl font-heading font-semibold ${category.bgColor} ${category.textColor} px-4 py-1.5 text-left`}>
          {category.title}
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  </section>
))}
    return (
      
    <div className="font-body text-slate-600 antialiased bg-white">
       
     
      < Header /> 
      {/* Mobile Hero - only show on small screens */}
<div className="block md:hidden">
  <MobileHero />
</div>
       {/* Modal Pop */}
     <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <img
    src="/banner6.jpg"
    alt="Promotional Flyer"
    className="w-full shadow-2xl"
  />
</Modal>
      <>
<div className="pb-20 md:pb-0">
  {/* Desktop / Laptop Hero */}
<div className="hidden md:block">
  <div id="hero" className="relative bg-slate-50 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="grid lg:grid-cols-2 items-center min-h-[350px] px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900">
                <span>Your Marketplace, </span>
                <span className="text-green-700">Your Way</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500">
                Connect with buyers, sell with ease, and let Lanta Express handle the logistics from pickup to delivery.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                <Link
                  className="px-8 py-3 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  href="shop.html"
                >
                  Shop Collection
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="grid lg:grid-cols-2 items-center min-h-[350px] px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900">
                <span>Fast Delivery, </span>
                <span className="text-green-700">All State</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500">
                Reliable logistics from pickup to doorstep. Wherever you are, we deliver your orders safely and on time
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                <Link
                  className="px-8 py-3 bg-primary-100 text-green-700 font-medium hover:bg-primary-200 transition-colors"
                  href="/track"
                >
                  Track Your Order
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="grid lg:grid-cols-2 items-center min-h-[350px] px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900">
                <span>Shop Smart, </span>
                <span className="text-green-700">Live Better</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500">
                Discover trending products at unbeatable prices. Upgrade your lifestyle with just a few clicks.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                <Link
                  className="px-8 py-3 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  href="shop.html"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        grabCursor={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <img
            src="/BANNER4.jpg"
            alt="Slide 1"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1350&q=80.jpg"
            alt="Slide 2"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/lantaexpressimage1.jpg"
            alt="Slide 3"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</div>
    {/* Shop By Category */}
<section id="shop_by_category" className="py-12 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="w-full p-[3px] bg-green-700 mb-6">
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
      {categories.map((category) => (
        <SwiperSlide key={category.id}>
          <Link
            href={`/shop?category=${encodeURIComponent(category.title)}`}
            className="group relative overflow-hidden h-48  block"
          >
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-md"
              src={category.products?.[0]?.image || "/default-category.jpg"}
              alt={category.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 rounded-md">
              <h3 className="text-white font-semibold text-sm sm:text-base">
                {category.title}
              </h3>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>

{/* Hot Deal Section */}
<section id="Hot-deal" className="py-12 bg-white-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Wider green border */}
    <div className="w-full p-[3px] bg-green-700 mb-6 rounded-sm">
      <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-2 text-left">
        Hot Deals
      </h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  </div>
</section>

{/* Trending Now Section */}
<section id="Trending-Now" className="py-12 bg-white-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Wider green border */}
    <div className="w-full p-[3px] bg-green-700 mb-6 rounded-sm">
      <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-2 text-left">
        Trending Now
      </h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  </div>
</section>
 {/* Dynamic Categories from `categories` array */}
{categories.map((category) => (
  <section key={category.id} className="py-12 bg-white-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Same Green Header Style as Trending & Hot Deals */}
      <div className="w-full p-[3px] bg-green-700 mb-6 rounded-sm">
        <h2 className="text-sm sm:text-base font-heading font-semibold bg-green-700 text-white px-4 py-2 text-left">
          {category.title}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

    </div>
  </section>
))}

         </div>
         
       <Footer />
        </>

    </div>
  );
};

