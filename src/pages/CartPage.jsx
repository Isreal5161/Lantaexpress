import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';

export const CartPage = ({ className, children, variant, contentKey, ...props }) => {
  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <>
        {/* Navigation (Same as Index) */}
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
                  <Button className="text-slate-400 hover:text-slate-900 transition-colors"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
                  <Link className="text-slate-400 hover:text-slate-900 transition-colors relative" href="cart.html"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  <Text variant="bold" className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"> 2 </Text></Link>
                </div>
                <Button variant="outline" className="md:hidden p-2 text-current focus:outline-none" type="button" id="mobile-menu-toggle"><Icon className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor"strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
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
        {/* Cart Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-8"> Shopping Cart </h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <ul className="divide-y divide-slate-200">
                  {/* Item 1 */}
                  <li className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" alt="Headphones" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            <Link href="product.html"> Premium Noise-Cancelling Headphones </Link>
                          </h3>
                          <p className="text-sm text-slate-500 mt-1"> Color: Black </p>
                        </div>
                        <p className="text-lg font-bold text-slate-900"> $299.00 </p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-slate-300 rounded-md">
                          <Button contentKey="cta_9" className="px-3 py-1 text-slate-600 hover:bg-slate-50"> - </Button>
                          <Text className="px-2 py-1 text-slate-900 font-medium text-sm"> 1 </Text>
                          <Button contentKey="cta_10" className="px-3 py-1 text-slate-600 hover:bg-slate-50"> + </Button>
                        </div>
                        <Button className="text-sm text-red-500 hover:text-red-700 font-medium"> Remove </Button>
                      </div>
                    </div>
                  </li>
                  {/* Item 2 */}
                  <li className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" alt="Watch" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900"><Link href="#"> Minimalist Analog Watch </Link></h3>
                          <p className="text-sm text-slate-500 mt-1"> Color: Silver </p>
                        </div>
                        <p className="text-lg font-bold text-slate-900"> $149.00 </p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-slate-300 rounded-md">
                          <Button contentKey="cta_11" className="px-3 py-1 text-slate-600 hover:bg-slate-50"> - </Button>
                          <Text className="px-2 py-1 text-slate-900 font-medium text-sm"> 1 </Text>
                          <Button contentKey="cta_12" className="px-3 py-1 text-slate-600 hover:bg-slate-50"> + </Button>
                        </div>
                        <Button className="text-sm text-red-500 hover:text-red-700 font-medium"> Remove </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6"> Order Summary </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <Text> Subtotal </Text>
                    <Text> $448.00 </Text>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <Text> Shipping </Text>
                    <Text className="text-green-600 font-medium"> Free </Text>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <Text> Tax </Text>
                    <Text> $35.84 </Text>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                    <Text> Total </Text>
                    <Text> $483.84 </Text>
                  </div>
                </div>
                <Button variant="primary" contentKey="cta_13" className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"> Proceed to Checkout </Button>
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500 mb-2"> We accept </p>
                  <div className="flex justify-center gap-2 opacity-50">
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer (Same as Index) */}
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
                  <Button variant="primary" contentKey="cta_14" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition-colors"> Subscribe </Button>
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

