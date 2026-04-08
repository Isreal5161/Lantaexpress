import React from "react";
import { RefreshCw, ServerCrash, WifiOff } from "lucide-react";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export const SkeletonBlock = ({ className = "" }) => (
  <div className={joinClasses("skeleton-shimmer", className)} />
);

export const ProductGridSkeleton = ({
  count = 8,
  imageClassName = "h-44",
  cardClassName = "",
}) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`product-skeleton-${index}`}
        className={joinClasses(
          "overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 shadow-sm",
          cardClassName
        )}
      >
        <SkeletonBlock className={joinClasses("w-full rounded-2xl", imageClassName)} />
        <div className="space-y-3 px-1 pb-2 pt-4">
          <SkeletonBlock className="h-3 w-20 rounded-full" />
          <SkeletonBlock className="h-4 w-full rounded-full" />
          <SkeletonBlock className="h-4 w-3/4 rounded-full" />
          <div className="flex items-center justify-between pt-2">
            <SkeletonBlock className="h-5 w-20 rounded-full" />
            <SkeletonBlock className="h-10 w-10 rounded-2xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div>
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-3 w-14 rounded-full" />
          <SkeletonBlock className="h-3 w-3 rounded-full" />
          <SkeletonBlock className="h-3 w-14 rounded-full" />
          <SkeletonBlock className="h-3 w-3 rounded-full" />
          <SkeletonBlock className="h-3 w-40 rounded-full" />
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-[2rem]" />

        <div className="space-y-5">
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-4/5 rounded-full" />
            <SkeletonBlock className="h-4 w-32 rounded-full" />
            <SkeletonBlock className="h-8 w-28 rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-11 w-32 rounded-2xl" />
            <SkeletonBlock className="h-11 w-36 rounded-2xl" />
          </div>

          <div className="space-y-4 pt-3">
            <SkeletonBlock className="h-5 w-36 rounded-full" />
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <SkeletonBlock className="h-4 w-11/12 rounded-full" />
            <SkeletonBlock className="h-4 w-4/5 rounded-full" />
          </div>

          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`feature-skeleton-${index}`} className="flex items-center gap-3">
                <SkeletonBlock className="h-5 w-5 rounded-full" />
                <SkeletonBlock className="h-4 w-56 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8">
        <SkeletonBlock className="mb-6 h-6 w-32 rounded-full" />
        <ProductGridSkeleton count={4} imageClassName="h-40" />
      </div>
    </div>
  </div>
);

export const DashboardOverviewSkeleton = ({ statCount = 4 }) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <SkeletonBlock className="h-4 w-28 rounded-full" />
      <SkeletonBlock className="h-9 w-64 rounded-full" />
      <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
    </div>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: statCount }).map((_, index) => (
        <div
          key={`stat-skeleton-${index}`}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-24 rounded-full" />
              <SkeletonBlock className="h-8 w-28 rounded-full" />
            </div>
            <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-40 rounded-full" />
            <SkeletonBlock className="h-3 w-56 rounded-full" />
          </div>
          <SkeletonBlock className="h-10 w-24 rounded-2xl" />
        </div>
        <SkeletonBlock className="h-64 w-full rounded-[2rem]" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`dashboard-row-${index}`} className="grid grid-cols-4 gap-3">
              <SkeletonBlock className="h-4 rounded-full" />
              <SkeletonBlock className="h-4 rounded-full" />
              <SkeletonBlock className="h-4 rounded-full" />
              <SkeletonBlock className="h-4 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <SkeletonBlock className="h-5 w-28 rounded-full" />
          <SkeletonBlock className="h-3 w-40 rounded-full" />
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`dashboard-side-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-24 rounded-full" />
                <SkeletonBlock className="h-3 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-4 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const TablePanelSkeleton = ({ columns = 6, rows = 5, mobileCards = 4 }) => (
  <>
    <div className="hidden overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:block">
      <div
        className="border-b border-slate-100 px-6 py-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <SkeletonBlock key={`table-head-${index}`} className="h-4 rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4 px-6 py-5">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`table-row-${rowIndex}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <SkeletonBlock key={`table-cell-${rowIndex}-${columnIndex}`} className="h-4 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:hidden">
      {Array.from({ length: mobileCards }).map((_, index) => (
        <div
          key={`table-card-${index}`}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-36 rounded-full" />
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <div className="flex gap-3 pt-3">
              <SkeletonBlock className="h-9 flex-1 rounded-2xl" />
              <SkeletonBlock className="h-9 flex-1 rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export const SellerProfileSkeleton = () => (
  <div className="rounded-xl bg-white p-6 shadow">
    <div className="flex flex-col items-center gap-6 md:flex-row">
      <SkeletonBlock className="h-32 w-32 rounded-full" />

      <div className="flex-1 space-y-3">
        <SkeletonBlock className="h-7 w-52 rounded-full" />
        <SkeletonBlock className="h-4 w-40 rounded-full" />
        <SkeletonBlock className="h-4 w-56 rounded-full" />
        <SkeletonBlock className="h-4 w-48 rounded-full" />
        <SkeletonBlock className="h-4 w-72 max-w-full rounded-full" />
      </div>

      <div className="flex gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`profile-stat-${index}`} className="space-y-2 text-center">
            <SkeletonBlock className="h-3 w-20 rounded-full" />
            <SkeletonBlock className="h-7 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const OrderWorkspaceSkeleton = () => (
  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center">
        <SkeletonBlock className="h-12 flex-1 rounded-xl" />
        <SkeletonBlock className="h-12 w-44 rounded-xl" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`order-card-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex gap-4">
              <SkeletonBlock className="h-24 w-24 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-3">
                <SkeletonBlock className="h-5 w-24 rounded-full" />
                <SkeletonBlock className="h-5 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-32 rounded-full" />
                <SkeletonBlock className="h-4 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <SkeletonBlock className="h-6 w-36 rounded-full" />
        <SkeletonBlock className="h-24 w-full rounded-2xl" />
      </div>
      <div className="mt-5 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`timeline-skeleton-${index}`} className="flex items-start gap-3">
            <SkeletonBlock className="mt-1 h-4 w-4 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-24 rounded-full" />
              <SkeletonBlock className="h-3 w-40 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const IndexPageSkeleton = () => (
  <div className="pb-20 md:pb-0">
    <div className="px-4 pt-4 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-[28rem] w-full rounded-[2rem]" />
    </div>

    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-3">
        <SkeletonBlock className="h-8 w-52 rounded-full" />
        <SkeletonBlock className="h-48 w-full rounded-[2rem]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-3">
        <SkeletonBlock className="h-8 w-40 rounded-full" />
        <ProductGridSkeleton count={8} imageClassName="h-44" />
      </div>

      <div className="mx-auto max-w-7xl">
        <SkeletonBlock className="h-24 w-full rounded-[2rem]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-3">
        <SkeletonBlock className="h-8 w-44 rounded-full" />
        <ProductGridSkeleton count={8} imageClassName="h-44" />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`index-category-skeleton-${index}`} className="space-y-3">
            <SkeletonBlock className="h-8 w-56 rounded-full" />
            <ProductGridSkeleton count={4} imageClassName="h-40" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ShopPageSkeleton = () => (
  <div>
    <div className="sticky top-0 z-40 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-8xl">
          <SkeletonBlock className="h-4 w-32 rounded-full" />
        </div>
      </div>

      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SkeletonBlock className="h-48 w-full rounded-[2rem]" />
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={`shop-tab-skeleton-${index}`} className="h-10 w-28 shrink-0 rounded-full" />
          ))}
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductGridSkeleton count={8} imageClassName="h-52" />
    </div>
  </div>
);

export const ProductPageSkeleton = () => (
  <div className="pb-20 md:pb-0">
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-3 w-14 rounded-full" />
          <SkeletonBlock className="h-3 w-3 rounded-full" />
          <SkeletonBlock className="h-3 w-14 rounded-full" />
          <SkeletonBlock className="h-3 w-3 rounded-full" />
          <SkeletonBlock className="h-3 w-40 rounded-full" />
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-[2rem]" />

        <div className="space-y-5">
          <div className="space-y-3">
            <SkeletonBlock className="h-10 w-4/5 rounded-full" />
            <SkeletonBlock className="h-5 w-28 rounded-full" />
            <SkeletonBlock className="h-8 w-40 rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-11 w-32 rounded-2xl" />
            <SkeletonBlock className="h-11 w-36 rounded-2xl" />
          </div>

          <div className="space-y-4 pt-3">
            <SkeletonBlock className="h-5 w-36 rounded-full" />
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <SkeletonBlock className="h-4 w-11/12 rounded-full" />
            <SkeletonBlock className="h-4 w-4/5 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8">
        <SkeletonBlock className="mb-6 h-6 w-32 rounded-full" />
        <ProductGridSkeleton count={4} imageClassName="h-40" />
      </div>
    </div>
  </div>
);

export const AdminMediaManagerSkeleton = ({ sectionCount = 3, cardCount = 2 }) => (
  <div className="space-y-6">
    {Array.from({ length: sectionCount }).map((_, sectionIndex) => (
      <section
        key={`admin-media-skeleton-${sectionIndex}`}
        className="rounded-2xl border bg-white p-5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-6 w-40 rounded-full" />
            <SkeletonBlock className="h-4 w-64 max-w-full rounded-full" />
          </div>
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl md:col-span-2" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <SkeletonBlock className="h-10 w-28 rounded-xl" />
              <SkeletonBlock className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {Array.from({ length: cardCount }).map((_, cardIndex) => (
            <article
              key={`admin-media-card-${sectionIndex}-${cardIndex}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              <SkeletonBlock className="h-48 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-40 rounded-full" />
                    <SkeletonBlock className="h-3 w-32 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonBlock className="h-6 w-16 rounded-full" />
                    <SkeletonBlock className="h-6 w-12 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <SkeletonBlock className="h-3 w-20 rounded-full" />
                  <SkeletonBlock className="h-3 w-16 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <SkeletonBlock className="h-10 w-20 rounded-xl" />
                  <SkeletonBlock className="h-10 w-16 rounded-xl" />
                  <SkeletonBlock className="h-10 w-20 rounded-xl" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    ))}
  </div>
);

export const AppBootSkeleton = ({ pathname = "/" }) => {
  const normalizedPath = String(pathname || "/").toLowerCase();

  if (normalizedPath === "/") {
    return <IndexPageSkeleton />;
  }

  if (
    normalizedPath.startsWith("/shop") ||
    normalizedPath.startsWith("/hot-sales") ||
    normalizedPath.startsWith("/flash-sales")
  ) {
    return <ShopPageSkeleton />;
  }

  if (normalizedPath.startsWith("/product/")) {
    return <ProductPageSkeleton />;
  }

  if (normalizedPath.startsWith("/adminpanel/promotions") || normalizedPath.startsWith("/adminpanel/hero-slides")) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminMediaManagerSkeleton sectionCount={3} cardCount={2} />
      </div>
    );
  }

  if (normalizedPath.startsWith("/adminpanel/users/tracking") || normalizedPath.startsWith("/adminpanel/sellers/orders")) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <OrderWorkspaceSkeleton />
      </div>
    );
  }

  if (
    normalizedPath.startsWith("/adminpanel/users") ||
    normalizedPath.startsWith("/adminpanel/sellers") ||
    normalizedPath.startsWith("/adminpanel/logistics")
  ) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <TablePanelSkeleton columns={6} rows={5} mobileCards={4} />
      </div>
    );
  }

  if (normalizedPath.startsWith("/adminpanel/products") || normalizedPath.startsWith("/seller-dashboard/products")) {
    return (
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <SkeletonBlock className="h-8 w-56 rounded-full" />
        <ProductGridSkeleton count={6} imageClassName="h-48" />
      </div>
    );
  }

  if (
    normalizedPath.startsWith("/adminpanel/dashboard") ||
    normalizedPath === "/seller-dashboard" ||
    normalizedPath.startsWith("/seller-dashboard/income") ||
    normalizedPath.startsWith("/seller-dashboard/withdraw")
  ) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  if (normalizedPath.startsWith("/seller-dashboard/orders")) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <OrderWorkspaceSkeleton />
      </div>
    );
  }

  if (normalizedPath.startsWith("/seller-dashboard/profile") || normalizedPath.startsWith("/account")) {
    return (
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <SellerProfileSkeleton />
        <ProductGridSkeleton count={4} imageClassName="h-32" cardClassName="rounded-xl bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-56 rounded-full" />
        <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <SkeletonBlock className="h-5 w-40 rounded-full" />
          <SkeletonBlock className="h-4 w-full rounded-full" />
          <SkeletonBlock className="h-4 w-5/6 rounded-full" />
          <SkeletonBlock className="h-40 w-full rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
};

export const PageLoadErrorState = ({ error, onRefresh, actionLabel = "Try again" }) => {
  const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;
  const isNetworkError = isOffline || Boolean(error?.isNetworkError);
  const isServerError = Number(error?.status) >= 500;
  const IconComponent = isNetworkError ? WifiOff : ServerCrash;
  const title = isNetworkError
    ? "Network error"
    : isServerError
    ? "Our server has an issue"
    : "Failed to load";
  const message = isNetworkError
    ? "Check your internet connection and refresh the page."
    : isServerError
    ? "Our server could not load this page right now. Refresh and try again."
    : error?.message || "Failed to load this page. Refresh and try again.";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <IconComponent className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
        <button
          type="button"
          onClick={onRefresh}
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <RefreshCw className="h-4 w-4" />
          {actionLabel}
        </button>
      </div>
    </div>
  );
};