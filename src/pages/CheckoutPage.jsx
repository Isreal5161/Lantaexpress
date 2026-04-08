// src/pages/CheckoutPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContextTemp";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useNavigate } from "react-router-dom";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import { createOrders } from "../api/orders";
import { createLogisticsBooking } from "../api/logistics";
import { PageLoadErrorState } from "../components/LoadingSkeletons";
import { getStorefrontSettings, getStorefrontSettingsSnapshot } from "../service/StorefrontService";
import Modal from "../components/Modal";

// Currency helpers
const formatCurrency = (amount, currency = "NGN") => {
  const currencySymbols = { NGN: "₦", USD: "$", EUR: "€" };
  return `${currencySymbols[currency] || currency} ${amount.toLocaleString()}`;
};

const convertPrice = (amount, targetCurrency = "NGN") => {
  const rates = { NGN: 1, USD: 0.0026, EUR: 0.0023 };
  return amount * (rates[targetCurrency] || 1);
};

const NIGERIA_STATE_OPTIONS = [
  "Abia", "Abuja (FCT)", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const STATE_CITY_OPTIONS = {
  "Abuja (FCT)": ["Garki", "Wuse", "Maitama", "Gwarinpa", "Kubwa"],
  Lagos: ["Ikeja", "Lekki", "Yaba", "Surulere", "Ajah"],
  Ogun: ["Abeokuta", "Ijebu Ode", "Sango Ota", "Ilaro", "Sagamu"],
  Oyo: ["Ibadan", "Ogbomoso", "Oyo", "Saki"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Bonny", "Eleme"],
  Edo: ["Benin City", "Ekpoma", "Auchi"],
  Kano: ["Kano", "Wudil", "Gaya"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan"],
};

const PAYMENT_OPTIONS = [
  {
    id: "opay",
    label: "OPay",
    description: "Choose OPay if you want to complete this order with your OPay wallet.",
    badge: "Mobile wallet",
    accent: "text-emerald-600",
  },
  {
    id: "palmpay",
    label: "PalmPay",
    description: "Choose PalmPay if you prefer to pay with your PalmPay account.",
    badge: "Mobile wallet",
    accent: "text-violet-700",
  },
  {
    id: "card",
    label: "Card",
    description: "Pay securely with your debit or credit card during checkout.",
    badge: "Recommended",
    accent: "text-orange-500",
  },
];

const resolveShippingMethod = (value) => (value === "home_delivery" ? "home_delivery" : "pickup_station");
const formatShippingMethodLabel = (value) =>
  resolveShippingMethod(value) === "home_delivery" ? "Home Delivery" : "Pickup Station";
const getItemShippingFee = (item = {}) => {
  const shippingMethod = resolveShippingMethod(item.selectedShippingMethod || item.shippingMethod);
  const rawFee = shippingMethod === "home_delivery" ? item.homeDeliveryFee : item.pickupStationFee;
  return Math.max(Number(rawFee) || 0, 0);
};

const formatDeliveryDate = (daysFromNow) => {
  if (!Number.isFinite(Number(daysFromNow))) {
    return "";
  }

  const date = new Date();
  date.setDate(date.getDate() + Math.max(daysFromNow, 0));
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
};

// Generate order ID
const generateOrderId = () => `ORD${Date.now()}`;

export const CheckoutPage = ({ userCurrency = "NGN" }) => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutOverride] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const storedCheckout = window.localStorage.getItem("checkoutData");
      return storedCheckout ? JSON.parse(storedCheckout) : null;
    } catch {
      return null;
    }
  });

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [savedShippingAddress, setSavedShippingAddress] = useState(null);
  const [isEditingShippingAddress, setIsEditingShippingAddress] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [storefrontSettings, setStorefrontSettings] = useState(() => getStorefrontSettingsSnapshot());
  const [promoCode, setPromoCode] = useState("");
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [notice, setNotice] = useState({
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const logisticsCheckout = checkoutOverride?.checkoutSource === "logistics" ? checkoutOverride?.logisticsBooking : null;
  const isLogisticsCheckout = Boolean(logisticsCheckout?.quote);
  const checkoutItems = useMemo(
    () => {
      if (isLogisticsCheckout) {
        return [
          {
            id: "logistics-booking",
            cartKey: "logistics-booking",
            name: logisticsCheckout.serviceType || "Logistics delivery",
            description: logisticsCheckout.packageDescription || "",
            quantity: 1,
            price: Number(logisticsCheckout.quote?.amount) || 0,
            selectedShippingMethod: "home_delivery",
            isLogistics: true,
            pickupLocation: logisticsCheckout.pickupLocation || null,
            deliveryLocation: logisticsCheckout.deliveryLocation || null,
            pickupAddress: logisticsCheckout.pickupAddress || "",
            deliveryAddress: logisticsCheckout.deliveryAddress || "",
            urgency: logisticsCheckout.urgency || "Standard",
            distanceText: logisticsCheckout.quote?.distanceText || "",
            durationText: logisticsCheckout.quote?.durationText || "",
          },
        ];
      }

      return (checkoutOverride?.cartItems?.length ? checkoutOverride.cartItems : cartItems).map((item) => ({
        ...item,
        selectedShippingMethod: resolveShippingMethod(item.selectedShippingMethod || item.shippingMethod),
      }));
    },
    [cartItems, checkoutOverride?.cartItems, isLogisticsCheckout, logisticsCheckout]
  );
  const shouldClearCart = checkoutOverride?.shouldClearCart ?? true;

  // Totals
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + convertPrice(item.price, userCurrency) * item.quantity,
    0
  );

  const shipping = isLogisticsCheckout
    ? 0
    : checkoutItems.reduce(
        (sum, item) => sum + convertPrice(getItemShippingFee(item), userCurrency),
        0
      );
  const total = subtotal + shipping;
  const hasDeliveryWindow = Number.isFinite(Number(storefrontSettings.deliveryMinDays)) && Number.isFinite(Number(storefrontSettings.deliveryMaxDays));
  const deliveryStarts = formatDeliveryDate(storefrontSettings.deliveryMinDays);
  const deliveryEnds = formatDeliveryDate(storefrontSettings.deliveryMaxDays);
  const cityOptions = useMemo(() => {
    const knownCities = STATE_CITY_OPTIONS[shippingAddress.state] || [];
    if (!shippingAddress.city || knownCities.includes(shippingAddress.city)) {
      return knownCities;
    }

    return [shippingAddress.city, ...knownCities];
  }, [shippingAddress.city, shippingAddress.state]);
  const selectedPaymentOption = PAYMENT_OPTIONS.find((option) => option.id === paymentMethod) || PAYMENT_OPTIONS[0];
  const hasSavedShippingAddress = Boolean(savedShippingAddress);
  const hasShippingAddressChanges = hasSavedShippingAddress
    ? JSON.stringify(shippingAddress) !== JSON.stringify(savedShippingAddress)
    : true;

  const openNotice = (title, message, onClose = null) => {
    setNotice({
      isOpen: true,
      title,
      message,
      onClose,
    });
  };

  const closeNotice = () => {
    const handleClose = notice.onClose;
    setNotice({
      isOpen: false,
      title: "",
      message: "",
      onClose: null,
    });

    if (typeof handleClose === "function") {
      handleClose();
    }
  };

  // Load logged-in user
  useEffect(() => {
    const userRaw = localStorage.getItem("currentUser") || localStorage.getItem("user");
    const savedShippingAddress = localStorage.getItem("shippingAddress");

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

    let parsedShippingAddress = {};
    if (savedShippingAddress) {
      try {
        parsedShippingAddress = JSON.parse(savedShippingAddress) || {};
      } catch {
        parsedShippingAddress = {};
      }
    }

    setShippingAddress((prev) => ({
      ...prev,
      ...parsedShippingAddress,
      name: user.name || "",
      email: user.email || "",
      country: parsedShippingAddress.country || "Nigeria",
    }));

    if (isLogisticsCheckout && logisticsCheckout) {
      setShippingAddress((prev) => ({
        ...prev,
        name: logisticsCheckout.contact?.name || user.name || prev.name,
        email: user.email || prev.email,
        phone: logisticsCheckout.contact?.phone || prev.phone,
        address: logisticsCheckout.deliveryAddress || prev.address,
      }));
    }

    if (Object.keys(parsedShippingAddress).length > 0) {
      const normalizedSavedAddress = {
        ...parsedShippingAddress,
        name: user.name || "",
        email: user.email || "",
        country: parsedShippingAddress.country || "Nigeria",
      };
      setSavedShippingAddress(normalizedSavedAddress);
      setIsEditingShippingAddress(false);
    }
  }, [isLogisticsCheckout, logisticsCheckout, navigate]);

  useEffect(() => {
    let active = true;

    const loadStorefrontSettings = async () => {
      const settings = await getStorefrontSettings();
      if (active) {
        setStorefrontSettings(settings);
      }
    };

    loadStorefrontSettings();

    return () => {
      active = false;
    };
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = (value) => {
    setShippingAddress((prev) => ({
      ...prev,
      state: value,
      city: STATE_CITY_OPTIONS[value]?.includes(prev.city) ? prev.city : (STATE_CITY_OPTIONS[value]?.[0] || ""),
    }));
  };

  // Save address
  const handleSaveShipping = () => {
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.phone) {
      openNotice("Complete Your Address", "Please complete your shipping address with all required fields before saving.");
      return;
    }

    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    setSavedShippingAddress(shippingAddress);
    setIsEditingShippingAddress(false);
    openNotice("Address Saved", "Your shipping address has been saved.");
  };

  const handleEditShipping = () => {
    setIsEditingShippingAddress(true);
  };

  const handleCancelShippingEdit = () => {
    if (savedShippingAddress) {
      setShippingAddress(savedShippingAddress);
      setIsEditingShippingAddress(false);
    }
  };

  // Checkout
  const handleProceedToPayment = async () => {
    if (!isLogisticsCheckout && (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.phone)) {
      openNotice("Complete Your Address", "Please complete your shipping address with all required fields.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      openNotice("Login Required", "Please log in before placing an order.", () => navigate("/login"));
      return;
    }

    setSubmittingOrder(true);
    setOrderError(null);

    try {
      let response;

      if (isLogisticsCheckout && logisticsCheckout) {
        response = await createLogisticsBooking(
          {
            contact: {
              name: logisticsCheckout.contact?.name || shippingAddress.name,
              email: shippingAddress.email,
              phone: logisticsCheckout.contact?.phone || shippingAddress.phone,
            },
            serviceType: logisticsCheckout.serviceType,
            urgency: logisticsCheckout.urgency,
            pickupLocation: logisticsCheckout.pickupLocation,
            deliveryLocation: logisticsCheckout.deliveryLocation,
            pickupAddress: logisticsCheckout.pickupAddress,
            deliveryAddress: logisticsCheckout.deliveryAddress,
            packageDescription: logisticsCheckout.packageDescription,
            image: logisticsCheckout.image || "",
            paymentMethod,
          },
          token
        );
      } else {
        response = await createOrders(
          {
            cartItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            currency: userCurrency,
          },
          token
        );

        if (shouldClearCart) {
          clearCart();
        }
      }

      localStorage.removeItem("checkoutData");

      setOrderId(response.trackingId || response.primaryOrderNumber || generateOrderId());
      setShowSuccess(true);
    } catch (error) {
      setOrderError(error);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Show empty cart only if success modal not open
  if (checkoutItems.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-body text-slate-600">
        <Header />
        <div className="flex-1 max-w-3xl mx-auto py-24 text-center">
          <Text className="text-lg text-slate-500">
            Your cart is empty.
          </Text>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-body text-slate-600">
      <Header />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Checkout</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Select Payment</h1>
          </div>
          <div className="hidden rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 sm:block">
            Secure checkout
          </div>
        </div>
      </div>

      <div className="flex-1 pb-18">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">

          {/* Shipping Address */}
          <div className="lg:col-span-7 space-y-6">
            {isLogisticsCheckout ? (
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Logistics Booking</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Review your delivery route before payment</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/logistics/book")}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Edit booking
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Customer</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{logisticsCheckout.contact?.name || shippingAddress.name}</p>
                <p className="mt-1 text-sm text-slate-500">{shippingAddress.email || "Email will be attached at payment"}</p>
                <p className="mt-1 text-sm text-slate-500">{logisticsCheckout.contact?.phone || shippingAddress.phone}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Service</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{logisticsCheckout.serviceType}</p>
                <p className="mt-1 text-sm text-slate-500">Urgency: {logisticsCheckout.urgency}</p>
                <p className="mt-1 text-sm text-slate-500">Distance: {logisticsCheckout.quote?.distanceText || "Calculating"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 px-4 py-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Pickup address</p>
                <p className="mt-2 text-sm text-slate-800">{logisticsCheckout.pickupAddress}</p>
                <p className="mt-1 text-xs text-slate-500">{logisticsCheckout.pickupLocation?.lga || ""} {logisticsCheckout.pickupLocation?.state ? `, ${logisticsCheckout.pickupLocation.state}` : ""}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 px-4 py-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Delivery address</p>
                <p className="mt-2 text-sm text-slate-800">{logisticsCheckout.deliveryAddress}</p>
                <p className="mt-1 text-xs text-slate-500">{logisticsCheckout.deliveryLocation?.lga || ""} {logisticsCheckout.deliveryLocation?.state ? `, ${logisticsCheckout.deliveryLocation.state}` : ""}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 px-4 py-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Package notes</p>
                <p className="mt-2 text-sm text-slate-800">{logisticsCheckout.packageDescription}</p>
              </div>
            </div>
            </section>
            ) : (
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Delivery Address</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Where should we send this order?</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {hasSavedShippingAddress && isEditingShippingAddress ? (
                  <button
                    type="button"
                    onClick={handleCancelShippingEdit}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={hasSavedShippingAddress && !isEditingShippingAddress ? handleEditShipping : handleSaveShipping}
                  className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-green-700 transition hover:border-green-300 hover:bg-green-100"
                >
                  {hasSavedShippingAddress
                    ? (isEditingShippingAddress ? (hasShippingAddressChanges ? "Update Address" : "Saved Address") : "Edit Address")
                    : "Save Address"}
                </button>
              </div>
            </div>

            {hasSavedShippingAddress && !isEditingShippingAddress ? (
              <p className="mt-3 text-sm text-slate-500">This shipping address is saved to your account. Select edit if you want to change it.</p>
            ) : null}

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={handleChange}
                disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={handleChange}
                disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600"
              />
              </div>

              <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">+234</div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600"
                />
              </div>

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleChange}
                disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600"
              />

              <input
                type="text"
                name="zip"
                placeholder="Additional information or nearest landmark"
                value={shippingAddress.zip}
                onChange={handleChange}
                disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={shippingAddress.state}
                  onChange={(event) => handleStateChange(event.target.value)}
                  disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
                >
                  <option value="">Select state</option>
                  {NIGERIA_STATE_OPTIONS.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>

                <select
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
                >
                  <option value="">Select city</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleChange}
                disabled={hasSavedShippingAddress && !isEditingShippingAddress}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-green-600"
              />
            </div>
            </section>
            )}

            {/* Payment Method */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Payment Method</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">Choose how you want to pay</h2>
                </div>
                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:block">
                  Pre-pay now
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {PAYMENT_OPTIONS.map((option) => {
                  const isActive = paymentMethod === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`block cursor-pointer rounded-[24px] border p-4 transition ${
                        isActive
                          ? "border-orange-300 bg-orange-50/60 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.id}
                        checked={isActive}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${isActive ? "border-orange-500" : "border-slate-300"}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-orange-500" : "bg-transparent"}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900">{option.label}</p>
                            <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${option.accent}`}>{option.badge}</span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-500">{option.description}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>

            {orderError ? (
              <div className="mb-6 rounded-xl border border-slate-200 bg-white p-2">
                <PageLoadErrorState error={orderError} onRefresh={handleProceedToPayment} actionLabel="Try again" />
              </div>
            ) : null}

            <div className="mt-5 space-y-4 border-b border-slate-200 pb-5">
              {checkoutItems.map((item) => (
                <div key={item.cartKey || `${item.id}-${item.selectedShippingMethod}`} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text className="line-clamp-2 text-sm font-medium text-slate-700">
                      {item.name}
                    </Text>
                    <Text className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">
                      Qty {item.quantity}
                    </Text>
                    {item.isLogistics ? (
                      <Text className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700">
                        {item.urgency} • {item.distanceText || "Quoted route"}
                      </Text>
                    ) : (
                      <Text className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700">
                        {formatShippingMethodLabel(item.selectedShippingMethod)}
                        {getItemShippingFee(item) > 0 ? ` • ${formatCurrency(convertPrice(getItemShippingFee(item), userCurrency), userCurrency)}` : " • Free"}
                      </Text>
                    )}
                  </div>
                  <Text className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatCurrency(
                      convertPrice(item.price, userCurrency) *
                        item.quantity,
                      userCurrency
                    )}
                  </Text>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-5">
              <div className="flex justify-between text-sm">
                <Text className="text-slate-500">{isLogisticsCheckout ? "Logistics total" : `Item total (${checkoutItems.length})`}</Text>
                <Text className="font-semibold text-slate-900">{formatCurrency(subtotal)}</Text>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <div>
                  <Text className="text-slate-500">{isLogisticsCheckout ? "Route extras" : "Delivery fees"}</Text>
                  <button
                    type="button"
                    onClick={() => setShowShippingDetails(true)}
                    className="mt-1 block text-xs font-semibold text-green-700 transition hover:text-green-800 hover:underline"
                  >
                    Details
                  </button>
                </div>
                <Text className={`font-semibold ${shipping > 0 ? "text-slate-900" : "text-green-600"}`}>
                  {shipping > 0 ? formatCurrency(shipping, userCurrency) : "Included"}
                </Text>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <Text className="text-slate-900">Total</Text>
                  <Text className="text-slate-900">{formatCurrency(total, userCurrency)}</Text>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Enter code here"
                className="min-w-0 rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
              <button
                type="button"
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-400"
                disabled
              >
                Apply
              </button>
            </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Selected method</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{selectedPaymentOption.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{selectedPaymentOption.description}</p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{isLogisticsCheckout ? "Route destination" : "Delivery destination"}</p>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {isLogisticsCheckout
                    ? logisticsCheckout.deliveryAddress
                    : `${shippingAddress.city || "City"}, ${shippingAddress.state || "State"} ${shippingAddress.country || "Nigeria"}`}
                </p>
                {isLogisticsCheckout ? (
                  <p className="mt-1 text-sm text-slate-500">
                    Pickup from {logisticsCheckout.pickupAddress}. Estimated route time: {logisticsCheckout.quote?.durationText || "Updating"}.
                  </p>
                ) : hasDeliveryWindow ? (
                  <p className="mt-1 text-sm text-slate-500">
                    Estimated delivery between {deliveryStarts} and {deliveryEnds}
                  </p>
                ) : null}
              </div>

              <Button
              className="mt-6 w-full rounded-2xl bg-[#f68b1e] py-4 text-sm font-bold uppercase tracking-[0.04em] text-white hover:bg-[#e07d16]"
              onClick={handleProceedToPayment}
                disabled={submittingOrder}
            >
              {submittingOrder ? "Processing Payment..." : "Confirm Payment Method"}
            </Button>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              {isLogisticsCheckout
                ? "You will receive a logistics tracking ID immediately after payment confirmation."
                : "Shipping charges and delivery details follow the option selected for each product."}
            </p>
            </section>
            </div>
          </div>

        </div>
      </div>

      <Modal isOpen={showShippingDetails} onClose={() => setShowShippingDetails(false)} panelClassName="max-w-[34rem]">
        <div className="rounded-[28px] bg-white px-6 py-7 shadow-2xl">
          <h3 className="pr-10 text-xl font-bold text-slate-900">{isLogisticsCheckout ? "Logistics Details" : "Delivery Details"}</h3>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <div>
              {isLogisticsCheckout ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Route Summary</p>
                  <p className="mt-2">Pickup: {logisticsCheckout.pickupAddress}</p>
                  <p className="mt-1">Delivery: {logisticsCheckout.deliveryAddress}</p>
                  <p className="mt-1">Distance: {logisticsCheckout.quote?.distanceText || "Updating"}</p>
                  <p className="mt-1">Estimated duration: {logisticsCheckout.quote?.durationText || "Updating"}</p>
                </>
              ) : hasDeliveryWindow ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Delivery Window</p>
                  <p className="mt-2">
                    Delivery starts from the day you place your order. Estimated window for {shippingAddress.city || "your city"}, {shippingAddress.state || "Nigeria"}: {deliveryStarts} to {deliveryEnds}.
                  </p>
                </>
              ) : null}
            </div>

            <div className="space-y-3">
              {checkoutItems.map((item) => (
                <div
                  key={item.cartKey || `${item.id}-${item.selectedShippingMethod}-shipping`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                    <span className="line-clamp-1">{item.name}</span>
                    <span>
                      {item.isLogistics
                        ? formatCurrency(item.price, userCurrency)
                        : getItemShippingFee(item) > 0
                        ? formatCurrency(convertPrice(getItemShippingFee(item), userCurrency), userCurrency)
                        : "Free"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{item.isLogistics ? item.urgency : formatShippingMethodLabel(item.selectedShippingMethod)}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Shipping Policy</p>
              <p className="mt-2">{storefrontSettings.shippingPolicyContent}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Return Policy</p>
              <p className="mt-2">{storefrontSettings.returnPolicyContent}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Delivery Fee Details</p>
              <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>{isLogisticsCheckout ? "Total Logistics Amount" : "Total Delivery Amount"}</span>
                <span>{isLogisticsCheckout ? formatCurrency(total, userCurrency) : shipping > 0 ? formatCurrency(shipping, userCurrency) : "Free"}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={notice.isOpen} onClose={closeNotice} panelClassName="max-w-[28rem]" showCloseButton={false}>
        <div className="rounded-[28px] bg-white px-6 py-7 shadow-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Checkout</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{notice.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{notice.message}</p>

          <div className="mt-6 flex justify-end">
            <Button
              className="rounded-2xl bg-[#f68b1e] px-5 py-3 text-sm font-bold uppercase tracking-[0.04em] text-white hover:bg-[#e07d16]"
              onClick={closeNotice}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>

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