const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const DEFAULT_FLYERS = {
  home: [
    { id: "home-1", title: "Lifestyle Picks", image: "/valentines-day-still-life-design.jpg", link: "/hot-sales", mediaType: "image" },
    { id: "home-2", title: "Beauty Sale", image: "/perfumes.jpg", link: "/hot-sales", mediaType: "image" },
    { id: "home-3", title: "Delivery Motion", image: "/FastDelivery.mov", link: "/flash-sales", mediaType: "video" },
    { id: "home-4", title: "Fresh Market", image: "/farmer-holding-seedling.jpg", link: "/shop", mediaType: "image" },
    { id: "home-5", title: "Seller Motion", image: "/Seller.mov", link: "/flash-sales", mediaType: "video" },
  ],
  "hot-sales": [
    { id: "hot-1", title: "Beauty Sale", image: "/perfumes.jpg", link: "/hot-sales", mediaType: "image" },
    { id: "hot-2", title: "Gift Basket", image: "/18966447.jpg", link: "/hot-sales", mediaType: "image" },
    { id: "hot-3", title: "Smart Seller", image: "/SmartSeller.mov", link: "/hot-sales", mediaType: "video" },
    { id: "hot-4", title: "Market Harvest", image: "/selling-plant-online-close-up-picture-hand-holding-sack-soil.jpg", link: "/shop", mediaType: "image" },
    { id: "hot-5", title: "Fresh Savings", image: "/farmer-holding-seedling.jpg", link: "/hot-sales", mediaType: "image" },
  ],
  "flash-sales": [
    { id: "flash-1", title: "Seller Motion", image: "/Seller.mov", link: "/flash-sales", mediaType: "video" },
    { id: "flash-2", title: "Logistics Motion", image: "/Logistics.mov", link: "/flash-sales", mediaType: "video" },
    { id: "flash-3", title: "Top Picks", image: "/lantaexpressimage1.jpg", link: "/flash-sales", mediaType: "image" },
    { id: "flash-4", title: "Market Picks", image: "/lantaexpressimage2.jpg", link: "/shop", mediaType: "image" },
    { id: "flash-5", title: "Garden Picks", image: "/farmer-holding-seedling.jpg", link: "/flash-sales", mediaType: "image" },
  ],
};

const normalizeFlyer = (flyer, index) => ({
  id: flyer._id || flyer.id || `${flyer.section || "flyer"}-${index}`,
  section: flyer.section,
  title: flyer.title || "",
  image: flyer.image,
  link: flyer.link || "/shop",
  mediaType: flyer.mediaType || "image",
  sortOrder: Number(flyer.sortOrder) || 0,
  isActive: flyer.isActive !== false,
});

export const getDefaultPromotionFlyers = (section) =>
  (DEFAULT_FLYERS[section] || []).map((flyer, index) => normalizeFlyer({ ...flyer, section }, index));

export const getPromotionFlyers = async (section) => {
  try {
    const query = section ? `?section=${encodeURIComponent(section)}` : "";
    const response = await fetch(`${API_BASE}/user/promotions${query}`);
    if (!response.ok) {
      throw new Error(`Failed to load flyers: ${response.status}`);
    }

    const data = await response.json();
    const normalized = Array.isArray(data) ? data.map(normalizeFlyer) : [];
    return normalized.length > 0 ? normalized : getDefaultPromotionFlyers(section);
  } catch (error) {
    return getDefaultPromotionFlyers(section);
  }
};