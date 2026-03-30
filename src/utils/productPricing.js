export const getOriginalProductPrice = (product) => {
  const rawPrice = product?.originalPrice ?? product?.price;
  const parsedPrice = Number(rawPrice);

  return Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0;
};

export const getDiscountProductPrice = (product) => {
  const originalPrice = getOriginalProductPrice(product);
  const parsedDiscountPercent = Number(product?.discountPercent);
  const parsedDiscountPrice = Number(product?.discountPrice);

  if (Number.isFinite(parsedDiscountPercent) && parsedDiscountPercent > 0 && parsedDiscountPercent < 100 && originalPrice > 0) {
    return Math.round(originalPrice * (1 - parsedDiscountPercent / 100) * 100) / 100;
  }

  if (Number.isFinite(parsedDiscountPrice) && parsedDiscountPrice > 0 && parsedDiscountPrice < originalPrice) {
    return parsedDiscountPrice;
  }

  return null;
};

export const getEffectiveProductPrice = (product) => {
  const discountPrice = getDiscountProductPrice(product);
  if (discountPrice !== null) {
    return discountPrice;
  }

  return getOriginalProductPrice(product);
};

export const hasActiveProductDiscount = (product) => {
  const originalPrice = getOriginalProductPrice(product);
  const effectivePrice = getEffectiveProductPrice(product);

  return originalPrice > 0 && effectivePrice > 0 && effectivePrice < originalPrice;
};

export const getProductDiscountPercent = (product) => {
  const explicitPercent = Number(product?.discountPercent);

  if (Number.isFinite(explicitPercent) && explicitPercent > 0 && explicitPercent < 100) {
    return Math.round(explicitPercent);
  }

  if (!hasActiveProductDiscount(product)) {
    return 0;
  }

  const originalPrice = getOriginalProductPrice(product);
  const effectivePrice = getEffectiveProductPrice(product);

  return Math.round(((originalPrice - effectivePrice) / originalPrice) * 100);
};