import React, { useEffect, useMemo, useState } from 'react';

const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

const PRESET_TRANSFORMS = {
  default: 'f_auto,q_auto,dpr_auto',
  card: 'f_auto,q_auto,dpr_auto,c_fill,g_auto,w_480,h_720',
  category: 'f_auto,q_auto,dpr_auto,c_fill,g_auto,w_640,h_384',
  thumb: 'f_auto,q_auto,dpr_auto,c_fill,g_auto,w_192,h_192',
  detail: 'f_auto,q_auto,dpr_auto,c_limit,w_1200,h_1200',
};

const isCloudinaryUrl = (src) =>
  typeof src === 'string' && src.includes('res.cloudinary.com') && src.includes(CLOUDINARY_UPLOAD_SEGMENT);

const getTransformedCloudinaryUrl = (src, transform) => {
  if (!isCloudinaryUrl(src) || !transform) {
    return src;
  }

  const [basePart, remainder] = src.split(CLOUDINARY_UPLOAD_SEGMENT);
  if (!remainder) {
    return src;
  }

  return `${basePart}${CLOUDINARY_UPLOAD_SEGMENT}${transform}/${remainder}`;
};

export const Image = ({
  className,
  children,
  variant,
  contentKey,
  src,
  alt,
  preset = 'default',
  fallbackSrc = '/placeholder.png',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  onError,
  ...props
}) => {
  const optimizedSrc = useMemo(() => {
    const transform = PRESET_TRANSFORMS[preset] || PRESET_TRANSFORMS.default;
    return getTransformedCloudinaryUrl(src, transform);
  }, [preset, src]);

  const [currentSrc, setCurrentSrc] = useState(optimizedSrc || fallbackSrc);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(optimizedSrc || fallbackSrc);
    setHasTriedFallback(false);
  }, [fallbackSrc, optimizedSrc]);

  const handleError = (event) => {
    if (!hasTriedFallback && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasTriedFallback(true);
    }

    if (onError) {
      onError(event);
    }
  };

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchpriority={fetchPriority}
      onError={handleError}
      {...props}
    />
  );
};

