import React from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaCompass,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaRoute,
  FaShieldAlt,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
import { Link } from "../components/Link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const heroStats = [
  { value: "24/7", label: "Dispatch support" },
  { value: "98%", label: "Successful drop-offs" },
  { value: "Same day", label: "Fast city delivery" },
];

const serviceCards = [
  {
    title: "Marketplace Delivery",
    text: "Pickup from sellers, coordinated drop-off, and a cleaner customer-facing delivery experience.",
    icon: FaMotorcycle,
  },
  {
    title: "Business Dispatch",
    text: "Reliable movement for stores, vendors, and operations teams that need repeatable delivery workflows.",
    icon: FaWarehouse,
  },
  {
    title: "Secure Handling",
    text: "Better package notes, clearer proof points, and safer handling for fragile or sensitive items.",
    icon: FaShieldAlt,
  },
];

const deliveryFlow = [
  {
    title: "Book with context",
    text: "Add pickup, delivery, urgency, and package notes so dispatch starts with the right information.",
  },
  {
    title: "Review and assign",
    text: "Operations can review incoming requests and route them for the best delivery path.",
  },
  {
    title: "Track movement",
    text: "From approval to delivery, shipment progress remains visible inside the LantaXpress flow.",
  },
];

const coveragePills = ["Lagos", "Ibadan", "Abuja", "Port Harcourt", "Benin", "Abeokuta"];
const heroVideoSrc = "/Logistics.mov";
const successVideoSrc = "/Deliveredsuccessful.mov";
const bookingHighlights = [
  {
    title: "Separate booking page",
    text: "A focused page for pickup and delivery details keeps the logistics landing page easier to understand.",
    icon: FaCompass,
  },
  {
    title: "Live route estimate",
    text: "Users can review distance, expected duration, and price before continuing to checkout.",
    icon: FaRoute,
  },
  {
    title: "Checkout with tracking",
    text: "Once payment is complete, the flow returns a logistics tracking ID for status updates.",
    icon: FaCheckCircle,
  },
];

export const LogisticsPage = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f2] font-body text-slate-700">
      <Header />

      <main className="overflow-hidden pb-24 md:pb-0">
        <section className="relative isolate overflow-hidden bg-[#03150c] text-white">
          <img
            src="/lantaexpressimage1.jpg"
            alt="Logistics background fallback"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/lantaexpressimage1.jpg"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(63,179,112,0.35),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_28%),linear-gradient(135deg,_rgba(3,21,12,0.98),_rgba(8,48,28,0.9))]" />
          <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-200/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex animate-pulse items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100 backdrop-blur-md">
                <FaTruck className="text-green-300" />
                Premium delivery operations
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Logistics that looks polished and moves like a serious operation.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                Book pickups, schedule business dispatch, and track delivery progress through a more professional experience built for modern commerce.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/logistics/book"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-green-50"
                >
                  Book a delivery
                  <FaArrowRight />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Track an order
                  <FaMapMarkerAlt />
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                  >
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-md">
                <video
                  className="h-[260px] w-full rounded-[26px] object-cover sm:h-[320px] lg:h-[500px]"
                  src={successVideoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/lantaexpressimage1.jpg"
                />
                <div className="pointer-events-none absolute inset-x-8 bottom-8 hidden rounded-[28px] border border-white/20 bg-slate-950/65 p-5 backdrop-blur-xl sm:block">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300">Dispatch view</p>
                      <p className="mt-2 text-lg font-bold text-white">Same-day handoff, live movement, and stronger proof of delivery.</p>
                    </div>
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-lg text-white sm:flex">
                      <FaCheckCircle />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-[24px] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md sm:hidden">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Dispatch view</p>
                <p className="mt-2 text-base font-bold leading-7">Same-day handoff, live movement, and stronger proof of delivery.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {serviceCards.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-[28px] border border-slate-200 bg-white/90 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(7,89,46,0.18)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 text-2xl text-white transition duration-300 group-hover:rotate-6">
                  <Icon />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-[32px] bg-[#061b10] p-8 text-white shadow-[0_28px_90px_rgba(2,12,7,0.38)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300">Why brands choose LantaXpress</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">A cleaner logistics experience for customers, vendors, and operations teams.</h2>
            <div className="mt-8 space-y-5">
              {deliveryFlow.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:bg-white/10"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500 font-black text-slate-950">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {coveragePills.map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-100"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:grid-rows-[1fr_auto]">
            <div className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:col-span-2">
              <img
                src="/lantaexpressimage2.jpg"
                alt="Delivery success fallback"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <video
                className="h-72 w-full object-cover sm:h-80"
                src={successVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                poster="/lantaexpressimage2.jpg"
              />
              <div className="pointer-events-none absolute inset-x-5 bottom-5 hidden rounded-[24px] border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-md sm:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300">Delivery success</p>
                <p className="mt-2 text-lg font-bold">Clean arrival moments that make the logistics experience feel premium.</p>
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-700">Delivery success</p>
              <p className="mt-2 text-base font-bold leading-7">Clean arrival moments that make the logistics experience feel premium.</p>
            </div>
            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <img
                src="/lantaexpressimage1.jpg"
                alt="Delivery operations"
                className="h-56 w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
            <div className="rounded-[30px] bg-gradient-to-br from-white to-green-50 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FaClock />
                </div>
                <div className="h-2 flex-1 rounded-full bg-green-100">
                  <div className="h-2 w-3/4 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Operational clarity</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Cleaner handoffs, clearer request details, and a more confident customer-facing logistics experience.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">Booking confirmation</span>
                  <span className="font-semibold text-slate-900">Instant</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">Request visibility</span>
                  <span className="font-semibold text-slate-900">Structured</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">Dispatch tone</span>
                  <span className="font-semibold text-green-700">Professional</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="rounded-[34px] bg-gradient-to-br from-slate-900 via-[#082315] to-green-800 px-6 py-8 text-white shadow-[0_25px_90px_rgba(7,89,46,0.2)] sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-300">Booking experience</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">The booking form now lives on its own page.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
                  Users can first understand how LantaXpress logistics works, then open a focused booking flow without a long form competing for attention on this page.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/logistics/book"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-green-50"
                  >
                    Open booking page
                    <FaArrowRight />
                  </Link>
                  <Link
                    href="/track"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                  >
                    Track shipment
                    <FaMapMarkerAlt />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {bookingHighlights.map(({ title, text, icon: Icon }) => (
                  <div key={title} className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg text-slate-900">
                      <Icon />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-200">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
          <div className="rounded-[34px] bg-gradient-to-r from-green-700 via-emerald-600 to-slate-900 px-6 py-8 text-white shadow-[0_25px_80px_rgba(7,89,46,0.26)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-green-100">Need status visibility?</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Track active shipments without leaving the LantaXpress flow.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-green-50/90">
                Once your request is approved, the tracking page keeps movement history visible from dispatch to delivery.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <Link href="/track" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-green-50">
                Open tracking
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};