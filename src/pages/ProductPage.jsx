import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';

export const ProductPage = ({ className, children, variant, contentKey, ...props }) => {
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
                  <Button className="text-slate-400 hover:text-slate-900 transition-colors"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor"strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
                  <Link className="text-slate-400 hover:text-slate-900 transition-colors relative" href="cart.html"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  <Text variant="bold" className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"> 2 </Text></Link>
                </div>
               </div>
            </div>
            </nav>
        </header>
         {/* Mobile Search Bar */}
                <div className="md:hidden px-4 py-3 bg-white border-b border-slate-200">
                  <div className="flex items-center bg-slate-100 rounded-md px-3 py-2">
                    <Icon className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Icon>
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="bg-transparent outline-none text-sm ml-2 w-full"
                    />
                  </div>
                </div>
                <main className="pb-20 md:pb-0">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex text-sm font-medium text-slate-500">
              <Link className="hover:text-slate-900" href="index.html"> Home </Link>
              <Text className="mx-2"> / </Text>
              <Link className="hover:text-slate-900" href="shop.html"> Electronics </Link>
              <Text className="mx-2"> / </Text>
              <Text className="text-slate-900"> Premium Headphones </Text>
            </nav>
          </div>
        </div>
        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                <Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80" alt="Headphones Main" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Button variant="primary" className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden ring-2 ring-green-600"><Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" alt="Thumb 1" /></Button>
                <Button className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden hover:opacity-75"><Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80" alt="Thumb 2" /></Button>
                <Button className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden hover:opacity-75"><Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=200&q=80" alt="Thumb 3" /></Button>
                <Button className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden hover:opacity-75"><Image variant="cover" className="w-full h-full object-center object-cover" src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80" alt="Thumb 4" /></Button>
              </div>
            </div>
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2"> Premium Noise-Cancelling Headphones </h1>
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Icon className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></Icon>
                  <Icon className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></Icon>
                  <Icon className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></Icon>
                  <Icon className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></Icon>
                  <Icon className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></Icon>
                </div>
                <Text className="ml-2 text-sm text-slate-500"> 128 reviews </Text>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-6"> $299.00 </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                 Experience pure sound with our industry-leading noise cancelling technology. Designed for comfort and built to last, these headphones deliver crystal clear audio whether you're commuting, working, or relaxing. 
              </p>
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3"> Color </h3>
                <div className="flex gap-3">
                  <Button variant="primary" className="w-8 h-8 rounded-full bg-black border border-slate-200 ring-2 ring-offset-2 ring-green-600" />
                  <Button className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-slate-300" />
                  <Button className="w-8 h-8 rounded-full bg-green-900 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-green-300" />
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <div className="w-24">
                  <label htmlFor="quantity" className="sr-only"> Quantity </label>
                  <select id="quantity" className="w-full border border-slate-300 rounded-md py-3 px-3 text-base focus:ring-primary-500 focus:border-primary-500">
                    <option> 1 </option>
                    <option> 2 </option>
                    <option> 3 </option>
                    <option> 4 </option>
                  </select>
                </div>
                <Button variant="primary" contentKey="cta_8" className="flex-1 bg-green-600 text-white py-3 px-8 rounded-md font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"><Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                 Add to Cart </Button>
                <Button className="w-12 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-colors"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
              </div>
              {/* Features List */}
              <div className="border-t border-slate-200 pt-6">
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                     Active Noise Cancellation 
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                     30-hour battery life 
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                     Premium leather ear cushions 
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                     2-year warranty included 
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
        
          <Link href="shop.html" className="flex flex-col items-center text-xs text-slate-600">
            <Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16v16H4z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </Icon>
            Shop
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
        
        