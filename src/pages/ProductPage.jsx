import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
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

export const ProductPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState(null);
  const effectivePrice = getEffectiveProductPrice(product || {});
  const originalPrice = getOriginalProductPrice(product || {});
  const hasDiscount = hasActiveProductDiscount(product || {});
  const discountPercent = getProductDiscountPercent(product || {});
  const productReviews = product?.reviews || [];
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
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden">
                <Image
                  preset="detail"
                  variant="cover"
                  className="w-full h-full object-center object-cover"
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
{/* Info */}
<div>
  <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
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

{/* Quantity + Long Rectangular Cart Icon Button */}
<div className="flex items-center gap-3 mb-6">
  {/* Quantity Selector */}
  <div className="flex items-center border border-gray-300 overflow-hidden">
    <button
      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
      onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
    >
      -
    </button>
    <span className="px-4 py-1 text-center">{quantity}</span>
    <button
      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
      onClick={() => setQuantity(prev => prev + 1)}
    >
      +
    </button>
  </div>

  {/* Long Rectangular Cart Icon Button */}
  <button
    onClick={() => addToCart({ ...product, quantity })}
    className="flex items-center justify-center w-32 h-10 bg-green-600 hover:bg-green-700 shadow-md transition-all"
    title="Add to Cart"
  >
    <Icon
      className="h-6 w-6 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M3 3h2l.4 2M7 13h14l-1.5 8H6.5L5 13zm0 0L3 3m4 10v6m6-6v6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  </button>
</div>
  {/* Product Details Subtitle */}
  <h2 className="mt-8 text-xl font-semibold text-slate-900">Product Details</h2>

  {/* Description */}
  <p className="text-slate-600 mt-2">{product.description}</p>

  {/* Features */}
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
    </div>
  );
};