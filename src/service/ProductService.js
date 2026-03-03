// src/service/ProductService.js
import { categories } from "./dummyCategories";

// Flatten all products from all categories
const allProducts = categories.flatMap(category => category.products);

/**
 * Fetch all products
 * Simulates async backend call
 */
export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allProducts), 100); // small delay to simulate fetch
  });
};

/**
 * Fetch single product by ID
 * @param {string|number} id - Product ID
 */
export const getProductById = async (id) => {
  return new Promise((resolve) => {
    const product = allProducts.find(p => p.id.toString() === id.toString());
    resolve(product || null);
  });
};

/**
 * Fetch products by category
 * @param {string} categoryName - Category name
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