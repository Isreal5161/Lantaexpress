import React from 'react';
import { useCart } from '../context/CartContextTemp';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  // Calculate dynamic totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // free shipping
  const tax = subtotal * 0.08; // example 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

   {/* Cart Content */}
    <div className="pb-24">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {/* Smaller header */}
  <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-8">
    Shopping Cart
  </h1>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

    {/* Cart Items */}
    <div className="lg:col-span-8">
      <div className="bg-white border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {cartItems.length === 0 ? (
            // Center "Your cart is empty" without extra outline/padding
            <div className="py-12 flex justify-center items-center text-slate-500 text-lg font-medium">
              Your cart is empty.
            </div>
          ) : (
            cartItems.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full sm:w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                  <Image
                    variant="cover"
                    className="w-full h-full object-center object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              <Link href="#">{item.name}</Link>
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Color: {item.color || 'Default'}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center border border-slate-300">
                            <Button
                              className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              -
                            </Button>
                            <Text className="px-2 py-1 text-slate-900 font-medium text-sm">
                              {item.quantity}
                            </Text>
                            <Button
                              className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Dynamic Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6"> Order Summary </h2>
              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <Text className="text-slate-500">Your cart is empty.</Text>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <Text>Subtotal</Text>
                      <Text>${subtotal.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <Text>Shipping</Text>
                      <Text className="text-green-600 font-medium">Free</Text>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <Text>Tax</Text>
                      <Text>${tax.toFixed(2)}</Text>
                    </div>
                    <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                      <Text>Total</Text>
                      <Text>${total.toFixed(2)}</Text>
                    </div>
                  </>
                )}
              </div>

              {/* Proceed to Checkout */}
              {cartItems.length > 0 && (
                <Button
                  variant="primary"
                  className="w-full bg-green-600 text-white py-3 font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  Proceed to Checkout
                </Button>
              )}

              {/* Payment Icons */}
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

      <Footer />
    </div>
    </div>
  )
};