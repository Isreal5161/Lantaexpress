// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContextTemp';
import { Button } from '../components/Button';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { FaPaypal, FaCreditCard } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { useNavigate } from "react-router-dom";

// Helper for formatting currency dynamically
const formatCurrency = (amount, currency = "NGN") => {
  const currencySymbols = { NGN: "₦", USD: "$", EUR: "€" };
  return `${currencySymbols[currency] || currency} ${amount.toLocaleString()}`;
};

// Optional: simple conversion rates
const convertPrice = (amount, targetCurrency = "NGN") => {
  const rates = { NGN: 1, USD: 0.0026, EUR: 0.0023 };
  return amount * (rates[targetCurrency] || 1);
};

export const CartPage = ({ userCurrency = "NGN" }) => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + convertPrice(item.price, userCurrency) * item.quantity,
    0
  );
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    const userRaw = localStorage.getItem("user");
    let user = null;

    if (!userRaw) {
      navigate("/login");
      return;
    }

    try {
      user = JSON.parse(userRaw);
      if (!user || typeof user !== "object") user = { email: userRaw };
    } catch {
      user = { email: userRaw };
    }

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({ user, cartItems, subtotal, shipping, tax, total })
    );

    navigate("/checkout");
  };

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-200">
                  {cartItems.length === 0 ? (
                    <div className="py-12 flex justify-center items-center text-slate-500 text-lg font-medium">
                      Your cart is empty.
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                          <Image
                            variant="cover"
                            className="w-full h-full object-center object-cover"
                            src={item.image}
                            alt={item.name}
                          />
                        </div>
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
                              {formatCurrency(
                                convertPrice(item.price, userCurrency) * item.quantity,
                                userCurrency
                              )}
                            </p>
                          </div>

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

            <div className="lg:col-span-4">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.length === 0 ? (
                    <Text className="text-slate-500">Your cart is empty.</Text>
                  ) : (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <Text>Subtotal</Text>
                        <Text>{formatCurrency(subtotal, userCurrency)}</Text>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <Text>Shipping</Text>
                        <Text className="text-green-600 font-medium">Free</Text>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <Text>Tax</Text>
                        <Text>{formatCurrency(tax, userCurrency)}</Text>
                      </div>
                      <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                        <Text>Total</Text>
                        <Text>{formatCurrency(total, userCurrency)}</Text>
                      </div>
                    </>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <Button
                    variant="primary"
                    className="w-full bg-green-600 text-white py-3 font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                )}

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500 mb-2">We accept</p>
                  <div className="flex justify-center gap-3 text-2xl text-slate-700 opacity-80">
                    <FaPaypal className="text-blue-600" />
                    <FaCreditCard className="text-gray-700" />
                    <SiVisa className="text-blue-700" />
                    <SiMastercard className="text-red-600" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};