import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContextTemp";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useNavigate } from "react-router-dom";

export const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  // Load shipping address from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) setShippingAddress(JSON.parse(savedAddress));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveShipping = () => {
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    alert("Shipping address saved!");
  };

  const handleProceedToPayment = () => {
    if (!shippingAddress.address || !shippingAddress.city) {
      alert("Please complete your shipping address before proceeding.");
      return;
    }

    console.log("Ready to process payment:", { shippingAddress, paymentMethod, total });
    alert("Proceeding to payment (placeholder)");
  };

  if (cartItems.length === 0) {
    return (
      <div className="font-body text-slate-600 antialiased bg-white min-h-screen">
        <Header />
        <div className="max-w-3xl mx-auto py-24 text-center">
          <Text className="text-lg font-medium text-slate-500">Your cart is empty.</Text>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />
      <div className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Shipping Address Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
              
              {/* Responsive City + ZIP row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP/Postal Code"
                  value={shippingAddress.zip}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
              <Button
                className="bg-green-600 text-white px-4 py-2 font-bold hover:bg-green-700"
                onClick={handleSaveShipping}
              >
                Save Shipping Address
              </Button>
            </div>

            {/* Payment Section */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit/Debit Card
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  PayPal
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 bg-slate-50 rounded-lg p-6 border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <Text>{item.name} x {item.quantity}</Text>
                  <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 space-y-2">
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
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <Text>Total</Text>
                <Text>${total.toFixed(2)}</Text>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 text-white py-3 mt-6 font-bold hover:bg-green-700"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};