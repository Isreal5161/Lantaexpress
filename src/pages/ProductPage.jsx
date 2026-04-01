import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useCart } from "../context/CartContextTemp";
import { getProductById, getProducts } from "../service/ProductService";
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ProductCard } from '../components/ProductCard';
import { RatingStars } from '../components/RatingStars';
import {
  PageLoadErrorState,
  ProductPageSkeleton,
} from '../components/LoadingSkeletons';
import {
  getEffectiveProductPrice,
  getOriginalProductPrice,
  getProductDiscountPercent,
  hasActiveProductDiscount,
} from '../utils/productPricing';

const formatReviewDate = (value) => {
  if (!value) {
    return "Recently";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return parsedDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const normalizeDescriptionParts = (description = "") => {
  const normalized = String(description || "")
    .replace(/[•●◦▪]/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return { overview: "", highlights: [] };
  }

  const lines = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sentencePool = (lines.length > 0 ? lines : [normalized])
    .flatMap((line) =>
      line
        .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
        .map((part) => part.trim())
        .filter(Boolean)
    );

  const deduped = Array.from(new Set(sentencePool));
  const [overview = normalized, ...rest] = deduped;

  return {
    overview,
    highlights: rest.slice(0, 6),
  };
};

export const ProductPage = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({ type: "image", src: "" });
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [recentCartAction, setRecentCartAction] = useState(null);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const effectivePrice = getEffectiveProductPrice(product || {});
  const originalPrice = getOriginalProductPrice(product || {});
  const hasDiscount = hasActiveProductDiscount(product || {});
  const discountPercent = getProductDiscountPercent(product || {});
  const availableStock = Math.max(Number(product?.stock) || 0, 0);
  const productDescription = useMemo(() => normalizeDescriptionParts(product?.description), [product?.description]);
  const mediaGallery = useMemo(() => {
    const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
    const media = images.map((src, index) => ({ id: `image-${index}`, type: "image", src }));

    if (product?.video) {
      media.unshift({ id: "video-0", type: "video", src: product.video });
    }

    if (media.length === 0 && product?.image) {
      media.push({ id: "image-fallback", type: "image", src: product.image });
    }

    return media;
  }, [product?.images, product?.video, product?.image]);
  const keyFeatures = useMemo(() => {
    const explicitFeatures = Array.isArray(product?.keyFeatures)
      ? product.keyFeatures.map((feature) => String(feature || "").trim()).filter(Boolean)
      : [];

    return explicitFeatures.length > 0 ? explicitFeatures : productDescription.highlights;
  }, [product?.keyFeatures, productDescription.highlights]);
  const productReviews = product?.reviews || [];
  const previewImage = useMemo(
    () => mediaGallery.find((item) => item.type === "image")?.src || product?.image || "",
    [mediaGallery, product?.image]
  );
  const isInCart = useMemo(
    () => cartItems.some((item) => String(item.id) === String(product?.id)),
    [cartItems, product?.id]
  );
  const ratingBreakdown = product?.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const reviewBreakdownRows = [5, 4, 3, 2, 1].map((star) => {
    const count = Number(ratingBreakdown[star]) || 0;
    const total = Number(product?.reviewCount) || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      star,
      count,
      percentage,
    };
  });

  const loadProductPage = async () => {
    try {
      setLoadingPage(true);
      setPageError(null);

      const [selectedProduct, allProducts] = await Promise.all([
        getProductById(id),
        getProducts(),
      ]);

      if (!selectedProduct) {
        throw new Error("Failed to load this product.");
      }

      setProduct(selectedProduct);
      setExploreProducts((allProducts || []).filter((item) => item.id.toString() !== id));
    } catch (error) {
      console.error("Failed to load product page:", error);
      setProduct(null);
      setExploreProducts([]);
      setPageError(error);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadProductPage();
  }, [id]);

  useEffect(() => {
    setShowFullDetails(false);
    setIsBuyNowOpen(false);
  }, [id]);

  useEffect(() => {
    setSelectedMedia(mediaGallery[0] || { type: "image", src: product?.image || "" });
  }, [mediaGallery, product?.image]);

  useEffect(() => {
    if (availableStock <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((prev) => Math.min(Math.max(prev, 1), availableStock));
  }, [availableStock]);

  useEffect(() => {
    if (!recentCartAction) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCartAnimating(false);
      setRecentCartAction(null);
    }, 550);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recentCartAction]);

  useEffect(() => {
    if (!isBuyNowOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsBuyNowOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBuyNowOpen]);

  const decreaseSelectedQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseSelectedQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, availableStock || 1));
  };

  const handleCartToggle = () => {
    if (!product || availableStock <= 0) {
      return;
    }

    const nextAction = isInCart ? "removed" : "added";

    setRecentCartAction(nextAction);
    setIsCartAnimating(true);

    if (isInCart) {
      removeFromCart(product.id);
      return;
    }

    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    if (!product || availableStock <= 0) {
      return;
    }

    setIsBuyNowOpen(true);
  };

  const handleBuyNowCheckout = () => {
    if (!product || availableStock <= 0) {
      return;
    }

    const userRaw = localStorage.getItem("currentUser") || localStorage.getItem("user");
    let user = null;

    if (!userRaw) {
      setIsBuyNowOpen(false);
      navigate("/login");
      return;
    }

    try {
      user = JSON.parse(userRaw);
      if (!user || typeof user !== "object") {
        user = { email: userRaw };
      }
    } catch {
      user = { email: userRaw };
    }

    const directCheckoutItem = {
      ...product,
      price: effectivePrice,
      image: previewImage,
      quantity,
    };

    const directSubtotal = effectivePrice * quantity;
    const directShipping = 0;
    const directTax = directSubtotal * 0.08;
    const directTotal = directSubtotal + directShipping + directTax;

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        user,
        cartItems: [directCheckoutItem],
        subtotal: directSubtotal,
        shipping: directShipping,
        tax: directTax,
        total: directTotal,
        shouldClearCart: false,
        checkoutSource: "buy-now",
      })
    );

    setIsBuyNowOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

      <main className="pb-16 md:pb-0">
        {loadingPage ? (
          <ProductPageSkeleton />
        ) : pageError || !product ? (
          <PageLoadErrorState error={pageError} onRefresh={loadProductPage} />
        ) : (
          <>
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex text-sm font-medium text-slate-500">
              <RouterLink className="hover:text-slate-900" to="/"> Home </RouterLink>
              <Text className="mx-2"> / </Text>
              <RouterLink className="hover:text-slate-900" to="/shop"> Shop </RouterLink>
              <Text className="mx-2"> / </Text>
              <Text className="text-slate-900">{product.name}</Text>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gray-100">
                <div className="aspect-[4/3] w-full">
                  {selectedMedia.type === "video" ? (
                    <video
                      src={selectedMedia.src}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      preset="detail"
                      variant="cover"
                      className="w-full h-full object-center object-cover"
                      src={selectedMedia.src || product.image}
                      alt={product.name}
                      loading="eager"
                      fetchPriority="high"
                    />
                  )}
                </div>
              </div>

              {mediaGallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {mediaGallery.map((media) => {
                    const isActive = selectedMedia.type === media.type && selectedMedia.src === media.src;

                    return (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => setSelectedMedia(media)}
                        className={`overflow-hidden rounded-xl border ${isActive ? "border-green-600 ring-2 ring-green-200" : "border-slate-200"}`}
                      >
                        <div className="relative aspect-square bg-slate-100">
                          {media.type === "video" ? (
                            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                              Video
                            </div>
                          ) : (
                            <img src={media.src} alt={`${product.name} preview`} className="h-full w-full object-cover" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
{/* Info */}
<div className="space-y-6">
  <div>
  <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2 leading-tight">
    {product.name}
  </h1>
  <div className="mb-4 flex flex-wrap items-center gap-3">
    <RatingStars
      rating={product.averageRating}
      reviewCount={product.reviewCount}
      showValue
      showCount
      sizeClass="h-5 w-5"
      textClass="text-sm text-slate-500"
    />
    <Text className="text-sm font-medium text-green-700">
      {product.reviewCount > 0 ? "Verified customer reviews" : "No reviews yet"}
    </Text>
  </div>
  <div className="mb-6 flex flex-wrap items-center gap-3">
    <p className="text-2xl font-bold text-slate-900">₦{effectivePrice.toLocaleString()}</p>
    {hasDiscount && (
      <>
        <p className="text-base text-slate-400 line-through">₦{originalPrice.toLocaleString()}</p>
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">-{discountPercent}%</span>
      </>
    )}
  </div>
  <p className={`mb-4 text-sm font-medium ${availableStock > 0 ? "text-green-600" : "text-red-600"}`}>
    {availableStock > 0 ? `Available stock: ${availableStock}` : "Out of stock"}
  </p>
  </div>

{/* Quantity + Long Rectangular Cart Icon Button */}
<div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
  <div className="flex flex-col gap-3">
  {/* Quantity Selector */}
  <div className="flex h-12 items-center overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 shadow-sm">
    <button
      type="button"
      className="flex h-full w-12 items-center justify-center text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
      onClick={decreaseSelectedQuantity}
      disabled={availableStock <= 0}
    >
      -
    </button>
    <span className="flex min-w-[3.5rem] items-center justify-center px-4 text-center text-base font-semibold text-slate-900">{quantity}</span>
    <button
      type="button"
      className="flex h-full w-12 items-center justify-center text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
      onClick={increaseSelectedQuantity}
      disabled={availableStock <= 0 || quantity >= availableStock}
    >
      +
    </button>
  </div>

  <div className="grid grid-cols-2 gap-3">
    {/* Long Rectangular Cart Icon Button */}
    <button
      type="button"
      onClick={handleCartToggle}
      disabled={availableStock <= 0}
      aria-pressed={isInCart}
      className={`relative flex h-12 min-w-0 items-center justify-center overflow-hidden rounded-2xl border px-3 shadow-sm transition-all duration-300 ease-out ${
        availableStock <= 0
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : isInCart
            ? `border-green-700 bg-slate-950 text-white ${isCartAnimating ? "scale-[1.02] shadow-lg ring-4 ring-slate-200" : "hover:bg-slate-900"}`
            : `border-green-600 bg-white text-green-700 ${isCartAnimating ? "scale-[1.02] shadow-lg ring-4 ring-green-100" : "hover:bg-green-50"}`
      }`}
      title={isInCart ? "Remove from Cart" : "Add to Cart"}
    >
      <span
        className={`pointer-events-none absolute inset-0 ${
          isCartAnimating
            ? isInCart
              ? "bg-white/10"
              : "bg-white/15"
            : "bg-transparent"
        } transition-opacity duration-300`}
      />
      <span
        className={`relative flex items-center gap-2 text-xs font-bold tracking-[0.06em] uppercase transition-all duration-300 sm:text-sm ${
          isCartAnimating ? "scale-105" : "scale-100"
        }`}
      >
        {isInCart ? (
          <>
            <Icon className={`h-5 w-5 transition-transform duration-300 ${isCartAnimating ? "scale-110" : "scale-100"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </Icon>
            <span>{recentCartAction === "removed" ? "Removed" : "In Cart"}</span>
          </>
        ) : (
          <>
            <Icon className={`h-5 w-5 transition-transform duration-300 ${isCartAnimating ? "-translate-y-0.5 scale-110" : "scale-100"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M3 3h2l.4 2M7 13h14l-1.5 8H6.5L5 13zm0 0L3 3m4 10v6m6-6v6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </Icon>
            <span>{recentCartAction === "added" ? "Added" : "Add to Cart"}</span>
          </>
        )}
      </span>
    </button>

    <button
      type="button"
      onClick={handleBuyNow}
      disabled={availableStock <= 0}
      className={`flex h-12 min-w-0 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-bold uppercase tracking-[0.06em] shadow-sm transition-all duration-300 sm:text-sm ${
        availableStock > 0
          ? "bg-green-600 text-white hover:bg-green-700"
          : "cursor-not-allowed bg-slate-200 text-slate-500"
      }`}
    >
      <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </Icon>
      <span>Buy Now</span>
    </button>
  </div>
  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
    Fast checkout with secure payment
  </p>
</div>
</div>
  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Product Overview</p>
      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
        {productDescription.overview || "No product description available yet."}
      </p>

      {keyFeatures.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-900">Key Features</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {(showFullDetails ? keyFeatures : keyFeatures.slice(0, 4)).map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] font-bold text-green-700">
                  {index + 1}
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(keyFeatures.length > 4 || (product?.description || "").length > 220) && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowFullDetails((prev) => !prev)}
            className="text-sm font-semibold text-green-700 transition hover:text-green-800 hover:underline"
          >
            {showFullDetails ? "See less" : "See more"}
          </button>
        </div>
      )}

      {showFullDetails && product?.description && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm font-semibold text-slate-900">Full Product Details</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {product.description}
          </p>
        </div>
      )}

      {product.features && (
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {product.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </Icon>
              {f}
            </li>
          ))}
        </ul>
      )}
    </section>

    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Specifications</p>
      <dl className="mt-4 space-y-4 text-sm">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
          <dt className="font-medium text-slate-500">Brand</dt>
          <dd className="text-right font-semibold text-slate-900">{product.brand || "Generic"}</dd>
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
          <dt className="font-medium text-slate-500">Category</dt>
          <dd className="text-right font-semibold text-slate-900">{product.category || "Uncategorized"}</dd>
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
          <dt className="font-medium text-slate-500">Availability</dt>
          <dd className={`text-right font-semibold ${availableStock > 0 ? "text-green-700" : "text-red-600"}`}>
            {availableStock > 0 ? `${availableStock} unit${availableStock === 1 ? "" : "s"} left` : "Out of stock"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="font-medium text-slate-500">Seller Notes</dt>
          <dd className="max-w-[16rem] text-right text-slate-600">
            Carefully review the feature list and description before placing your order.
          </dd>
        </div>
      </dl>
    </aside>
  </div>
</div>
</div>

          <div className="mt-12 grid gap-6 border-t border-slate-200 pt-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Customer Reviews</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-bold text-slate-900">{(Number(product.averageRating) || 0).toFixed(1)}</span>
                <div className="pb-1">
                  <RatingStars
                    rating={product.averageRating}
                    reviewCount={product.reviewCount}
                    showCount
                    sizeClass="h-[18px] w-[18px]"
                    textClass="text-sm text-slate-500"
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Based on {product.reviewCount || 0} verified review{product.reviewCount === 1 ? '' : 's'}.
              </p>

              <div className="mt-5 space-y-3">
                {reviewBreakdownRows.map(({ star, count, percentage }) => (
                  <div key={star} className="grid grid-cols-[34px_minmax(0,1fr)_36px] items-center gap-3 text-sm">
                    <span className="font-medium text-slate-600">{star}★</span>
                    <div className="h-2 overflow-hidden bg-slate-200">
                      <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-right text-slate-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Ratings & Reviews</h3>
                <span className="text-sm font-medium text-slate-500">Newest first</span>
              </div>

              {productReviews.length === 0 ? (
                <div className="py-10 text-sm text-slate-500">
                  This product has no customer reviews yet. Reviews will appear here after buyers confirm delivery and submit their ratings.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {productReviews.map((review) => (
                    <div key={review.orderId} className="py-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900">{review.reviewerName}</p>
                            {review.verifiedBuyer && (
                              <span className="bg-green-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700">
                                Verified buyer
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-400">Order {review.orderNumber}</p>
                        </div>
                        <p className="text-sm text-slate-400">{formatReviewDate(review.date)}</p>
                      </div>

                      <div className="mt-3">
                        <RatingStars rating={review.rating} sizeClass="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Explore More */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Explore More</h3>
            {exploreProducts.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">No more products available right now.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 px-1">
                {exploreProducts.map(p => (
                  <ProductCard key={p.id} product={p} addToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>

      <Footer />

      {isBuyNowOpen && product ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="Close buy now modal"
            onClick={() => setIsBuyNowOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-buyNowFade"
          />

          <div className="absolute inset-x-0 bottom-0 animate-buyNowSheet md:left-1/2 md:top-1/2 md:w-[min(760px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2">
            <div className="flex max-h-[50vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-24px_70px_rgba(15,23,42,0.24)] md:max-h-[86vh] md:rounded-[28px] md:shadow-[0_32px_100px_rgba(15,23,42,0.24)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-7">
                <div>
                  <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200 md:hidden" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Instant Checkout</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 md:text-xl">Buy {product.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuyNowOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="hidden bg-slate-100 md:block">
                    <div className="flex h-full items-center justify-center p-6">
                      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
                        <Image
                          preset="detail"
                          variant="cover"
                          className="h-[320px] w-[220px] object-cover"
                          src={previewImage}
                          alt={product.name}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 md:p-7">
                    <div className="flex items-start gap-4 md:hidden">
                      <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                        <Image
                          preset="thumb"
                          variant="cover"
                          className="h-24 w-24 object-cover"
                          src={previewImage}
                          alt={product.name}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-base font-bold text-slate-900">{product.name}</h4>
                        <p className="mt-1 text-sm text-slate-500">{product.brand || "LantaXpress"}</p>
                        <p className="mt-3 text-lg font-bold text-slate-900">₦{effectivePrice.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-sm font-semibold text-green-700">Ready for express checkout</p>
                      <p className="mt-3 text-3xl font-bold leading-tight text-slate-900">₦{effectivePrice.toLocaleString()}</p>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Review the quantity and continue to the same payment flow used on checkout. Shipping remains free and tax is calculated automatically.
                      </p>
                    </div>

                    <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:mt-8 md:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Quantity</p>
                          <p className="mt-1 text-sm text-slate-500">Adjust before continuing to payment</p>
                        </div>
                        <div className="flex items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                          <button
                            type="button"
                            onClick={decreaseSelectedQuantity}
                            disabled={quantity <= 1}
                            className="flex h-11 w-11 items-center justify-center text-lg text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                          >
                            -
                          </button>
                          <span className="min-w-[3rem] text-center text-base font-semibold text-slate-900">{quantity}</span>
                          <button
                            type="button"
                            onClick={increaseSelectedQuantity}
                            disabled={quantity >= availableStock}
                            className="flex h-11 w-11 items-center justify-center text-lg text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                      <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                        <span>{product.name} × {quantity}</span>
                        <span className="font-semibold text-slate-900">₦{(effectivePrice * quantity).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-green-700">Free</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                        <span>Tax</span>
                        <span className="font-semibold text-slate-900">₦{(effectivePrice * quantity * 0.08).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Total</span>
                          <span className="text-2xl font-bold text-slate-900">₦{(effectivePrice * quantity * 1.08).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:mt-6 md:flex-row">
                      <button
                        type="button"
                        onClick={() => setIsBuyNowOpen(false)}
                        className="flex h-12 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold uppercase tracking-[0.08em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900 md:flex-1"
                      >
                        Keep Browsing
                      </button>
                      <button
                        type="button"
                        onClick={handleBuyNowCheckout}
                        className="flex h-12 items-center justify-center rounded-full bg-[#f68b1e] px-5 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-lg shadow-[#f68b1e]/25 transition hover:bg-[#e07d16] md:flex-[1.35]"
                      >
                        Pay Now
                      </button>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-400">
                      You will continue to the checkout payment page with this product only. Your existing cart will stay unchanged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>
            {`
              @keyframes buyNowFade {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              @keyframes buyNowSheet {
                from { transform: translateY(28px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }

              .animate-buyNowFade {
                animation: buyNowFade 0.22s ease-out;
              }

              .animate-buyNowSheet {
                animation: buyNowSheet 0.3s ease-out;
              }

              @media (min-width: 768px) {
                @keyframes buyNowSheet {
                  from { transform: translate(-50%, calc(-50% + 18px)) scale(0.98); opacity: 0; }
                  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
              }
            `}
          </style>
        </div>
      ) : null}
    </div>
  );
};