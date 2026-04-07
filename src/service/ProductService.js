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

const defaultRatingBreakdown = () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

const mapReview = (review) => ({
  orderId: review.orderId,
  orderNumber: review.orderNumber,
  rating: Number(review.rating) || 0,
  comment: review.comment || "",
  date: review.date || null,
  reviewerName: review.reviewerName || "Verified buyer",
  verifiedBuyer: Boolean(review.verifiedBuyer),
});

const mapProduct = (p) => {
  const originalPrice = Number(p.price) || 0;
  const discountPercent = resolveDiscountPercent(p.price, p.discountPercent, p.discountPrice);
  const discountPrice = resolveDiscountPrice(p.price, p.discountPercent, p.discountPrice);
  const normalizedDiscountEndsAt = p.discountEndsAt || null;
  const normalizedFlashSaleEndsAt = p.flashSaleEndsAt || null;

  return {
    id: p._id,
    name: p.name,
    description: p.description,
    keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures.filter(Boolean) : [],
    price: discountPrice ?? originalPrice,
    originalPrice,
    discountPrice,
    discountPercent,
    category: p.category || "Uncategorized",
    image: (p.images && p.images[0]) || "/placeholder.png",
    brand: p.seller?.brandName || p.brand || "",
    stock: p.stock || 0,
    status: p.status || "approved",
    averageRating: Number(p.averageRating) || 0,
    reviewCount: Number(p.reviewCount) || 0,
    ratingBreakdown: p.ratingBreakdown || defaultRatingBreakdown(),
    reviews: Array.isArray(p.reviews) ? p.reviews.map(mapReview) : [],
    discountEndsAt: normalizedDiscountEndsAt,
    isFlashSale: Boolean(p.isFlashSale),
    flashSaleEndsAt: normalizedFlashSaleEndsAt,
    isMostWanted: Boolean(p.isMostWanted),
    pickupStationFee: Math.max(Number(p.pickupStationFee) || 0, 0),
    homeDeliveryFee: Math.max(Number(p.homeDeliveryFee) || 0, 0),
  };
};

export const getProducts = async () => {
  const products = await fetchJson(`${API_BASE}/user/products`);
  return (products || []).map(mapProduct);
};

export const getProductById = async (id) => {
  const product = await fetchJson(`${API_BASE}/user/products/${id}`);
  return product ? mapProduct(product) : null;
};

export const getProductsByCategory = async (categoryName) => {
  const all = await getProducts();
  if (!categoryName || categoryName === "All" || categoryName === "All Products") return all;
  return all.filter(p => p.category === categoryName);
};

export const getHotDeals = async () => {
  const all = await getProducts();
  return all
    .filter((product) => product.discountPrice !== null && product.discountPrice < product.originalPrice)
    .sort((firstProduct, secondProduct) => {
      const firstDiscount = firstProduct.discountPercent || 0;
      const secondDiscount = secondProduct.discountPercent || 0;
      return secondDiscount - firstDiscount;
    });
};

export const getTrendingNow = async () => {
  const all = await getProducts();
  return all.filter((product) => product.isMostWanted).slice(0, 4);
};

export const getFlashSaleProducts = async () => {
  const all = await getProducts();
  return all
    .filter((product) => product.isFlashSale)
    .sort((firstProduct, secondProduct) => {
      const firstDate = firstProduct.flashSaleEndsAt ? new Date(firstProduct.flashSaleEndsAt).getTime() : Number.MAX_SAFE_INTEGER;
      const secondDate = secondProduct.flashSaleEndsAt ? new Date(secondProduct.flashSaleEndsAt).getTime() : Number.MAX_SAFE_INTEGER;
      return firstDate - secondDate;
    });
};

export const getMostWantedProducts = async () => {
  const all = await getProducts();
  return all.filter((product) => product.isMostWanted);
};