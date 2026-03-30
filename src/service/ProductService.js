// src/service/ProductService.js
const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const createLoadError = (message, extra = {}) => Object.assign(new Error(message), extra);

async function fetchJson(url, options = {}) {
  let res;

  try {
    res = await fetch(url, options);
  } catch (error) {
    throw createLoadError("Network error", {
      isNetworkError: true,
      cause: error,
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw createLoadError(text || `Request failed: ${res.status}`, {
      status: res.status,
      isNetworkError: false,
    });
  }

  return res.json();
}

const resolveDiscountPercent = (productPrice, discountPercent, discountPrice) => {
  const parsedPrice = Number(productPrice) || 0;
  const parsedPercent = Number(discountPercent);
  const parsedDiscountPrice = Number(discountPrice);

  if (Number.isFinite(parsedPercent) && parsedPercent > 0 && parsedPercent < 100) {
    return parsedPercent;
  }

  if (parsedPrice > 0 && Number.isFinite(parsedDiscountPrice) && parsedDiscountPrice > 0 && parsedDiscountPrice < parsedPrice) {
    return Math.round(((parsedPrice - parsedDiscountPrice) / parsedPrice) * 100);
  }

  return 0;
};

const resolveDiscountPrice = (productPrice, discountPercent, discountPrice) => {
  const parsedPrice = Number(productPrice) || 0;
  const parsedPercent = Number(discountPercent);
  const parsedDiscountPrice = Number(discountPrice);

  if (parsedPrice > 0 && Number.isFinite(parsedPercent) && parsedPercent > 0 && parsedPercent < 100) {
    return Math.round(parsedPrice * (1 - parsedPercent / 100) * 100) / 100;
  }

  if (parsedPrice > 0 && Number.isFinite(parsedDiscountPrice) && parsedDiscountPrice > 0 && parsedDiscountPrice < parsedPrice) {
    return parsedDiscountPrice;
  }

  return null;
};

const mapProduct = (p) => {
  const originalPrice = Number(p.price) || 0;
  const discountPercent = resolveDiscountPercent(p.price, p.discountPercent, p.discountPrice);
  const discountPrice = resolveDiscountPrice(p.price, p.discountPercent, p.discountPrice);

  return {
    id: p._id,
    name: p.name,
    description: p.description,
    price: discountPrice ?? originalPrice,
    originalPrice,
    discountPrice,
    discountPercent,
    category: p.category || "Uncategorized",
    image: (p.images && p.images[0]) || "/placeholder.png",
    brand: p.seller?.brandName || p.brand || "",
    stock: p.stock || 0,
    status: p.status || "approved",
  };
};

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