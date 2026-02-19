import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <>
        {/* Announcement Bar */}
        <div className="bg-green-900 text-white text-xs font-medium py-2 text-center tracking-wide"> FREE SHIPPING ON ALL ORDERS OVER $50 </div>
        {/* Navigation */}
        <header>
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
               <div className="flex-shrink-0 flex items-center">
               <Link className="flex items-center gap-2 font-heading font-bold text-2xl text-slate-900 tracking-tight" href="index.html">
               <img src="/lantalogo1.jpg" alt="Lanta Logo" className="h-12 w-auto" />Lanta Express
               <Text className="text-green-600">.</Text>
               </Link>
               </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                  <Link className="text-slate-900 font-medium hover:text-green-600 transition-colors" href="index.html"> Home </Link>
                  <Link className="text-slate-500 font-medium hover:text-green-600 transition-colors" href="shop.html"> Shop </Link>
                  <Link className="text-slate-500 font-medium hover:text-green-600 transition-colors" href="#"> New Arrivals </Link>
                  <Link className="text-slate-500 font-medium hover:text-green-600 transition-colors" href="#"> About </Link>
                </div>
                {/* Icons */}
                <div className="flex items-center space-x-6">
                  {/* Mobile Toggle */}
                  <Button className="text-slate-400 hover:text-slate-900 transition-colors"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
                  <Link className="text-slate-400 hover:text-slate-900 transition-colors relative" href="cart.html"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor"strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  <Text variant="bold" className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"> 2 </Text></Link>
                </div>
                <Button variant="outline" className="md:hidden p-2 text-current focus:outline-none" type="button" id="mobile-menu-toggle"><Icon className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16"stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
              </div>
            </div>
            {/* Mobile Menu */}
            <div id="mobile-menu" className="hidden md:hidden absolute top-full left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-4 z-50">
              <Link className="text-slate-900 font-medium hover:text-green-600 transition-colors block w-full" href="index.html"> Home </Link>
              <Link className="text-slate-500 font-medium hover:text-green-600 transition-colors block w-full" href="shop.html"> Shop </Link>
              <Link className="text-slate-500 font-medium hover:text-green-600 transition-colors block w-full" href="#"> New Arrivals </Link>
              <Link className="text-slate-500 font-medium hover:text-green-600 transition-colors block w-full" href="#"> About </Link>
            </div>
          </nav>
        </header>
        {/* Hero Section */}
        <section id="hero" className="relative bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-slate-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div data-aos="fade-up" className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl font-heading">
                    <Text className="block xl:inline"> Your Marketplace, </Text>
                    <Text className="block text-green-600 xl:inline"> Your Way </Text>
                  </h1>
                  <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                     Connect with buyers, sell with ease, and let Lanta Express handle the logistics from pickup to delivery. 
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link contentKey="cta_19" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg transition-colors" href="shop.html"> Shop Collection </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link contentKey="cta_20" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg transition-colors" href="#"> Book a Pickup </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <Image variant="cover" className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Woman shopping" />
          </div>
        </section>
        {/* Shop By Category */}
        <section id="shop_by_category" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8"> Shop by Category </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category 1 */}
              <Link className="group relative rounded-lg overflow-hidden h-64" href="shop.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" alt="Electronics" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white font-bold text-xl"> Electronics </h3>
              </div></Link>
              {/* Category 2 */}
              <Link className="group relative rounded-lg overflow-hidden h-64" href="shop.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80" alt="Fashion" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6"><h3 className="text-white font-bold text-xl"> Fashion </h3></div></Link>
              {/* Category 3 */}
              <Link className="group relative rounded-lg overflow-hidden h-64" href="shop.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80" alt="Home" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6"><h3 className="text-white font-bold text-xl"> Home </h3></div></Link>
              {/* Category 4 */}
              <Link className="group relative rounded-lg overflow-hidden h-64" href="shop.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80" alt="Beauty" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6"><h3 className="text-white font-bold text-xl"> Beauty </h3></div></Link>
            </div>
          </div>
        </section>
        {/* Trending Now */}
        <section id="trending_now" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-heading font-bold text-slate-900"> Trending Now </h2>
              <Link className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1" href="shop.html"> View all 
              <Text> → </Text></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Product 1 */}
              <div data-aos="fade-up" data-aos-delay="0" className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative">
                  <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80" alt="Headphones" />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
                    <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  </div>
                </div>
                <h3 className="mt-4 text-sm text-slate-700 font-medium"> Premium Noise-Cancelling Headphones </h3>
                <p className="mt-1 text-lg font-bold text-slate-900"> $299.00 </p>
                <Button contentKey="cta_21" className="mt-3 w-full bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"> Add to Cart </Button>
              </div>
              {/* Product 2 */}
              <div data-aos="fade-up" data-aos-delay="100" className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative">
                  <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" alt="Watch" />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
                    <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  </div>
                </div>
                <h3 className="mt-4 text-sm text-slate-700 font-medium"> Minimalist Analog Watch </h3>
                <p className="mt-1 text-lg font-bold text-slate-900"> $149.00 </p>
                <Button contentKey="cta_22" className="mt-3 w-full bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"> Add to Cart </Button>
              </div>
              {/* Product 3 */}
              <div data-aos="fade-up" data-aos-delay="200" className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative">
                  <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" alt="Sneakers" />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
                    <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  </div>
                </div>
                <h3 className="mt-4 text-sm text-slate-700 font-medium"> Urban Runner Sneakers </h3>
                <p className="mt-1 text-lg font-bold text-slate-900"> $129.00 </p>
                <Button contentKey="cta_23" className="mt-3 w-full bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"> Add to Cart </Button>
              </div>
              {/* Product 4 */}
              <div data-aos="fade-up" data-aos-delay="300" className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative">
                  <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80" alt="Bag" />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
                    <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  </div>
                </div>
                <h3 className="mt-4 text-sm text-slate-700 font-medium"> Leather Crossbody Bag </h3>
                <p className="mt-1 text-lg font-bold text-slate-900"> $89.00 </p>
                <Button contentKey="cta_24" className="mt-3 w-full bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"> Add to Cart </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Free Shipping On Orders Over 50 */}
        <section id="free_shipping_on_orders_over_50" className="bg-green-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-2xl font-heading font-bold text-white mb-2"> Free Shipping on Orders Over $50 </h2>
              <p className="text-primary-100">
                 Upgrade your wardrobe without the extra cost. Limited time offer. 
              </p>
            </div>
            <Link contentKey="cta_25" className="bg-white text-green-600 px-8 py-3 rounded-md font-bold hover:bg-slate-100 transition-colors shadow-lg" href="shop.html"> Start Shopping </Link>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-12">
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
    </div>
  );
};

