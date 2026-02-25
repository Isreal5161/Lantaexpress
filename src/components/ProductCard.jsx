import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "./Image";
import { Icon } from "./Icon";
import { Button } from "./Button";

export const ProductCard = ({ product, addToCart }) => {
  const [showButton, setShowButton] = useState(false);

  return (
    <div
      className="relative border border-gray-200 overflow-hidden group"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      onClick={() => setShowButton(!showButton)}
    >
      {/* Clickable Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden relative">
          <Image
            variant="cover"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={product.image}
            alt={product.name}
          />

          {/* Add to Cart button at bottom */}
          <Button
            onClick={(e) => {
              e.preventDefault(); // prevent link navigation
              addToCart(product);
            }}
            className={`absolute bottom-0 left-0 w-full py-2 text-white bg-green-600 rounded-none text-sm font-bold transition-transform duration-300 ${
              showButton ? "translate-y-0" : "translate-y-full"
            }`}
          >
            Add to Cart
          </Button>
        </div>
      </Link>

      {/* Favorite Heart Icon */}
      <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500">
        <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Icon>
      </div>

      {/* Product Info */}
      <div className="px-1 mt-2">
        <h3 className="text-xs text-slate-700 font-medium">{product.name}</h3>
        <p className="mt-1 text-base font-semibold text-slate-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};