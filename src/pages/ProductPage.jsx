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
import { ProductDetailSkeleton, ProductGridSkeleton } from '../components/LoadingSkeletons';

export const ProductPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingExplore, setLoadingExplore] = useState(true);

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          // fallback default
          setProduct({
            id: 1,
            name: "Premium Noise-Cancelling Headphones",
            price: 299,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
            description: "Experience pure sound with our industry-leading noise cancelling technology.",
            rating: 5,
            features: [
              "Active Noise Cancellation",
              "30-hour battery life",
              "Premium leather ear cushions",
              "2-year warranty included"
            ]
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch Explore More products
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        setLoadingExplore(true);
        const data = await getProducts();
        // exclude current product
        const filtered = data?.filter(p => p.id.toString() !== id) || [];
        setExploreProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingExplore(false);
      }
    };
    fetchExplore();
  }, [id]);

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

      <main className="pb-20 md:pb-0">
        {loadingProduct || !product ? (
          <ProductDetailSkeleton />
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
  <p className="text-2xl font-bold text-slate-900 mb-6">₦{product.price}</p>

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
            {loadingExplore ? (
              <ProductGridSkeleton count={4} imageClassName="h-40" />
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