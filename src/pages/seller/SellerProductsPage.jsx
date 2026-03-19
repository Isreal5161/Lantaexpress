import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { categories } from "../../service/dummyCategories";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [preview, setPreview] = useState(null);

  // Load seller products
  const loadProducts = () => {
    const allSellerProducts = JSON.parse(localStorage.getItem("seller_products")) || [];
    setProducts(allSellerProducts);
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener("storage", loadProducts);
    return () => window.removeEventListener("storage", loadProducts);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  const pendingProducts = filteredProducts.filter(p => !p.approved);
  const approvedProducts = filteredProducts.filter(p => p.approved);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== id);
      localStorage.setItem("seller_products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setPreview(product?.imagePreview || null);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setEditingProduct({ ...editingProduct, imageFile: file });
    }
  };

  const handleSaveProduct = (productData) => {
    const allSellerProducts = JSON.parse(localStorage.getItem("seller_products")) || [];
    const newProduct = editingProduct
      ? { ...editingProduct, ...productData, approved: false, imagePreview: preview }
      : { id: Date.now(), ...productData, approved: false, imagePreview: preview };

    const updatedProducts = editingProduct
      ? allSellerProducts.map(p => p.id === editingProduct.id ? newProduct : p)
      : [newProduct, ...allSellerProducts];

    localStorage.setItem("seller_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts); // Immediate update
    setModalOpen(false);
    setEditingProduct(null);
    setPreview(null);

    // Notify admin page
    window.dispatchEvent(new Event("sellerProductSaved"));
  };

  return (
    <div className="space-y-6">
      {/* Search & Category */}
      <div className="flex gap-4 items-center flex-wrap mt-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.title}>{cat.title}</option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
        >
          <MdAdd size={20} /> Add Product
        </button>
      </div>

      {/* Pending Products */}
      {pendingProducts.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-4">Pending Products</h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            {pendingProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 group">
                <img src={product.imagePreview || "https://via.placeholder.com/300x200"} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-500 mt-1">Brand: {product.brand}</p>
                <p className="text-gray-500 mt-1">₦{product.price}</p>
                <p className="text-gray-500 mt-1">Stock: {product.stock}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-600">
                  Pending Approval
                </span>
                <div className="flex justify-end mt-3 gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800"><MdEdit size={20} /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><MdDelete size={20} /></button>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Approved Products */}
      {approvedProducts.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6">Approved Products</h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            {approvedProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 group">
                <img src={product.imagePreview || "https://via.placeholder.com/300x200"} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-500 mt-1">Brand: {product.brand}</p>
                <p className="text-gray-500 mt-1">₦{product.price}</p>
                <p className="text-gray-500 mt-1">Stock: {product.stock}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600">
                  Approved
                </span>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Modal */}
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
                handleSaveProduct({
                  name: form.name.value,
                  brand: form.brand.value,
                  price: parseFloat(form.price.value),
                  stock: parseInt(form.stock.value),
                  category: form.category.value,
                  description: form.description.value,
                });
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select name="category" defaultValue={editingProduct?.category || ""} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" required>
                  {categories.map(cat => <option key={cat.id} value={cat.title}>{cat.title}</option>)}
                </select>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500" />
              </div>
              {preview && <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-md" />}
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