// src/service/ProductService.js
const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

const mapProduct = (p) => ({
  id: p._id,
  name: p.name,
  description: p.description,
  price: p.price,
  category: p.category || "Uncategorized",
  image: (p.images && p.images[0]) || "/placeholder.png",
  brand: p.seller?.brandName || p.brand || "",
  stock: p.stock || 0,
  status: p.status || "approved",
});

export const getProducts = async () => {
  const products = await fetchJson(`${API_BASE}/user/products`);
  return (products || []).map(mapProduct);
};

export const getProductById = async (id) => {
  const products = await getProducts();
  return products.find(p => p.id.toString() === id.toString()) || null;
};

export const getProductsByCategory = async (categoryName) => {
  const all = await getProducts();
  if (!categoryName || categoryName === "All" || categoryName === "All Products") return all;
  return all.filter(p => p.category === categoryName);
};

export const getHotDeals = async () => {
  const all = await getProducts();
  return all.slice(0, 4);
};

export const getTrendingNow = async () => {
  const all = await getProducts();
  return all.slice(0, 4);
};