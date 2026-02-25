import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- get product ID from URL
import { useCart } from "../context/CartContextTemp";
import { getProductById, getProducts } from "../service/ProductService";
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ProductCard } from '../components/ProductCard';

export const ProductPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams(); // <-- dynamic product ID
  const [product, setProduct] = useState(null);
  const [exploreProducts, setExploreProducts] = useState([]);

  // Fetch main product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          // fallback default if not found
          setProduct({
            id: 1,
            name: "Premium Noise-Cancelling Headphones",
            price: 299,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch products for "Explore More"
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const data = await getProducts();
        setExploreProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExplore();
  }, []);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex text-sm font-medium text-slate-500">
              <Link className="hover:text-slate-900" to="/"> Home </Link>
              <Text className="mx-2"> / </Text>
              <Link className="hover:text-slate-900" to="/shop"> Shop </Link>
              <Text className="mx-2"> / </Text>
              <Text className="text-slate-900"> {product.name} </Text>
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

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-slate-900 mb-6">${product.price}</p>

              {/* Add to Cart */}
              <Button
                variant="primary"
                className="w-full md:flex-1 bg-green-600 text-white py-3 px-6 md:px-8 rounded-none font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => addToCart(product)}
              >
                <Icon
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </Icon>
                Add to Cart
              </Button>

              {/* Description */}
              <p className="text-slate-600 mt-6">{product.description || "This is a great product that delivers quality and style."}</p>
            </div>
          </div>

          {/* Explore More */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Explore More</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 px-1">
              {exploreProducts.map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};