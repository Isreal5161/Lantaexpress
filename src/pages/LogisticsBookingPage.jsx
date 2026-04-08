import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBoxOpen, FaComments, FaTruck } from "react-icons/fa";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import ConfirmationModal from "../components/ConfirmationModal";
import Modal from "../components/Modal";
import { getLogisticsQuote } from "../api/logistics";
import { getStorefrontSettings, getStorefrontSettingsSnapshot } from "../service/StorefrontService";
import { formatStructuredAddress, getLgasForState, NIGERIA_STATES } from "../utils/nigeriaLocations";

const createEmptyLocation = () => ({ state: "", lga: "", street: "" });

const createInitialForm = () => ({
  name: "",
  phone: "",
  serviceType: "Marketplace delivery",
  urgency: "Standard",
  pickupLocation: createEmptyLocation(),
  deliveryLocation: createEmptyLocation(),
  description: "",
});

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.onerror = () => reject(new Error("Unable to read selected image"));
  reader.readAsDataURL(file);
});

export const LogisticsBookingPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(createInitialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: "", message: "", tone: "default" });
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [storefrontSettings, setStorefrontSettings] = useState(() => getStorefrontSettingsSnapshot());

  const pickupLgaOptions = useMemo(
    () => getLgasForState(formValues.pickupLocation.state),
    [formValues.pickupLocation.state]
  );
  const deliveryLgaOptions = useMemo(
    () => getLgasForState(formValues.deliveryLocation.state),
    [formValues.deliveryLocation.state]
  );

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

  const updateLocation = (key, field, value) => {
    setFormValues((current) => {
      const nextLocation = {
        ...current[key],
        [field]: value,
      };

      if (field === "state") {
        const nextLgas = getLgasForState(value);
        nextLocation.lga = nextLgas.includes(current[key].lga) ? current[key].lga : "";
      }

      return {
        ...current,
        [key]: nextLocation,
      };
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    try {
      const fileUrl = await readFileAsDataUrl(file);
      setSelectedFile(file);
      setPreviewUrl(fileUrl);
    } catch (error) {
      setSelectedFile(null);
      setPreviewUrl("");
      setFeedbackModal({
        open: true,
        title: "Image Upload Failed",
        message: error.message || "We could not process that image.",
        tone: "danger",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const pickupAddress = formatStructuredAddress(formValues.pickupLocation);
    const deliveryAddress = formatStructuredAddress(formValues.deliveryLocation);

    if (!pickupAddress || !deliveryAddress) {
      setFeedbackModal({
        open: true,
        title: "Route Details Missing",
        message: "Select pickup and delivery state, local government, and street before continuing.",
        tone: "neutral",
      });
      return;
    }

    const draft = {
      contact: {
        name: String(formValues.name || "").trim(),
        phone: String(formValues.phone || "").trim(),
      },
      serviceType: String(formValues.serviceType || "Marketplace delivery").trim(),
      urgency: String(formValues.urgency || "Standard").trim(),
      pickupLocation: {
        ...formValues.pickupLocation,
        formattedAddress: pickupAddress,
      },
      deliveryLocation: {
        ...formValues.deliveryLocation,
        formattedAddress: deliveryAddress,
      },
      pickupAddress,
      deliveryAddress,
      packageDescription: String(formValues.description || "").trim(),
      image: previewUrl || "",
    };

    try {
      setQuoteLoading(true);
      const quote = await getLogisticsQuote({
        pickupAddress: draft.pickupAddress,
        deliveryAddress: draft.deliveryAddress,
        pickupLocation: draft.pickupLocation,
        deliveryLocation: draft.deliveryLocation,
      });

      setBookingDraft(draft);
      setQuoteDetails(quote);
      setQuoteModalOpen(true);
    } catch (error) {
      setFeedbackModal({
        open: true,
        title: "Unable to Calculate Price",
        message: error.message || "We could not calculate the logistics price right now.",
        tone: "danger",
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleContinueToCheckout = () => {
    if (!bookingDraft || !quoteDetails) {
      return;
    }

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        checkoutSource: "logistics",
        shouldClearCart: false,
        logisticsBooking: {
          ...bookingDraft,
          quote: quoteDetails,
        },
      })
    );

    setQuoteModalOpen(false);
    navigate("/checkout");
  };

  const handleChatSupport = () => {
    const supportPhone = String(quoteDetails?.supportPhone || storefrontSettings.logisticsSupportPhone || "").replace(/\D/g, "");
    const supportEmail = String(quoteDetails?.supportEmail || storefrontSettings.logisticsSupportEmail || "").trim();
    const message = encodeURIComponent(
      `Hello logistics team, I need help with a delivery quote from ${bookingDraft?.pickupAddress || "pickup"} to ${bookingDraft?.deliveryAddress || "delivery"}.`
    );

    if (supportPhone) {
      window.open(`https://wa.me/${supportPhone}?text=${message}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (supportEmail) {
      window.open(`mailto:${supportEmail}?subject=Logistics%20Support&body=${message}`, "_blank", "noopener,noreferrer");
      return;
    }

    setFeedbackModal({
      open: true,
      title: "Support Contact Missing",
      message: "Admin has not added a logistics support phone or email yet.",
      tone: "neutral",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f2] font-body text-slate-700">
      <Header />

      <main className="flex-1 overflow-hidden pb-24 md:pb-0">
        <section className="bg-[linear-gradient(135deg,_#03150c,_#0d2d1a_60%,_#1f6f43)] text-white">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
            <div className="rounded-[28px] border border-white/10 bg-white/10 px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-md sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300">Logistics booking</p>
                  <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Book a pickup in minutes.</h1>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
                    Fill the form below, review the quote, and continue to checkout.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/logistics"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/15"
                  >
                    Back to logistics
                  </Link>
                  <Link
                    href="/track"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition duration-300 hover:bg-green-50"
                  >
                    Track shipment
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300">Booking checklist</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">Request a pickup with the right details from the start.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Share pickup instructions, delivery destination, service type, and a package image so the dispatch team can process faster.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-slate-950">
                      <FaBoxOpen />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Package clarity</p>
                      <p className="text-sm text-slate-300">Better dispatch routing starts with better booking details.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-slate-950">
                      <FaTruck />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Express routing</p>
                      <p className="text-sm text-slate-300">Choose standard, express, or business dispatch based on urgency.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Full name</span>
                  <input name="name" type="text" value={formValues.name} onChange={handleInputChange} placeholder="Enter your full name" required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Phone number</span>
                  <input name="phone" type="tel" value={formValues.phone} onChange={handleInputChange} placeholder="Enter active phone number" required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Service type</span>
                  <select name="serviceType" value={formValues.serviceType} onChange={handleInputChange} className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white">
                    <option>Marketplace delivery</option>
                    <option>Business dispatch</option>
                    <option>Interstate movement</option>
                    <option>Fragile package handling</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Urgency</span>
                  <select name="urgency" value={formValues.urgency} onChange={handleInputChange} className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-green-500 focus:bg-white">
                    <option>Standard</option>
                    <option>Express</option>
                    <option>Same day</option>
                    <option>Scheduled delivery</option>
                  </select>
                </label>
                <div className="sm:col-span-2 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Pickup state</span>
                      <select value={formValues.pickupLocation.state} onChange={(event) => updateLocation("pickupLocation", "state", event.target.value)} required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-green-500">
                        <option value="">Select state</option>
                        {NIGERIA_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Pickup local government</span>
                      <select value={formValues.pickupLocation.lga} onChange={(event) => updateLocation("pickupLocation", "lga", event.target.value)} required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-green-500">
                        <option value="">Select local government</option>
                        {pickupLgaOptions.map((lga) => (
                          <option key={lga} value={lga}>{lga}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Pickup street</span>
                      <input type="text" value={formValues.pickupLocation.street} onChange={(event) => updateLocation("pickupLocation", "street", event.target.value)} placeholder="Enter pickup street and landmark" required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-green-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Delivery state</span>
                      <select value={formValues.deliveryLocation.state} onChange={(event) => updateLocation("deliveryLocation", "state", event.target.value)} required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-green-500">
                        <option value="">Select state</option>
                        {NIGERIA_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Delivery local government</span>
                      <select value={formValues.deliveryLocation.lga} onChange={(event) => updateLocation("deliveryLocation", "lga", event.target.value)} required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-green-500">
                        <option value="">Select local government</option>
                        {deliveryLgaOptions.map((lga) => (
                          <option key={lga} value={lga}>{lga}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-800">Delivery street</span>
                      <input type="text" value={formValues.deliveryLocation.street} onChange={(event) => updateLocation("deliveryLocation", "street", event.target.value)} placeholder="Enter delivery street and landmark" required className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-green-500" />
                    </div>
                  </div>
                </div>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Package description</span>
                  <textarea name="description" value={formValues.description} onChange={handleInputChange} placeholder="Describe the package, quantity, handling instructions, or delivery notes" required rows="5" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-green-500 focus:bg-white" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Package image</span>
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-4">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-green-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-green-700" />
                    <p className="mt-3 text-xs leading-6 text-slate-500">Add an image when you want dispatch or support to see package condition before pickup.</p>
                    {selectedFile ? <p className="mt-2 text-xs font-medium text-slate-600">Selected: {selectedFile.name}</p> : null}
                  </div>
                </label>
              </div>

              {quoteDetails ? (
                <div className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Live logistics quote</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-4">
                      <p className="text-xs text-slate-500">Distance</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{quoteDetails.distanceText}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      <p className="text-xs text-slate-500">Estimated duration</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{quoteDetails.durationText || "Updating"}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">₦ {Number(quoteDetails.amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  Pricing is calculated from your pickup and delivery route before you proceed to payment.
                </div>
                <Button type="submit" disabled={quoteLoading} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-600 px-8 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-700 disabled:translate-y-0 disabled:opacity-60">
                  {quoteLoading ? "Calculating..." : "Review quote"}
                  <FaArrowRight />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onCancel={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        onConfirm={() => setFeedbackModal({ open: false, title: "", message: "", tone: "default" })}
        confirmLabel="OK"
        hideCancel
        tone={feedbackModal.tone}
      />

      <Modal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} panelClassName="max-w-[36rem]">
        <div className="rounded-[28px] bg-white px-6 py-7 shadow-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Logistics quote</p>
          <h3 className="mt-2 pr-10 text-xl font-bold text-slate-900">Your delivery price is ready</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Review the route estimate below, chat with the logistics team if needed, or continue to checkout to pay and generate your tracking ID.
          </p>

          {quoteDetails ? (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Pickup</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{bookingDraft?.pickupAddress}</p>
                  <p className="mt-1 text-xs text-slate-500">{bookingDraft?.pickupLocation?.lga}, {bookingDraft?.pickupLocation?.state}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Delivery</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{bookingDraft?.deliveryAddress}</p>
                  <p className="mt-1 text-xs text-slate-500">{bookingDraft?.deliveryLocation?.lga}, {bookingDraft?.deliveryLocation?.state}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 px-4 py-4">
                  <p className="text-xs text-slate-500">Distance</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{quoteDetails.distanceText}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-4">
                  <p className="text-xs text-slate-500">Estimated duration</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{quoteDetails.durationText || "Updating"}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <p className="text-xs text-emerald-700">Amount due</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">₦ {Number(quoteDetails.amount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleChatSupport}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <FaComments />
              Chat logistics team
            </button>
            <button
              type="button"
              onClick={handleContinueToCheckout}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Continue to checkout
              <FaArrowRight />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};