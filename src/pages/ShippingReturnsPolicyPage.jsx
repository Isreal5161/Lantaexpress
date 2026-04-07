import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { getStorefrontSettings, getStorefrontSettingsSnapshot } from "../service/StorefrontService";

const formatParagraphs = (value = "") =>
  String(value || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const ShippingReturnsPolicyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [storefrontSettings, setStorefrontSettings] = useState(() => getStorefrontSettingsSnapshot());

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

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(location.hash.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const shippingParagraphs = useMemo(
    () => formatParagraphs(storefrontSettings.shippingPolicyContent),
    [storefrontSettings.shippingPolicyContent]
  );
  const returnParagraphs = useMemo(
    () => formatParagraphs(storefrontSettings.returnPolicyContent),
    [storefrontSettings.returnPolicyContent]
  );
  const pickupParagraphs = useMemo(
    () => formatParagraphs(storefrontSettings.pickupStationPolicyContent),
    [storefrontSettings.pickupStationPolicyContent]
  );
  const homeParagraphs = useMemo(
    () => formatParagraphs(storefrontSettings.homeDeliveryPolicyContent),
    [storefrontSettings.homeDeliveryPolicyContent]
  );
  const hasDeliveryWindow = Number.isFinite(Number(storefrontSettings.deliveryMinDays)) && Number.isFinite(Number(storefrontSettings.deliveryMaxDays));
  const hasReturnWindow = Number.isFinite(Number(storefrontSettings.returnWindowDays));

  return (
    <div className="min-h-screen bg-[#f6f7f2] text-slate-700">
      <Header />

      <main className="pb-16">
        <section className="border-b border-[#dfe6d3] bg-[linear-gradient(135deg,#103b22_0%,#1b5e20_55%,#6e8f32_100%)] text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Customer Support</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Shipping and returns information for every order</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Review delivery timelines, pickup station guidance, home delivery expectations, and the current return window before you place an order.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#shipping" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#154522] transition hover:bg-[#eef7ea]">
                Shipping policy
              </a>
              <a href="#returns" className="rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Return policy
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <aside className="h-fit rounded-[28px] border border-[#dfe6d3] bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">On this page</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="#shipping" className="block rounded-2xl bg-[#f3f7ec] px-4 py-3 font-semibold text-[#245129]">{storefrontSettings.shippingPolicyTitle}</a>
              <a href="#pickup-station" className="block rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">Pickup Station</a>
              <a href="#home-delivery" className="block rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">Home Delivery</a>
              <a href="#returns" className="block rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">{storefrontSettings.returnPolicyTitle}</a>
            </div>

            {hasDeliveryWindow || hasReturnWindow ? (
              <div className="mt-6 rounded-3xl bg-[#fcf7ec] px-4 py-4 text-sm leading-6 text-slate-600">
                {hasDeliveryWindow ? (
                  <>
                    <p className="font-semibold text-slate-900">Delivery window</p>
                    <p className="mt-2">
                      Orders are typically processed within {storefrontSettings.deliveryMinDays} to {storefrontSettings.deliveryMaxDays} days.
                    </p>
                  </>
                ) : null}
                {hasReturnWindow ? (
                  <>
                    <p className={`${hasDeliveryWindow ? "mt-3 " : ""}font-semibold text-slate-900`}>Return window</p>
                    <p className="mt-2">Eligible items can be returned within {storefrontSettings.returnWindowDays} day{Number(storefrontSettings.returnWindowDays) === 1 ? "" : "s"}.</p>
                  </>
                ) : null}
              </div>
            ) : null}
          </aside>

          <div className="space-y-6">
            <section id="shipping" className="rounded-[30px] border border-[#dfe6d3] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Shipping policy</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{storefrontSettings.shippingPolicyTitle}</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {shippingParagraphs.map((paragraph, index) => (
                  <p key={`shipping-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="pickup-station" className="rounded-[30px] border border-[#dfe6d3] bg-[#f7fbf5] p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7c34]">Delivery mode</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Pickup Station</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {pickupParagraphs.map((paragraph, index) => (
                  <p key={`pickup-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="home-delivery" className="rounded-[30px] border border-[#dfe6d3] bg-[#fff9f1] p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b96f13]">Delivery mode</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Home Delivery</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {homeParagraphs.map((paragraph, index) => (
                  <p key={`home-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="returns" className="rounded-[30px] border border-[#dfe6d3] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Returns</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{storefrontSettings.returnPolicyTitle}</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {returnParagraphs.map((paragraph, index) => (
                  <p key={`returns-${index}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                Returns remain subject to inspection and seller eligibility rules. Items should be unused and returned with original packaging whenever applicable.
              </div>
            </section>

            <div className="flex justify-center pb-2">
              <Link to="/shop" className="rounded-full bg-[#f68b1e] px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#df7d18]">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingReturnsPolicyPage;