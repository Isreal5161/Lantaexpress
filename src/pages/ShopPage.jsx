import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Input } from '../components/Input';
import { Link } from '../components/Link';
import { Text } from '../components/Text';

export const ShopPage = ({ className, children, variant, contentKey, ...props }) => {
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
                  <Link className="text-slate-400 hover:text-slate-900 transition-colors relative" href="cart.html"><Icon className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor"strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
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
{/* Breadcrumb with banner starting after some space */}
<div className="bg-slate-50 border-b border-slate-200">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
    
    {/* Breadcrumb links */}
    <nav className="flex text-sm font-medium text-slate-500">
      <Link className="hover:text-slate-900" href="index.html"> Home </Link>
      <span className="mx-2"> / </span>
      <span className="text-slate-900"> Shop </span>
    </nav>

    {/* Banner with controlled spacing */}
    <div className="ml-20">
      <img 
        src="/latanexpress-design.jpg" 
        alt="Banner" 
        className="h-12 w-[1000px] object-cover"
      />
    </div>
    
  </div>
</div>

<main className="pb-20 md:pb-0">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-4"> Categories </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link className="text-green-600 font-bold" href="#"> All Products </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Electronics </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Fashion </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Home & Living </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Beauty </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Accessories </Link>
                  </li>
                </ul>
              </div>
              {/* Price Range */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-4"> Price Range </h3>
                <div className="flex items-center gap-4 mb-4">
                  <Input variant="text" className="w-full border border-slate-300 rounded px-3 py-2 text-sm" type="number" placeholder="Min" />
                  <Text className="text-slate-400"> - </Text>
                  <Input variant="text" className="w-full border border-slate-300 rounded px-3 py-2 text-sm" type="number" placeholder="Max" />
                </div>
                <Input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" type="range" />
              </div>
              {/* Colors */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-4"> Colors </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" className="w-6 h-6 rounded-full bg-black border border-slate-200 ring-2 ring-offset-2 ring-primary-600" />
                  <Button className="w-6 h-6 rounded-full bg-white border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-slate-300" />
                  <Button className="w-6 h-6 rounded-full bg-blue-500 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-blue-300" />
                  <Button className="w-6 h-6 rounded-full bg-red-500 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-red-300" />
                  <Button className="w-6 h-6 rounded-full bg-green-500 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-green-300" />
                </div>
              </div>
            </aside>
            {/* Product Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-slate-500">
                   Showing 
                  <Text variant="bold" className="font-bold text-slate-900"> 1-9 </Text>
                   of 
                  <Text variant="bold" className="font-bold text-slate-900"> 24 </Text>
                   results 
                </p>
                <select className="border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
                  <option> Sort by: Featured </option>
                  <option> Price: Low to High </option>
                  <option> Price: High to Low </option>
                  <option> Newest Arrivals </option>
                </select>
              </div>
            {/* Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
  {/* Product 1 */}
  <div className="group">
    <Link className="block" href="product.html">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden relative">
        <Image
          variant="cover"
          className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
          alt="Headphones"
        />
        <Text variant="bold" className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1"> SALE </Text>
      </div>
      <h3 className="mt-4 text-sm text-slate-700 font-medium group-hover:text-green-600"> Premium Noise-Cancelling Headphones </h3>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-lg font-bold text-slate-900"> $299.00 </p>
        <p className="text-sm text-slate-400 line-through"> $350.00 </p>
      </div>
    </Link>
    <Button contentKey="cta_15" className="mt-3 w-full bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition-colors"> Add to Cart </Button>
  </div>

  {/* Product 2 */}
  <div className="group">
    <Link className="block" href="product.html">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden relative">
        <Image
          variant="cover"
          className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
          alt="Watch"
        />
      </div>
      <h3 className="mt-4 text-sm text-slate-700 font-medium group-hover:text-green-600"> Minimalist Analog Watch </h3>
      <p className="mt-1 text-lg font-bold text-slate-900"> $149.00 </p>
    </Link>
    <Button contentKey="cta_16" className="mt-3 w-full bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition-colors"> Add to Cart </Button>
  </div>
                {/* Product 3 */}
                <div className="group">
                  <Link className="block" href="product.html">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden relative">
                    <Image variant="cover" 
                    className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
                     alt="Sneakers"
                     />
                  </div>
                  <h3 className="mt-4 text-sm text-slate-700 font-medium group-hover:text-green-600"> Urban Runner Sneakers </h3>
                  <p className="mt-1 text-lg font-bold text-slate-900"> $129.00 </p>
                  </Link>
                  <Button contentKey="cta_17" className="mt-3 w-full bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition-colors"> Add to Cart </Button>
                </div>
                {/* Product 4 */}
                <div className="group">
                  <Link className="block" href="product.html"><div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden relative">
                    <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80" alt="Bag" />
                  </div>
                  <h3 className="mt-4 text-sm text-slate-700 font-medium group-hover:text-green-600"> Leather Crossbody Bag </h3>
                  <p className="mt-1 text-lg font-bold text-slate-900"> $89.00 </p></Link>
                  <Button contentKey="cta_18" className="mt-3 w-full bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition-colors"> Add to Cart </Button>
                </div>
                {/* Product 5 */}
                <div className="group">
                  <Link className="block" href="product.html"><div className="w-full aspect-w-1 aspect-h-1 bg-gray-200overflow-hidden relative">
                    <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80" alt="Camera" />
                  </div>
                  <h3 className="mt-4 text-sm text-slate-700 font-medium group-hover:text-green-600"> Polaroid Instant Camera </h3>
                  <p className="mt-1 text-lg font-bold text-slate-900"> $99.00 </p></Link>
                  <Button contentKey="cta_19" className="mt-3 w-full bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition-colors"> Add to Cart </Button>
                </div>
                {/* Product 6 */}
                <div className="group">
                  <Link className="block" href="product.html"><div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden relative">
                    <Image variant="cover" className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=500&q=80" alt="Plant" />
                  </div>
                  <h3 className="mt-4 text-sm text-slate-700 font-medium group-hover:text-green-600"> Ceramic Plant Pot </h3>
                  <p className="mt-1 text-lg font-bold text-slate-900"> $35.00 </p></Link>
                  <Button contentKey="cta_20" className="mt-3 w-full bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 transition-colors"> Add to Cart </Button>
                </div>
              </div>
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <Link contentKey="cta_21" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-500 hover:bg-slate-50" href="#"> ← </Link>
                  <Link contentKey="cta_22" className="w-10 h-10 flex items-center justify-center  border bg-orange-600 text-white font-bold" href="#"> 1 </Link>
                  <Link contentKey="cta_23" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-700 hover:bg-slate-50" href="#"> 2 </Link>
                  <Link contentKey="cta_24" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-700 hover:bg-slate-50" href="#"> 3 </Link>
                  <Text className="text-slate-400"> ... </Text>
                  <Link contentKey="cta_25" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-700 hover:bg-slate-50" href="#"> 8 </Link>
                  <Link contentKey="cta_26" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-500 hover:bg-slate-50" href="#"> → </Link>
                </nav>
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


