import React from "react";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Text } from "../components/Text";

export const TrackorderPage = () => {
  return (
    <div className="trackorderpage min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content grows to fill remaining space */}
      <div className="trackorderpage-content flex-grow flex flex-col items-center justify-center px-4">
        <Text text="Track Your Order" className="text-2xl font-bold mb-6" />
        <div className="trackorderpage-inputs flex gap-4">
          <input
            type="text"
            placeholder="Enter Order ID"
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <Button text="Track Order" />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};