// src/service/ProductService.js
import { categories } from "./dummyCategories";

// Flatten all products from all categories
const allProducts = categories.flatMap(category => category.products);

/**
 * Fetch all products
 */
export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allProducts), 100);
  });
};

/**
 * Fetch single product by ID
 */
export const getProductById = async (id) => {
  return new Promise((resolve) => {
    const product = allProducts.find(p => p.id.toString() === id.toString());
    resolve(product || null);
  });
};

/**
 * Fetch products by category
 */
export const getProductsByCategory = async (categoryName) => {
  return new Promise((resolve) => {
    if (categoryName === "All Products") {
      resolve(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === categoryName);
      resolve(filtered);
    }
  });
};

/**
 * Fetch Hot Deals (4 newest products)
 */
export const getHotDeals = async () => {
  const sorted = [...allProducts].sort((a, b) => b.id - a.id); // newest first by id
  return sorted.slice(0, 4);
};

/**
 * Fetch Trending Now (4 newest products)
 */
export const getTrendingNow = async () => {
  const sorted = [...allProducts].sort((a, b) => b.id - a.id); // newest first by id
  return sorted.slice(0, 4);
};