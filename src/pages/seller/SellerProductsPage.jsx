// src/pages/seller/SellerProductsPage.jsx
import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { categories } from "../../service/dummyCategories";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Flatten products from all categories
  useEffect(() => {
    const allProducts = categories.flatMap(cat => cat.products);
    setProducts(allProducts);
  }, []);

  // Filter products by category & search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      console.log("Deleted product id:", id); // Backend placeholder
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...editingProduct, ...product } : p
        )
      );
      console.log("Updated product:", product); // Backend placeholder
    } else {
      const newProduct = { id: Date.now(), ...product };
      setProducts([newProduct, ...products]);
      console.log("Added new product:", newProduct); // Backend placeholder
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">

      {/* Category Dropdown */}
      <div className="relative w-64">
        <button
          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          className="w-full px-4 py-2 border rounded-md bg-white flex justify-between items-center shadow hover:bg-gray-50 transition"
        >
          <span>{selectedCategory || "All Categories"}</span>
          {categoryDropdownOpen ? <MdArrowDropUp size={24} /> : <MdArrowDropDown size={24} />}
        </button>

        {categoryDropdownOpen && (
          <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            <li
              onClick={() => { setSelectedCategory(""); setCategoryDropdownOpen(false); }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              All ({products.length})
            </li>
            {categories.map(cat => (
              <li
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.title); setCategoryDropdownOpen(false); }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              >
                <span>{cat.title}</span>
                <span className="text-xs text-gray-500">({cat.products.length})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>

        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Add Product */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition whitespace-nowrap"
          >
            <MdAdd size={20} />
            <span className="text-sm hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-105 transition"
              onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
            />
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-500 mt-1">${product.price}</p>
            <p className="text-gray-500 mt-1">Stock: {product.stock}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
              product.status === "Active" ? "bg-green-100 text-green-600" : "bg-green-100 text-green-600"
            }`}>
              {product.status || "Active"}
            </span>

            {/* Actions */}
            <div className="flex justify-end mt-3 gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800">
                <MdEdit size={20} />
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Add/Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-800">X</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newProduct = {
                  name: form.name.value,
                  brand: form.brand.value,
                  price: parseFloat(form.price.value),
                  stock: parseInt(form.stock.value),
                  status: form.status.value,
                  category: form.category.value,
                  image: form.image.value,
                  description: form.description.value,
                };
                handleSaveProduct(newProduct);
              }}
              className="px-6 py-4 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Product Name" defaultValue={editingProduct?.name || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" required />
                <input type="text" name="brand" placeholder="Brand" defaultValue={editingProduct?.brand || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="number" name="price" placeholder="Price" defaultValue={editingProduct?.price || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" required />
                <input type="number" name="stock" placeholder="Stock" defaultValue={editingProduct?.stock || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" required />
                <select name="status" defaultValue={editingProduct?.status || "Active"} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="category" defaultValue={editingProduct?.category || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500">
                  {categories.map(cat => <option key={cat.id} value={cat.title}>{cat.title}</option>)}
                </select>
                <input type="text" name="image" placeholder="Image URL" defaultValue={editingProduct?.image || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" />
              </div>

              {editingProduct?.image && <img src={editingProduct.image} alt="preview" className="w-full h-40 object-cover rounded-md" />}

              <textarea name="description" placeholder="Description" defaultValue={editingProduct?.description || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" />

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-md border hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;