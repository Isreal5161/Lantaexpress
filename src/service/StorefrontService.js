const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";
const STOREFRONT_SETTINGS_CACHE_KEY = "lantaxpress:storefront-settings";
const STOREFRONT_SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000;

const DEFAULT_STOREFRONT_SETTINGS = {
  deliveryMinDays: null,
  deliveryMaxDays: null,
  returnWindowDays: null,
  shippingPolicyTitle: "Shipping Policy",
  shippingPolicyContent:
    "Delivery timelines start from the day an order is placed. Home delivery is attempted within the stated delivery window, while pickup station orders are held for customer collection within the same period.",
  returnPolicyTitle: "Return Policy",
  returnPolicyContent:
    "Eligible items can be returned within the configured return window, provided they are unused and returned with their original packaging.",
  pickupStationPolicyContent:
    "Pickup station delivery starts from the day you place your order until it arrives at your selected pickup station. You will be notified once it is ready for collection.",
  homeDeliveryPolicyContent:
    "Home delivery starts from the day you place your order until the first delivery attempt at your address. Please keep your phone reachable during the delivery window.",
  logisticsRateUnit: "kilometer",
  logisticsRateValue: 1000,
  logisticsBaseFee: 0,
  logisticsMinimumFee: 0,
  logisticsSupportPhone: "",
  logisticsSupportEmail: "",
};

const normalizeOptionalDays = (value, { min = 0, max = 60 } = {}) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.min(Math.max(Math.round(numeric), min), max);
};

const normalizeStorefrontSettings = (settings = {}) => {
  const deliveryMinDays = normalizeOptionalDays(settings.deliveryMinDays, { min: 1, max: 30 });
  const deliveryMaxDays = normalizeOptionalDays(settings.deliveryMaxDays, { min: 1, max: 30 });
  const returnWindowDays = normalizeOptionalDays(settings.returnWindowDays, { min: 0, max: 60 });

  return {
    deliveryMinDays,
    deliveryMaxDays: deliveryMaxDays !== null ? Math.max(deliveryMaxDays, deliveryMinDays || 1) : null,
    returnWindowDays,
    shippingPolicyTitle: String(settings.shippingPolicyTitle || DEFAULT_STOREFRONT_SETTINGS.shippingPolicyTitle),
    shippingPolicyContent: String(settings.shippingPolicyContent || DEFAULT_STOREFRONT_SETTINGS.shippingPolicyContent),
    returnPolicyTitle: String(settings.returnPolicyTitle || DEFAULT_STOREFRONT_SETTINGS.returnPolicyTitle),
    returnPolicyContent: String(settings.returnPolicyContent || DEFAULT_STOREFRONT_SETTINGS.returnPolicyContent),
    pickupStationPolicyContent: String(settings.pickupStationPolicyContent || DEFAULT_STOREFRONT_SETTINGS.pickupStationPolicyContent),
    homeDeliveryPolicyContent: String(settings.homeDeliveryPolicyContent || DEFAULT_STOREFRONT_SETTINGS.homeDeliveryPolicyContent),
    logisticsRateUnit: settings.logisticsRateUnit === "meter" ? "meter" : DEFAULT_STOREFRONT_SETTINGS.logisticsRateUnit,
    logisticsRateValue: Math.max(Number(settings.logisticsRateValue) || DEFAULT_STOREFRONT_SETTINGS.logisticsRateValue, 0),
    logisticsBaseFee: Math.max(Number(settings.logisticsBaseFee) || DEFAULT_STOREFRONT_SETTINGS.logisticsBaseFee, 0),
    logisticsMinimumFee: Math.max(Number(settings.logisticsMinimumFee) || DEFAULT_STOREFRONT_SETTINGS.logisticsMinimumFee, 0),
    logisticsSupportPhone: String(settings.logisticsSupportPhone || DEFAULT_STOREFRONT_SETTINGS.logisticsSupportPhone),
    logisticsSupportEmail: String(settings.logisticsSupportEmail || DEFAULT_STOREFRONT_SETTINGS.logisticsSupportEmail),
  };
};

const readStorefrontSettingsCache = ({ allowStale = false } = {}) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STOREFRONT_SETTINGS_CACHE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    const settings = normalizeStorefrontSettings(parsedValue?.settings);
    const isFresh = Date.now() - Number(parsedValue?.savedAt || 0) < STOREFRONT_SETTINGS_CACHE_TTL_MS;

    if (!allowStale && !isFresh) {
      return null;
    }

    return settings;
  } catch {
    return null;
  }
};

const writeStorefrontSettingsCache = (settings) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      STOREFRONT_SETTINGS_CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), settings: normalizeStorefrontSettings(settings) }),
    );
  } catch {
    // Ignore cache failures.
  }
};

export const getDefaultStorefrontSettings = () => ({ ...DEFAULT_STOREFRONT_SETTINGS });

export const getStorefrontSettingsSnapshot = () => {
  const cachedSettings = readStorefrontSettingsCache({ allowStale: true });
  return cachedSettings || getDefaultStorefrontSettings();
};

export const getStorefrontSettings = async () => {
  const cachedSettings = readStorefrontSettingsCache({ allowStale: true });

  try {
    const response = await fetch(`${API_BASE}/user/storefront-settings`);
    if (!response.ok) {
      throw new Error(`Failed to load storefront settings: ${response.status}`);
    }

    const data = await response.json();
    const normalized = normalizeStorefrontSettings(data);
    writeStorefrontSettingsCache(normalized);
    return normalized;
  } catch {
    return cachedSettings || getDefaultStorefrontSettings();
  }
};