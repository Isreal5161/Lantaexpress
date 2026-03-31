import React from "react";

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

const buildStarFill = (rating, index) => {
  const safeRating = Number(rating) || 0;
  const value = Math.max(0, Math.min(1, safeRating - index));
  return `${Math.round(value * 100)}%`;
};

export const RatingStars = ({
  rating = 0,
  reviewCount,
  sizeClass = "h-4 w-4",
  textClass = "text-xs text-slate-500",
  showValue = false,
  showCount = false,
  className = "",
}) => {
  const safeRating = Number(rating) || 0;
  const safeReviewCount = Number(reviewCount) || 0;

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div className="flex items-center gap-0.5" aria-label={`${safeRating.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`relative ${sizeClass}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" className={`${sizeClass} text-slate-200`}>
              <path d={STAR_PATH} />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: buildStarFill(safeRating, index) }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className={`${sizeClass} text-amber-400`}>
                <path d={STAR_PATH} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {(showValue || showCount) && (
        <div className={`flex items-center gap-1 ${textClass}`.trim()}>
          {showValue && <span className="font-semibold text-slate-700">{safeRating.toFixed(1)}</span>}
          {showCount && <span>({safeReviewCount})</span>}
        </div>
      )}
    </div>
  );
};