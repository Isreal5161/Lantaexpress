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
import "swiper/css";
import "swiper/css/pagination";
import { ProductCard } from "../components/ProductCard";

// Import your product service
import { getProducts } from "../service/ProductService";

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
  const { cartItems, addToCart } = useCart();

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

    return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <>
      < Header /> 
<main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <section id="hero" className="relative bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-slate-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div data-aos="fade-up" className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl font-heading">
                    <Text className="block xl:inline"> Your Marketplace, </Text>
                    <Text className="block text-green-700 xl:inline"> Your Way </Text>
                  </h1>
                  <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                     Connect with buyers, sell with ease, and let Lanta Express handle the logistics from pickup to delivery. 
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link contentKey="cta_19" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg transition-colors" href="shop.html"> Shop Collection </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link contentKey="cta_20" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium  text-green-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg transition-colors" href="/logistics"> Book a Pickup </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
  <Swiper
    modules={[Autoplay, Pagination]}
    slidesPerView={1}
    spaceBetween={0}
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    pagination={{ clickable: true }}
    loop={true}
    grabCursor={true}
    className="h-56 sm:h-72 md:h-96 lg:h-full"
  >
    <SwiperSlide>
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1350&q=80"
        alt="Slide 1"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>

    <SwiperSlide>
      <img
        src="/lantaexpressimage1.jpg"
        alt="Slide 2"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>

    <SwiperSlide>
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1350&q=80"
        alt="Slide 3"
        className="w-full h-full object-cover"
      />
    </SwiperSlide>
  </Swiper>
</div>
        </section>
        {/* Shop By Category */}
<section id="shop_by_category" className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="w-full p-[1px] bg-gradient-to-r from-black to-green-500 mb-8">
  <h2 className="text-lg sm:text-xl font-heading font-semibold bg-green text-white px-4 py-1.5 text-left">
    Shop by Category
  </h2>
</div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {/* Swiper */}
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1}            // Each slide shows 1 "row" of 2 categories
      spaceBetween={20}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={true}
      className="w-full"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category 1 */}
          <Link className="group relative overflow-hidden h-64" href="shop.html">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
              alt="Electronics"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-bold text-xl">Electronics</h3>
            </div>
          </Link>

          {/* Category 2 */}
          <Link className="group relative overflow-hidden h-64" href="shop.html">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80"
              alt="Fashion"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-bold text-xl">Fashion</h3>
            </div>
          </Link>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category 3 */}
          <Link className="group relative overflow-hidden h-64" href="shop.html">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80"
              alt="Home"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-bold text-xl">Home</h3>
            </div>
          </Link>

          {/* Category 4 */}
          <Link className="group relative overflow-hidden h-64" href="shop.html">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
              alt="Beauty"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-bold text-xl">Beauty</h3>
            </div>
          </Link>
        </div>
      </SwiperSlide>

    </Swiper>
  </div>
  </div>
</section>
      
  {/* Trending Now Section */}
        <section id="Hot-deal" className="py-12 bg-white-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
  <div className="w-full p-[1px] bg-gradient-to-r from-black to-green-500 mb-6">
  <h2 className="text-lg sm:text-xl font-heading font-semibold bg-green text-white px-4 py-1.5 text-left">
    Hot Deals
  </h2>
</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </section>
        {/* Trending Now Section */}
        <section id="trending_now" className="py-12 bg-white-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
  <div className="w-full p-[1px] bg-gradient-to-r from-black to-green-500 mb-6">
  <h2 className="text-lg sm:text-xl font-heading font-semibold bg-green text-white px-4 py-1.5 text-left">
    Trending Now
  </h2>
</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </section>
         </main>
       <Footer />
        </>

    </div>
  );
};

