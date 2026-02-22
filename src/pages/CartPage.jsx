import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
export const CartPage = ({ className, children, variant, contentKey, ...props }) => {
  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <>
        <Header />
        {/* Cart Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-8"> Shopping Cart </h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-200">
                  {/* Item 1 */}
                  <li className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
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
                        <div className="flex items-center border border-slate-300">
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
                    <div className="w-full sm:w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
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
                        <div className="flex items-center border border-slate-300">
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
                <Button variant="primary" contentKey="cta_13" className="w-full bg-green-600 text-white py-3 font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"> Proceed to Checkout </Button>
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500 mb-2"> We accept </p>
                  <div className="flex justify-center gap-2 opacity-50">
                    <div className="w-8 h-5 bg-slate-300 "></div>
                    <div className="w-8 h-5 bg-slate-300 "></div>
                    <div className="w-8 h-5 bg-slate-300 "></div>
                    <div className="w-8 h-5 bg-slate-300 "></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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


