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
      { 
        id: 1, 
        name: "Wireless Headphones",
        brand: "SoundMax",
        stock: 25,
        price: 1200, 
        image: "https://m.media-amazon.com/images/I/51aHcGncblL._AC_UF894%2C1000_QL80_.jpg", 
        category: "Electronics",
        description: "High-quality wireless headphones with noise-cancellation and long battery life."
      },
      { 
        id: 2, 
        name: "Smart Watch",
        brand: "TechTime",
        stock: 15,
        price: 2500, 
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", 
        category: "Electronics",
        description: "Smart watch with fitness tracking, notifications, and customizable watch faces."
      },
      { 
        id: 3, 
        name: "Laptop",
        brand: "DiaTech", 
        stock: 10,
        price: 90000, 
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80", 
        category: "Electronics",
        description: "High-performance laptop suitable for work, gaming, and multimedia use."
      },
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
      { 
        id: 4, 
        name: "Designer Handbag",
        brand: "Sewa's Collection", 
        stock: 20,
        price: 18000, 
        image: "https://png.pngtree.com/png-clipart/20241023/original/pngtree-a-white-purse-with-ruffled-handle-on-transparent-background-png-image_16469053.png", 
        category: "Fashion",
        description: "Stylish designer handbag made of premium materials for everyday use."
      },
      { 
        id: 5, 
        name: "Lip Gloss Set", 
        brand: "GlowBeauty",
        stock: 30,
        price: 1000, 
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80", 
        category: "Fashion",
        description: "Set of high-quality lip glosses in various trendy shades."
      },
      { 
        id: 6, 
        name: "Coats", 
        brand: "Sewa's Collection",
        stock: 25,
        price: 8000, 
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80", 
        category: "Fashion",
        description: "Warm and stylish coats perfect for cold weather."
      },
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
      { 
        id: 7, 
        name: "Sofa",
        brand: "ComfortHome",
        stock: 5, 
        price: 35000, 
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=80", 
        category: "Home & Living",
        description: "Comfortable and stylish sofa perfect for living rooms and lounges."
      },
      { 
        id: 8, 
        name: "Lamp",
        brand: "BrightLiving",
        stock: 10, 
        price: 3000, 
        image: "https://m.media-amazon.com/images/I/61K5lO4yQVL._AC_UF894%2C1000_QL80_.jpg", 
        category: "Home & Living",
        description: "Modern lamp with adjustable brightness for study, office, or bedroom use."
      },
    ],
  },
  {
    id: 4,
    title: "Agriculture & Livestocks",
    gradientFrom: "from-black",
    gradientTo: "to-yellow-500",
    bgColor: "bg-yellow",
    textColor: "text-black",
    products: [
      {
        id: 9,
        name: "Fertilizer Bag",
        brand: "SolaFarms",
        stock: 25,
        price: 40000,
        image: "https://shopsource.singoo.cc/1109/general/ZyRm67yCZWQ4JJwW.webp",
        category: "Agriculture & Livestocks",
        description: "High-nutrient fertilizer bag to enhance crop growth and yield."
      },
      {
        id: 10,
        name: "Tractor Model",
        brand: "SolarFarms",
        stock: 5,
        price: 15000000,
        image: "https://www.fpeseals.com/uploads/images/tractor-agricultural-machine-cultivating-field.jpg",
        category: "Agriculture & Livestocks",
        description: "Reliable tractor suitable for all types of farming and cultivation."
      },
    ],
  },
  {
    id: 5,
    title: "Phone/Device",
    gradientFrom: "from-black",
    gradientTo: "to-yellow-500",
    bgColor: "bg-yellow",
    textColor: "text-black",
    products: [
      {
        id: 11,
        name: "Smartphone",
        brand: "TechMobile",
        stock: 30,
        price: 120000,
        image: "https://www.notebookcheck.net/fileadmin/Notebooks/Honor/10X_Lite/Honor_10X_Lite.jpg",
        category: "Phone/Device",
        description: "Compact smartphone with fast processor and long battery life."
      },
      {
        id: 12,
        name: "Tablet",
        brand: "TechMobile",
        stock: 20,
        price: 250000,
        image: "https://m.media-amazon.com/images/I/61kfL%2BGcXBL.jpg",
        category: "Phone/Device",
        description: "Large-screen tablet suitable for work and entertainment."
      },
      {
        id: 13,
        name: "Tecno Spark 40 Pro+",
        brand: "Tecno",
        stock: 15,
        price: 101000,
        image: "https://d13pvy8xd75yde.cloudfront.net/global/spark-40-pro-%2B/KM7%20%E9%BB%91.png",
        category: "Phone/Device",
        description: "High-performance Tecno Spark 40 Pro+ with excellent camera features."
      },
      {
        id: 14,
        name: "Tablet Model",
        brand: "TechMobile",
        stock: 10,
        price: 150000,
        image: "https://paykobo.com/media/q1.jpg",
        category: "Phone/Device",
        description: "Affordable tablet model for students and professionals."
      },
      {
        id: 15,
        name: "Spark 20 Pro",
        brand: "Tecno",
        stock: 20,
        price: 200100,
        image: "https://d13pvy8xd75yde.cloudfront.net/global/nga/banner/camon-40/mob%E5%B0%81%E9%9D%A2.png",
        category: "Phone/Device",
        description: "Tecno Spark 20 Pro with sleek design and powerful performance."
      },
        
    ],
  },  {
    id: 6,
    title: "Perfumes & Cosmetics",
    gradientFrom: "from-black",
    gradientTo: "to-purple-500",
    bgColor: "bg-purple",
    textColor: "text-white",
    products: [
      {
        id: 16,
        name: "Golden Veil Perfume",
        brand: "Sewa's Collection",
        stock: 20,
        price: 25000,
        image: "https://png.pngtree.com/png-clipart/20240907/original/pngtree-perfumes-and-gels-nail-polish-cosmetics-product-png-image_15957200.png",
        category: "Perfumes & Cosmetics",
        description: "Luxurious golden veil perfume with long-lasting fragrance."
      },
      {
        id: 17,
        name: "Cosmetic Tablet",
        brand: "Sewa's Collection",
        stock: 15,
        price: 21000,
        image: "https://png.pngtree.com/png-clipart/20240907/original/pngtree-perfumes-and-gels-nail-polish-cosmetics-product-png-image_15957201.png",
        category: "Perfumes & Cosmetics",
        description: "Large-screen tablet suitable for work and entertainment."
      },
      {
        id: 18,
        name: "Crystal Desire Perfume",
        brand: "Sewa's Collection",
        stock: 10,
        price: 12600,
        image: "https://png.pngtree.com/png-vector/20260109/ourlarge/pngtree-cosmetic-products-display-on-a-clean-white-background-png-image_18459288.webp",
        category: "Perfumes & Cosmetics",
        description: "High-performance crystal desire perfume with long-lasting fragrance."
      },
      {
        id: 19,
        name: "Opal whisper Perfume",
        brand: "Sewa's Collection",
        stock: 5,
        price: 15000,
        image: "perfumes.jpg",
        category: "Perfumes & Cosmetics",
        description: "Fragrant and elegant perfume with a long-lasting scent."
      },
      {
        id: 20,
        name: "Rose Bloom Perfume",
        brand: "Sewa's Collection",
        stock: 8,
        price: 3200,
        image: "valentines-day-still-life-design.jpg",
        category: "Perfumes & Cosmetics",
        description: "Elegant rose bloom perfume with a romantic and long-lasting scent."
      },
        
    ],
  },
];