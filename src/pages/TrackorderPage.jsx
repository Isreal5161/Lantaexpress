import React, { useState } from "react"; 
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Header } from "../components/header";
import { Footer, footer} from "../components/footer";
import { Icon } from "../components/Icon";
import { Text } from "../components/Text";

export const TrackorderPage = () => {
  return (
    <div className="trackorderpage">
      <Header />
      <div className="trackorderpage-content">
        <Text text="Track Your Order" />
        <div className="trackorderpage-inputs">
          <input type="text" placeholder="Enter Order ID" />
          <Button text="Track Order" />
        </div>
      </div>
      <Footer />
    </div>
  );
};