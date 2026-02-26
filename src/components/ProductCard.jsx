import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "./Image";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { ShoppingCart } from "lucide-react";

export const ProductCard = ({ product, addToCart }) => {
  const [showButton, setShowButton] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

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

          {/* Add to Cart Icon Button */}
<button
  onClick={(e) => {
    e.preventDefault(); // prevent link navigation
    addToCart(product);
    setIsAdded(!isAdded);
  }}
  className={`absolute bottom-3 right-3 p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${
    isAdded
      ? "bg-green-600 text-white"
      : "bg-white text-slate-700 hover:bg-green-100"
  } ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
>
  <ShoppingCart size={18} />
</button>
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