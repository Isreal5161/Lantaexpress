import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCart } from "../context/CartContextTemp";
import { getProductById, getProducts } from "../service/ProductService";
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ProductCard } from '../components/ProductCard';
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

      <main className="pb-20 md:pb-0">
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
                  variant="cover"
                  className="w-full h-full object-center object-cover"
                  src={product.image}
                  alt={product.name}
                />
              </div>
            </div>
{/* Info */}
<div>
  <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
    {product.name}
  </h1>
  <div className="flex items-center mb-4">
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </Icon>
      ))}
    </div>
    <Text className="ml-2 text-sm text-slate-500">{product.reviews || 0} reviews</Text>
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