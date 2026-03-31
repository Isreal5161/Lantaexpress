import React, { useState } from "react";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const LogisticsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const newRequest = {
      id: "REQ" + Date.now(),
      trackingId: "TRK" + Math.floor(Math.random() * 1000000),
      name: form.name.value,
      phone: form.phone.value,
      pickup: form.pickup.value,
      delivery: form.delivery.value,
      description: form.description.value,
      image: selectedFile ? URL.createObjectURL(selectedFile) : null,
      status: "Pending",
      date: new Date().toLocaleString(),
    };

    const existingRequests =
      JSON.parse(localStorage.getItem("logistics_requests")) || [];
    existingRequests.push(newRequest);
    localStorage.setItem("logistics_requests", JSON.stringify(existingRequests));

    // Increment notifications for admin
    const notifications =
      JSON.parse(localStorage.getItem("logistics_notifications")) || 0;
    localStorage.setItem("logistics_notifications", JSON.stringify(notifications + 1));

    alert("Booking submitted successfully!");
    form.reset();
    setSelectedFile(null);
  };

  return (
    <div className="font-body text-slate-600 bg-white">
      <Header />
      <div className="pb-18">
        <section className="bg-green-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fast, Safe & Reliable Logistics
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-lg">
              From pickup to delivery, Lanta Express ensures your package arrives safely and on time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#booking" className="bg-white text-green-700 px-8 py-3 font-bold hover:bg-slate-100 transition">
                Book Order Now
              </a>
              <Link href="/track" className="border border-white px-8 py-3 font-bold hover:bg-white hover:text-green-700 transition">
                Track Order
              </Link>
            </div>
          </div>
        </section>

        <section id="booking" className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Book a Delivery</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow-md">
              <input name="name" type="text" placeholder="Full Name" required className="w-full border p-3" />
              <input name="phone" type="tel" placeholder="Phone Number" required className="w-full border p-3" />
              <input name="pickup" type="text" placeholder="Pickup Address" required className="w-full border p-3" />
              <input name="delivery" type="text" placeholder="Delivery Address" required className="w-full border p-3" />
              <textarea name="description" placeholder="Package Description" required className="w-full border p-3" />

              <div>
                <label className="block mb-2 font-medium">Upload Package Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-3" />
                {selectedFile && <p className="mt-2 text-sm text-green-700">Selected file: {selectedFile.name}</p>}
              </div>

              <Button className="w-full bg-green-600 text-white py-3 hover:bg-green-700">Submit Booking</Button>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};