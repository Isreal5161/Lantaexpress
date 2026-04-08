import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useCart } from '../context/CartContextTemp';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/Button';
import { Image } from '../components/Image';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

const resolveShippingMethod = (value) => (value === "home_delivery" ? "home_delivery" : "pickup_station");
const formatShippingMethodLabel = (value) =>
  resolveShippingMethod(value) === "home_delivery" ? "Home Delivery" : "Pickup Station";
const getItemShippingFee = (item = {}) => {
  const shippingMethod = resolveShippingMethod(item.selectedShippingMethod || item.shippingMethod);
  const rawFee = shippingMethod === "home_delivery" ? item.homeDeliveryFee : item.pickupStationFee;
  return Math.max(Number(rawFee) || 0, 0);
};

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

const paymentMethodLogos = [
  { id: 'opay', label: 'OPay', src: '/payment-logos/opay-logo.png', className: 'bg-[#052d2b]' },
  { id: 'palmpay', label: 'PalmPay', src: '/payment-logos/palmpay-logo.png', className: 'bg-white' },
  { id: 'paystack', label: 'Paystack', src: '/payment-logos/paystack-logo.svg', className: 'bg-white' },
  { id: 'visa', label: 'Visa', src: '/payment-logos/visa-logo.svg', className: 'bg-white' },
  { id: 'mastercard', label: 'Mastercard', src: '/payment-logos/mastercard-logo.svg', className: 'bg-white' },
];

export const CartPage = ({ userCurrency = "NGN" }) => {
  const { cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [recentWishlistCartActionId, setRecentWishlistCartActionId] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + convertPrice(item.price, userCurrency) * item.quantity,
    0
  );
  const shipping = cartItems.reduce(
    (sum, item) => sum + convertPrice(getItemShippingFee(item), userCurrency),
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const cartUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const userRaw = localStorage.getItem("currentUser") || localStorage.getItem("user");
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
      JSON.stringify({ user, cartItems, subtotal, shipping, tax, total, shouldClearCart: true, checkoutSource: "cart" })
    );

    navigate("/checkout");
  };

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item.cartKey || item.id);
  };

  const handleWishlistAddToCart = (item) => {
    setRecentWishlistCartActionId(String(item.id));
    addToCart(item);
  };

  useEffect(() => {
    if (!recentWishlistCartActionId) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setRecentWishlistCartActionId(null);
    }, 650);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recentWishlistCartActionId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f1] font-body text-slate-600 antialiased">
      <Header />

      <div className="flex-1 pb-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="rounded-[32px] border border-[#e6e3d9] bg-[linear-gradient(135deg,#fffdf8_0%,#f2f0e8_100%)] p-6 shadow-sm sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Shopping Bag</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-3xl">Cart</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Review your items, adjust quantities, and keep products you like inside your wishlist for later.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Cart items</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{cartUnits}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Wishlist</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{wishlistItems.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Cart Summary</p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">Your items</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {cartItems.length} product{cartItems.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
                    <p className="mt-2 text-sm text-slate-500">Add products from your wishlist or continue shopping to build your order.</p>
                    <RouterLink
                      to="/shop"
                      className="mt-5 inline-flex rounded-full bg-[#f68b1e] px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#df7d18]"
                    >
                      Continue shopping
                    </RouterLink>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-200">
                    {cartItems.map((item) => (
                      <li key={item.cartKey || item.id} className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row">
                          <RouterLink to={`/product/${item.id}`} className="h-28 w-full overflow-hidden rounded-3xl bg-slate-100 sm:w-28">
                            <Image
                              preset="thumb"
                              variant="cover"
                              className="h-full w-full object-cover"
                              src={item.image}
                              alt={item.name}
                            />
                          </RouterLink>

                          <div className="flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <RouterLink to={`/product/${item.id}`} className="text-lg font-bold leading-7 text-slate-900 transition hover:text-green-700">
                                  {item.name}
                                </RouterLink>
                                <p className="mt-1 text-sm text-slate-500">{item.brand || 'LantaXpress'}{item.color ? ` • ${item.color}` : ''}</p>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                                    {formatShippingMethodLabel(item.selectedShippingMethod)}
                                  </span>
                                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getItemShippingFee(item) > 0 ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {getItemShippingFee(item) > 0 ? formatCurrency(convertPrice(getItemShippingFee(item), userCurrency), userCurrency) : 'Free shipping'}
                                  </span>
                                </div>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-xl font-bold text-slate-900">
                                  {formatCurrency(convertPrice(item.price, userCurrency) * item.quantity, userCurrency)}
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                  {formatCurrency(convertPrice(item.price, userCurrency), userCurrency)} each
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                                <button
                                  type="button"
                                  className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
                                  onClick={() => decreaseQuantity(item.cartKey || item.id)}
                                >
                                  -
                                </button>
                                <Text className="min-w-[3rem] text-center text-sm font-semibold text-slate-900">
                                  {item.quantity}
                                </Text>
                                <button
                                  type="button"
                                  className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
                                  onClick={() => increaseQuantity(item.cartKey || item.id)}
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleMoveToWishlist(item)}
                                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
                                >
                                  Move to wishlist
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartKey || item.id)}
                                  className="rounded-full border border-red-100 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Wishlist</p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">Saved for later</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="px-6 py-12 text-center text-sm text-slate-500">
                    Your wishlist is empty. Tap the heart icon on any product card or product page to save it here.
                  </div>
                ) : (
                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <RouterLink to={`/product/${item.id}`} className="block overflow-hidden rounded-2xl bg-white">
                          <Image
                            preset="card"
                            variant="contain"
                            className="h-44 w-full object-contain p-3"
                            src={item.image}
                            alt={item.name}
                          />
                        </RouterLink>
                        <div className="mt-4">
                          <RouterLink to={`/product/${item.id}`} className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900 transition hover:text-green-700">
                            {item.name}
                          </RouterLink>
                          <p className="mt-2 text-lg font-bold text-slate-900">
                            {formatCurrency(convertPrice(item.price, userCurrency), userCurrency)}
                          </p>
                        </div>

                        {(() => {
                          const isWishlistItemInCart = cartItems.some((cartItem) => String(cartItem.id) === String(item.id));
                          const isAnimating = recentWishlistCartActionId === String(item.id);

                          return (
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleWishlistAddToCart(item)}
                            className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.05em] transition ${
                              isWishlistItemInCart
                                ? `bg-slate-900 text-white ${isAnimating ? 'scale-[1.02] shadow-lg shadow-slate-300' : 'hover:bg-slate-800'}`
                                : `bg-[#f68b1e] text-white ${isAnimating ? 'scale-[1.02] shadow-lg shadow-[#f68b1e]/25' : 'hover:bg-[#df7d18]'}`
                            }`}
                          >
                            {isWishlistItemInCart ? (isAnimating ? 'Added' : 'In Cart') : (isAnimating ? 'Added' : 'Add to Cart')}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-5">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
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
                        <Text className={shipping > 0 ? "font-medium text-slate-900" : "text-green-600 font-medium"}>
                          {shipping > 0 ? formatCurrency(shipping, userCurrency) : 'Free'}
                        </Text>
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
                    className="w-full rounded-2xl bg-[#f68b1e] py-4 font-bold uppercase tracking-[0.04em] text-white transition-colors hover:bg-[#df7d18] shadow-lg shadow-[#f68b1e]/20"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                )}

                {cartItems.length === 0 && wishlistItems.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => handleWishlistAddToCart(wishlistItems[0])}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:text-green-700"
                  >
                    Add first wishlist item to cart
                  </button>
                ) : null}

                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  Delivery fees are calculated from each product's selected delivery option and shown again during checkout.
                </div>
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm text-center">
                  <p className="text-xs text-slate-500 mb-2">We accept</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {paymentMethodLogos.map((paymentMethod) => (
                      <div
                        key={paymentMethod.id}
                        className={`flex h-12 w-[4.5rem] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 px-3 shadow-sm ${paymentMethod.className}`}
                        aria-label={paymentMethod.label}
                        title={paymentMethod.label}
                      >
                        <span className="sr-only">{paymentMethod.label}</span>
                        <img src={paymentMethod.src} alt={paymentMethod.label} className="max-h-6 w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};