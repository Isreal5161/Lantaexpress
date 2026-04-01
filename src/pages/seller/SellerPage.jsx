import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { SellerHeader } from "../../components/SellerHeader";

const sellerHighlights = [
  {
    title: "Launch Faster",
    text: "Create your seller space, upload products, and start building visibility without a heavy setup process.",
    icon: ShoppingBagIcon,
  },
  {
    title: "Grow Visibility",
    text: "Reach more buyers with a stronger storefront presence and a marketplace already built for discovery.",
    icon: MegaphoneIcon,
  },
  {
    title: "Track Performance",
    text: "Follow orders, monitor product activity, and keep decisions grounded in what is actually selling.",
    icon: ChartBarIcon,
  },
  {
    title: "Withdraw With Confidence",
    text: "Manage income, requests, and seller finance flow through a cleaner, more professional dashboard journey.",
    icon: BanknotesIcon,
  },
];

const sellerSteps = [
  {
    title: "Create your seller account",
    text: "Set up your business details, brand identity, and categories in one guided flow.",
  },
  {
    title: "Upload and manage products",
    text: "List products with strong descriptions, pricing, stock, and cleaner product management tools.",
  },
  {
    title: "Sell, fulfill, and grow",
    text: "Track orders, deliver smoothly, and grow repeat customer confidence over time.",
  },
];

export const SellerLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f7f3] font-body text-slate-800">
      <SellerHeader />

      <main className="overflow-hidden pb-16 md:pb-0">
        <section className="relative isolate overflow-hidden bg-[#04170d] pt-24 text-white sm:pt-28">
          <img
            src="/lantaexpressimage1.jpg"
            alt="Seller background fallback"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/Seller.mov"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/lantaexpressimage1.jpg"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,23,13,0.9),rgba(4,23,13,0.58)_45%,rgba(4,23,13,0.82)),radial-gradient(circle_at_top_right,rgba(57,181,115,0.24),transparent_30%)]" />
          <div className="absolute -left-16 top-20 h-52 w-52 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-200/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100 backdrop-blur-md">
                <ShieldCheckIcon className="h-4 w-4 text-green-300" />
                Seller growth on LantaXpress
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Build a smarter seller business with a storefront that feels serious.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                Join LantaXpress, reach more customers, and manage products, orders, and payouts through a cleaner seller experience.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/seller-signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-green-50"
                >
                  Become a Seller
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  to="/seller-login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Seller Login
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">24/7</p>
                  <p className="mt-2 text-sm text-slate-200">Seller access</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">Fast</p>
                  <p className="mt-2 text-sm text-slate-200">Product publishing</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-md">
                  <p className="text-2xl font-black text-white">Clear</p>
                  <p className="mt-2 text-sm text-slate-200">Order and payout flow</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-md">
                <video
                  className="h-[260px] w-full rounded-[26px] object-cover sm:h-[360px] lg:h-[540px]"
                  src="/SmartSeller.mov"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/lantaexpressimage2.jpg"
                />
                <div className="absolute inset-x-8 bottom-8 hidden rounded-[28px] border border-white/20 bg-slate-950/65 p-5 text-white backdrop-blur-xl sm:block">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Smart seller tools</p>
                  <p className="mt-2 text-lg font-bold">Products, insights, and seller operations presented with a more premium visual story.</p>
                </div>
              </div>
              <div className="mt-4 rounded-[24px] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md sm:hidden">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Smart seller tools</p>
                <p className="mt-2 text-base font-bold leading-7">Products, insights, and seller operations presented with a more premium visual story.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {sellerHighlights.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(7,89,46,0.18)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 text-white transition duration-300 group-hover:rotate-6">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-10">
          <div className="rounded-[32px] bg-[#071d12] p-8 text-white shadow-[0_28px_90px_rgba(2,12,7,0.38)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-green-300">Seller journey</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Everything a growing seller needs, introduced in a cleaner welcome experience.</h2>
            <div className="mt-8 space-y-5">
              {sellerSteps.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500 font-black text-slate-950">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:grid-rows-[1fr_auto]">
            <div className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:col-span-2">
              <img
                src="/lantaexpressimage2.jpg"
                alt="Seller success fallback"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <video
                className="h-72 w-full object-cover sm:h-80"
                src="/Seller.mov"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                poster="/lantaexpressimage2.jpg"
              />
              <div className="absolute inset-x-5 bottom-5 hidden rounded-[24px] border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-md sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-300">Seller success</p>
                <p className="mt-2 text-lg font-bold">A more cinematic seller welcome page that feels closer to a premium marketplace brand.</p>
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-700">Seller success</p>
              <p className="mt-2 text-base font-bold leading-7">A more cinematic seller welcome page that feels closer to a premium marketplace brand.</p>
            </div>
            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <img
                src="/lantalogo1.jpg"
                alt="LantaXpress seller brand"
                className="h-56 w-full object-contain bg-white p-8"
              />
            </div>
            <div className="rounded-[30px] bg-gradient-to-br from-white to-green-50 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Built for serious sellers</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Stronger visuals, cleaner onboarding, and a more professional tone before the seller even opens the signup form.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">Onboarding tone</span>
                  <span className="font-semibold text-slate-900">Premium</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">Seller messaging</span>
                  <span className="font-semibold text-slate-900">Clear</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">Call to action</span>
                  <span className="font-semibold text-green-700">Focused</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="rounded-[34px] bg-gradient-to-r from-green-700 via-emerald-600 to-slate-900 px-6 py-8 text-white shadow-[0_25px_80px_rgba(7,89,46,0.26)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-green-100">Start today</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Ready to sell on LantaXpress?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-green-50/90">
                Move from interest to action with a cleaner signup flow and a seller experience that already feels structured.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 lg:mt-0 lg:flex-row">
              <Link
                to="/seller-signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-green-50"
              >
                Become a Seller
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/seller-login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-6 py-8 text-center text-sm text-slate-300">
        &copy; {new Date().getFullYear()} LantaXpress. All rights reserved.
      </footer>
    </div>
  );
};