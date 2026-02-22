import React from 'react';
import { CartContext } from "../context/CartContextTemp";
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Header } from '../components/header';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
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
    <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">Shop by Category</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
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
  </div>
</section>
      
{/* Trending Now Product Section */}
<section id="trending_now" className="py-12 bg-slate-50">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
    
    <div className="flex justify-between items-end mb-6">
      <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
        Trending Now
      </h2>
      <Link
        className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1 text-sm"
        href="shop.html"
      >
        View all <span>→</span>
      </Link>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">

      {/* Product 1 */}
      <div className="group">
        <div className="relative w-full border border-gray-200 overflow-hidden">
          <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
              alt="Headphones"
            />
          </div>

          <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
            <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Icon>
          </div>
        </div>

        <h3 className="mt-2 text-xs text-slate-700 font-medium px-1">
          Premium Noise-Cancelling Headphones
        </h3>

        <p className="mt-1 text-base font-semibold text-slate-900 px-1">
          $299.00
        </p>

        <Button className="w-full bg-white text-black border-t text-sm py-2 mt-2">
          Add to Cart
        </Button>
      </div>


      {/* Product 2 */}
      <div className="group">
        <div className="relative w-full border border-gray-200 overflow-hidden">
          <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
              alt="Watch"
            />
          </div>

          <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
            <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Icon>
          </div>
        </div>

        <h3 className="mt-2 text-xs text-slate-700 font-medium px-1">
          Minimalist Analog Watch
        </h3>

        <p className="mt-1 text-base font-semibold text-slate-900 px-1">
          $149.00
        </p>

        <Button className="w-full bg-white text-black border-t text-sm py-2 mt-2">
          Add to Cart
        </Button>
      </div>


      {/* Product 3 */}
      <div className="group">
        <div className="relative w-full border border-gray-200 overflow-hidden">
          <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
              alt="Sneakers"
            />
          </div>

          <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
            <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Icon>
          </div>
        </div>

        <h3 className="mt-2 text-xs text-slate-700 font-medium px-1">
          Urban Runner Sneakers
        </h3>

        <p className="mt-1 text-base font-semibold text-slate-900 px-1">
          $129.00
        </p>

        <Button className="w-full bg-white text-black border-t text-sm py-2 mt-2">
          Add to Cart
        </Button>
      </div>


      {/* Product 4 */}
      <div className="group">
        <div className="relative w-full border border-gray-200 overflow-hidden">
          <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden">
            <Image
              variant="cover"
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
              alt="Bag"
            />
          </div>

          <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
            <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Icon>
          </div>
        </div>

        <h3 className="mt-2 text-xs text-slate-700 font-medium px-1">
          Leather Crossbody Bag
        </h3>

        <p className="mt-1 text-base font-semibold text-slate-900 px-1">
          $89.00
        </p>

        <Button className="w-full bg-white text-black border-t text-sm py-2 mt-2">
          Add to Cart
        </Button>
      </div>

    </div>
  </div>
</section>

        {/* Free Shipping On Orders Over 50 */}
        <section id="free_shipping_on_orders_over_50" className="bg-green-600 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-2xl font-heading font-bold text-white mb-2"> Free Shipping on Orders Over $50 </h2>
              <p className="text-primary-100">
                 Upgrade your wardrobe without the extra cost. Limited time offer. 
              </p>
            </div>
            <Link contentKey="cta_25" className="bg-white text-green-600 px-8 py-3 font-bold hover:bg-slate-100 transition-colors shadow-lg" href="shop.html"> Start Shopping </Link>
          </div>
        </section>
        </main>
        {/* Footer */}
       <footer className="hidden md:block bg-slate-900 text-slate-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-1">
                <Link className="font-heading font-bold text-2xl text-white tracking-tight mb-4 block" href="#"> Lanta Express 
                <Text className="text-green-500"> . </Text></Link>
                <p className="text-sm text-slate-400">
                   Your destination for modern lifestyle essentials. Quality, style, and sustainability in every product. 
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4"> Shop </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> New Arrivals </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Best Sellers </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Sale </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Logistics </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4"> Support </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Help Center </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Shipping & Returns </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Size Guide </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition-colors" href="#"> Contact Us </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4"> Stay in the loop </h4>
                <form className="flex gap-2">
                  <input placeholder="Enter your email" type="email" className="bg-slate-800 border-none rounded-md px-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-500" />
                  <Button variant="primary" contentKey="cta_26" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition-colors"> Subscribe </Button>
                </form>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500"> © 2026 Lanta Express Store. All rights reserved. </div>
          </div>
        </footer>
      </>
      {/* Mobile Bottom Navigation */}
<div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-2 z-50">
<Link href="logistics.html" className="flex flex-col items-center text-xs text-slate-600">
  <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7h11v8H3V7zm11 3h4l3 3v2h-7v-5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="2" />
  </Icon>
  Logistics
</Link>
  

  <Link href="shop.html" className="flex flex-col items-center text-xs text-slate-600">
    <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16v16H4z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Icon>
    Shop
  </Link>
 
<Link href="index.html" className="flex flex-col items-center text-xs text-slate-600">
    <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M3 12l9-9 9 9M4 10v10h16V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
    Home
  </Link>
  <Link href="cart.html" className="flex flex-col items-center text-xs text-slate-600">
    <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M6 6h15l-1.5 9h-13z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Icon>
    Cart
  </Link>

  <Link href="#" className="flex flex-col items-center text-xs text-slate-600">
    <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 12c2.7 0 5-2.3 5-5S14.7 2 12 2 7 4.3 7 7s2.3 5 5 5zM2 22c0-5 4-8 10-8s10 3 10 8"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Icon>
    Account
  </Link>

</div>

    </div>
  );
};

