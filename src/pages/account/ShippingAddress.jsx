import { useState, useEffect } from "react";

function ShippingAddress() {
  const [address, setAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    // Load shipping address from localStorage
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (err) {
        console.error("Failed to parse shipping address:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    alert("Shipping address saved successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Shipping Address</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={address.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={address.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={address.address}
            onChange={handleChange}
            placeholder="123 Main St"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="Lagos"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ZIP/Postal Code</label>
          <input
            type="text"
            name="zip"
            value={address.zip}
            onChange={handleChange}
            placeholder="100001"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            placeholder="Nigeria"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Save Address
        </button>
      </form>
    </div>
  );
}

export default ShippingAddress;