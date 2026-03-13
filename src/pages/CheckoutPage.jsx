// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContextTemp";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useNavigate } from "react-router-dom";
import PaymentSuccessModal from "../components/PaymentSuccessModal";

// Currency helpers
const formatCurrency = (amount, currency = "NGN") => {
  const currencySymbols = { NGN: "₦", USD: "$", EUR: "€" };
  return `${currencySymbols[currency] || currency} ${amount.toLocaleString()}`;
};

const convertPrice = (amount, targetCurrency = "NGN") => {
  const rates = { NGN: 1, USD: 0.0026, EUR: 0.0023 };
  return amount * (rates[targetCurrency] || 1);
};

// Generate order ID
const generateOrderId = () => `ORD${Date.now()}`;

export const CheckoutPage = ({ userCurrency = "NGN" }) => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + convertPrice(item.price, userCurrency) * item.quantity,
    0
  );

  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Load logged-in user
  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(userRaw);
    } catch {
      user = { email: userRaw };
    }

    setShippingAddress((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));
  }, [navigate]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save address
  const handleSaveShipping = () => {
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    alert("Shipping address saved!");
  };

  // Checkout
  const handleProceedToPayment = () => {
    if (!shippingAddress.address || !shippingAddress.city) {
      alert("Please complete your shipping address.");
      return;
    }

    const existingOrders =
      JSON.parse(localStorage.getItem("user_orders")) || [];

    const generatedId = generateOrderId();

    const newOrders = cartItems.map((item) => ({
      id: generatedId,
      userName: shippingAddress.name,
      contact: shippingAddress.email,
      productName: item.name,
      brand: item.brand || "Generic",
      price: convertPrice(item.price, userCurrency),
      quantity: item.quantity,
      description: item.description || "Product order",
      status: "Pending",
      createdAt: new Date().toISOString(),
      expectedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    const updatedOrders = [...existingOrders, ...newOrders];

    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));

    clearCart();

    setOrderId(generatedId);
    setShowSuccess(true);
  };

  // Show empty cart only if success modal not open
  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="font-body text-slate-600 bg-white min-h-screen">
        <Header />
        <div className="max-w-3xl mx-auto py-24 text-center">
          <Text className="text-lg text-slate-500">
            Your cart is empty.
          </Text>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-body text-slate-600 bg-white">
      <Header />

      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Shipping Address */}
          <div className="lg:col-span-7 bg-white border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />

                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={shippingAddress.zip}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <Button
                className="bg-green-600 text-white px-4 py-2"
                onClick={handleSaveShipping}
              >
                Save Shipping Address
              </Button>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit / Debit Card
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 bg-slate-50 rounded-lg p-6 border sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <Text>
                    {item.name} x {item.quantity}
                  </Text>
                  <Text>
                    {formatCurrency(
                      convertPrice(item.price, userCurrency) *
                        item.quantity,
                      userCurrency
                    )}
                  </Text>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <Text>Subtotal</Text>
                <Text>{formatCurrency(subtotal)}</Text>
              </div>

              <div className="flex justify-between">
                <Text>Shipping</Text>
                <Text className="text-green-600">Free</Text>
              </div>

              <div className="flex justify-between">
                <Text>Tax</Text>
                <Text>{formatCurrency(tax)}</Text>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <Text>Total</Text>
                <Text>{formatCurrency(total)}</Text>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 text-white py-3 mt-6"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      <PaymentSuccessModal
        open={showSuccess}
        orderId={orderId}
        onClose={() => setShowSuccess(false)}
      />

      <Footer />
    </div>
  );
};