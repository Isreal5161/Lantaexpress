import React, { useState } from "react";
import { MdStorefront, MdClose } from "react-icons/md";

export const BecomeSeller = ({ position = "left", offsetBottom = 80 }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const positionStyle = {
    [position]: "16px",
    bottom: `${offsetBottom}px`,
  };

  return (
    <div style={positionStyle} className="fixed z-50">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-3 -right-3 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition"
          title="Close"
        >
          <MdClose className="w-4 h-4" />
        </button>

        {/* Main Circular Button */}
        <a
          href="https://whatsapp.com/channel/0029Vb7MQdK3LdQNcnvMxE3h"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center relative hover:scale-110 transition-transform"
          title="Become a Seller"
        >
          {/* Icon in center with pulse animation */}
          <MdStorefront className="w-7 h-7 z-10 animate-pulse-slow" />

          {/* Rotating Circular Text */}
          <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-spin-slow">
            <defs>
              <path
                id="circlePath"
                d="M50,50 m-32,0 a32,32 0 1,1 64,0 a32,32 0 1,1 -64,0"
                fill="transparent"
              />
            </defs>
            <text fontSize="6" fill="white" letterSpacing="0.5">
              <textPath
                href="#circlePath"
                startOffset="25%"
                textAnchor="middle"
              >
                BECOME A SELLER
              </textPath>
            </text>
          </svg>
        </a>
      </div>
    </div>
  );
};