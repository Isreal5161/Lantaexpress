import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { categories } from "../../service/dummyCategories";

const API_URL = "https://lantaxpressbackend.onrender.com/api";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("sellerToken");

  // 🔥 FETCH PRODUCTS FROM BACKEND
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/seller/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  const pendingProducts = filteredProducts.filter(p => p.status === "pending");
  const approvedProducts = filteredProducts.filter(p => p.status === "approved");

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setPreview(null);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setEditingProduct({ ...editingProduct, imageFile: file });
    }
  };

  // 🔥 SAVE PRODUCT TO BACKEND
  const handleSaveProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);

      if (editingProduct?.imageFile) {
        formData.append("images", editingProduct.imageFile);
      }

      const res = await fetch(`${API_URL}/seller/add-product`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await loadProducts();

      setModalOpen(false);
      setEditingProduct(null);
      setPreview(null);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* UI NOT TOUCHED */}
      <div className="flex gap-4 items-center flex-wrap mt-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.title}>{cat.title}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border w-full"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <button onClick={() => handleOpenModal()} className="bg-green-600 text-white px-4 py-2">
          <MdAdd /> Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      {pendingProducts.map(p => (
        <div key={p._id}>{p.name} (Pending)</div>
      ))}

      {approvedProducts.map(p => (
        <div key={p._id}>{p.name} (Approved)</div>
      ))}

      {/* MODAL */}
      {modalOpen && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          handleSaveProduct({
            name: form.name.value,
            brand: form.brand.value,
            price: form.price.value,
            stock: form.stock.value,
            category: form.category.value,
            description: form.description.value,
          });
        }}>
          <input name="name" placeholder="Name" required />
          <input name="price" placeholder="Price" required />
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default SellerProductsPage;