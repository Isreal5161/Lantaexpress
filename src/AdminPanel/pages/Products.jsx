import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { categories } from "../../service/dummyCategories";

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");

  // Form state for adding new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "LantaXpress",
    category: "",
    stock: "",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    // Flatten all products from dummy categories
    const products = categories.flatMap(cat =>
      cat.products.map(prod => ({ ...prod, category: cat.title }))
    );
    setAllProducts(products);

    // Simulated pending seller uploads
    const pending = [
      {
        id: 101,
        name: "New Smartwatch",
        brand: "LantaXpress",
        stock: 12,
        price: 200,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
        category: "Electronics",
        description: "Pending approval product by seller."
      }
    ];
    setPendingProducts(pending);
  }, []);

  // Filter products by selected category
  const displayedProducts =
    filteredCategory === "All"
      ? allProducts
      : allProducts.filter(prod => prod.category === filteredCategory);

  // Handle adding new product
  const handleAddProduct = e => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert("Please fill all required fields");
      return;
    }

    const id = Date.now(); // simple id
    setAllProducts([{ ...newProduct, id }, ...allProducts]);

    // Reset form
    setNewProduct({
      name: "",
      brand: "LantaXpress",
      category: "",
      stock: "",
      price: "",
      image: "",
      description: "",
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Products Management</h1>

      {/* Notification Badge */}
      {pendingProducts.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6">
          ⚠️ You have {pendingProducts.length} product
          {pendingProducts.length > 1 ? "s" : ""} pending approval
        </div>
      )}

      {/* Add New Product */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          onSubmit={handleAddProduct}
        >
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="col-span-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </form>
      </section>
      {/* Pending Seller Products */}
<section>
  <h2 className="text-xl font-semibold mb-4">Pending Seller Products</h2>
  {pendingProducts.length === 0 ? (
    <p className="text-gray-500">No pending products.</p>
  ) : (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
      {pendingProducts.map(product => (
        <div
          key={product.id}
          className="bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm p-4 flex flex-col"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <p className="text-sm font-medium mt-1">₦{product.price}</p>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
              Approve
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      {/* Existing Products Grid */}
<section className="mb-8">
  <h2 className="text-xl font-semibold mb-4">All Products</h2>
  {displayedProducts.length === 0 ? (
    <p className="text-gray-500">No products found in this category.</p>
  ) : (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
      {displayedProducts.map(product => (
        <div
          key={product.id}
          className="bg-white border rounded-xl shadow-sm p-4 flex flex-col"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <p className="text-sm font-medium mt-1">₦{product.price}</p>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

    </AdminLayout>
  );
}