const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
const HERO_SLIDES_CACHE_KEY = "lantaxpress:hero-slides";
const HERO_SLIDES_CACHE_TTL_MS = 5 * 60 * 1000;
const heroMediaPreloadSet = new Set();
let hasHeroWarmupStarted = false;

const DEFAULT_HERO_SLIDES = [
  {
    id: "hero-1",
    eyebrow: "Marketplace Picks",
    title: "Buy smarter from",
    highlight: "trusted sellers",
    desc: "Fresh product drops, cleaner pricing, and a faster route from browsing to delivery.",
    primaryText: "Shop now",
    primaryLink: "/shop",
    secondaryText: "Flash sales",
    secondaryLink: "/flash-sales",
    mediaUrl: "/lantaexpressimage1.jpg",
    mediaType: "image",
    imageFit: "object-contain",
    accent: "from-emerald-600 via-green-600 to-lime-500",
    surface: "from-emerald-50 via-white to-lime-50",
    badge: "Best picks",
    metrics: ["Verified sellers", "Fast checkout", "Daily deals"],
  },
  {
    id: "hero-2",
    eyebrow: "Nationwide Logistics",
    title: "From seller pickup to",
    highlight: "doorstep delivery",
    desc: "Track orders with fewer guess points and clearer delivery movement across states.",
    primaryText: "Track order",
    primaryLink: "/track",
    secondaryText: "Logistics",
    secondaryLink: "/logistics",
    mediaUrl: "/FastDelivery.mov",
    mediaType: "video",
    imageFit: "object-contain",
    accent: "from-sky-600 via-cyan-600 to-emerald-500",
    surface: "from-cyan-50 via-white to-emerald-50",
    badge: "Delivery live",
    metrics: ["Track updates", "Statewide reach", "Reliable dispatch"],
  },
  {
    id: "hero-3",
    eyebrow: "Hot Sales",
    title: "Enter the deal lane with",
    highlight: "sharper markdowns",
    desc: "Browse cleaner campaign pages for discounted products, curated offers, and fast-selling inventory.",
    primaryText: "Hot sales",
    primaryLink: "/hot-sales",
    secondaryText: "Shop all",
    secondaryLink: "/shop",
    mediaUrl: "/perfumes.jpg",
    mediaType: "image",
    imageFit: "object-contain",
    accent: "from-orange-500 via-amber-500 to-yellow-400",
    surface: "from-orange-50 via-white to-amber-50",
    badge: "Sale season",
    metrics: ["Discount drops", "Fast-moving stock", "Curated campaigns"],
  },
];

const normalizeHeroSlide = (slide, index) => ({
  id: slide._id || slide.id || `hero-${index}`,
  eyebrow: slide.eyebrow || "",
  title: slide.title || "",
  highlight: slide.highlight || "",
  desc: slide.desc || "",
  primaryText: slide.primaryText || "Shop now",
  primaryLink: slide.primaryLink || "/shop",
  secondaryText: slide.secondaryText || "Learn more",
  secondaryLink: slide.secondaryLink || "/shop",
  badge: slide.badge || "Featured",
  metrics: Array.isArray(slide.metrics) ? slide.metrics.filter(Boolean) : [],
  mediaUrl: slide.mediaUrl || slide.image || "",
  mediaType: slide.mediaType || "image",
  imageFit: slide.imageFit || "object-contain",
  accent: slide.accent || "from-emerald-600 via-green-600 to-lime-500",
  surface: slide.surface || "from-emerald-50 via-white to-lime-50",
  sortOrder: Number(slide.sortOrder) || 0,
  isActive: slide.isActive !== false,
});

const readHeroSlidesCache = ({ allowStale = false } = {}) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(HERO_SLIDES_CACHE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    const slides = Array.isArray(parsedValue?.slides)
      ? parsedValue.slides.map(normalizeHeroSlide).filter((slide) => slide.isActive)
      : [];

    if (!slides.length) {
      return [];
    }

    const isFresh = Date.now() - Number(parsedValue?.savedAt || 0) < HERO_SLIDES_CACHE_TTL_MS;
    if (!allowStale && !isFresh) {
      return [];
    }

    return slides;
  } catch (error) {
    return [];
  }
};

const writeHeroSlidesCache = (slides) => {
  if (typeof window === "undefined" || !Array.isArray(slides) || !slides.length) {
    return;
  }

  try {
    window.localStorage.setItem(
      HERO_SLIDES_CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        slides,
      }),
    );
  } catch (error) {
    // Ignore cache write failures.
  }
};

const preloadImage = (src) => {
  if (typeof window === "undefined" || !src || heroMediaPreloadSet.has(src)) {
    return;
  }

  heroMediaPreloadSet.add(src);
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
};

const preloadVideo = (src) => {
  if (typeof document === "undefined" || !src || heroMediaPreloadSet.has(src)) {
    return;
  }

  heroMediaPreloadSet.add(src);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.src = src;
};

export const getDefaultHeroSlides = () => DEFAULT_HERO_SLIDES.map(normalizeHeroSlide);

export const getHeroSlidesSnapshot = () => {
  const cachedSlides = readHeroSlidesCache({ allowStale: true });
  return cachedSlides.length > 0 ? cachedSlides : getDefaultHeroSlides();
};

export const preloadHeroSlideMedia = (slides) => {
  slides.slice(0, 2).forEach((slide) => {
    if (slide.mediaType === "video") {
      preloadVideo(slide.mediaUrl);
      return;
    }

    preloadImage(slide.mediaUrl);
  });
};

export const warmHeroMedia = () => {
  if (hasHeroWarmupStarted || typeof window === "undefined") {
    return;
  }

  hasHeroWarmupStarted = true;
  const snapshotSlides = getHeroSlidesSnapshot();
  preloadHeroSlideMedia(snapshotSlides);
};

export const getHeroSlides = async () => {
  const cachedSlides = readHeroSlidesCache({ allowStale: true });

  try {
    const response = await fetch(`${API_BASE}/user/hero-slides`);
    if (!response.ok) {
      throw new Error(`Failed to load hero slides: ${response.status}`);
    }

    const data = await response.json();
    const normalized = Array.isArray(data)
      ? data.map(normalizeHeroSlide).filter((slide) => slide.isActive)
      : [];

    if (normalized.length > 0) {
      writeHeroSlidesCache(normalized);
      preloadHeroSlideMedia(normalized);
      return normalized;
    }

    if (cachedSlides.length > 0) {
      return cachedSlides;
    }

    const defaultSlides = getDefaultHeroSlides();
    preloadHeroSlideMedia(defaultSlides);
    return defaultSlides;
  } catch (error) {
    if (cachedSlides.length > 0) {
      preloadHeroSlideMedia(cachedSlides);
      return cachedSlides;
    }

    const defaultSlides = getDefaultHeroSlides();
    preloadHeroSlideMedia(defaultSlides);
    return defaultSlides;
  }
};

warmHeroMedia();