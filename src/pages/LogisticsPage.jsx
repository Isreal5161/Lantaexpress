import React, { useState } from "react"; 
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Header } from "../components/header";
import { Footer, footer} from "../components/footer";
import { Icon } from "../components/Icon";
import { Text } from "../components/Text";

export const LogisticsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setSelectedFile(e.target.files[0]);
  }
};
  return (
    
    <div className="font-body text-slate-600 bg-white">
       <Header />
      {/* HERO SECTION */}
      <section className="bg-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fast, Safe & Reliable Logistics
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            From pickup to delivery, Lanta Express ensures your package
            arrives safely and on time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#booking"
              className="bg-white text-green-700 px-8 py-3 font-bold hover:bg-slate-100 transition"
            >
              Book Order Now
            </a>

            <Link
              href="track.html"
              className="border border-white px-8 py-3 font-bold hover:bg-white hover:text-green-700 transition"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="font-bold text-lg mb-2">Book Pickup</h3>
              <p>Schedule a pickup through our booking form.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">We Pick Up</h3>
              <p>Our rider collects your package securely.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Secure Transport</h3>
              <p>Your item is handled with maximum care.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Delivered Safely</h3>
              <p>Fast and safe delivery to destination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Your Package Is Safe With Us
          </h2>
          <p className="max-w-3xl mx-auto text-lg">
            We use real-time tracking, secure packaging, and verified riders
            to ensure your goods arrive in perfect condition.
          </p>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="booking" className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Book a Delivery
          </h2>
<form className="space-y-4 bg-white p-8 shadow-md">

  <input
    type="text"
    placeholder="Full Name"
    className="w-full border p-3"
  />

  <input
    type="tel"
    placeholder="Phone Number"
    className="w-full border p-3"
  />

  <input
    type="text"
    placeholder="Pickup Address"
    className="w-full border p-3"
  />

  <input
    type="text"
    placeholder="Delivery Address"
    className="w-full border p-3"
  />

  <textarea
    placeholder="Package Description"
    className="w-full border p-3"
  />

  {/* Image uploader */}
  <div>
    <label className="block mb-2 font-medium">Upload Package Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full border p-3"
    />
    {selectedFile && (
      <p className="mt-2 text-sm text-green-700">
        Selected file: {selectedFile.name}
      </p>
    )}
  </div>

  <Button className="w-full bg-green-600 text-white py-3 hover:bg-green-700">
    Submit Booking
  </Button>

</form>
        </div>
      </section>
     <Footer />
    </div>
    
  );
};