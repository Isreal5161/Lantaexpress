// src/service/dummyCategories.js
export const categories = [
  {
    id: 1,
    title: "Electronics",
    gradientFrom: "from-black",
    gradientTo: "to-green-500",
    bgColor: "bg-green",
    textColor: "text-white",
    products: [
      { id: 1, name: "Wireless Headphones", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
      { id: 2, name: "Smart Watch", price: 250, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
      { id: 3, name: "Laptop", price: 900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80" },
    ],
  },
  {
    id: 2,
    title: "Fashion",
    gradientFrom: "from-black",
    gradientTo: "to-orange-500",
    bgColor: "bg-orange",
    textColor: "text-black",
    products: [
      { id: 4, name: "Designer Handbag", price: 180, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80" },
      { id: 5, name: "Gaming Shoes", price: 100, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80" },
      { id: 6, name: "Sunglasses", price: 80, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80" },
    ],
  },
  {
    id: 3,
    title: "Home & Living",
    gradientFrom: "from-black",
    gradientTo: "to-blue-500",
    bgColor: "bg-blue",
    textColor: "text-white",
    products: [
      { id: 7, name: "Sofa", price: 350, image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=80" },
      { id: 8, name: "Lamp", price: 60, image: "https://m.media-amazon.com/images/I/61K5lO4yQVL._AC_UF894%2C1000_QL80_.jpg" },
    ],
  },
];