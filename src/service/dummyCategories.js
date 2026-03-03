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
        price: 120, 
        image: "https://m.media-amazon.com/images/I/51aHcGncblL._AC_UF894%2C1000_QL80_.jpg", 
        category: "Electronics",
        description: "High-quality wireless headphones with noise-cancellation and long battery life."
      },
      { 
        id: 2, 
        name: "Smart Watch", 
        price: 250, 
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", 
        category: "Electronics",
        description: "Smart watch with fitness tracking, notifications, and customizable watch faces."
      },
      { 
        id: 3, 
        name: "Laptop", 
        price: 900, 
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
        price: 180, 
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80", 
        category: "Fashion",
        description: "Stylish designer handbag made of premium materials for everyday use."
      },
      { 
        id: 5, 
        name: "Gaming Shoes", 
        price: 100, 
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80", 
        category: "Fashion",
        description: "Comfortable and durable shoes perfect for gaming or sports activities."
      },
      { 
        id: 6, 
        name: "Sunglasses", 
        price: 80, 
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80", 
        category: "Fashion",
        description: "UV-protected stylish sunglasses suitable for daily wear and outdoor activities."
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
        price: 350, 
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=80", 
        category: "Home & Living",
        description: "Comfortable and stylish sofa perfect for living rooms and lounges."
      },
      { 
        id: 8, 
        name: "Lamp", 
        price: 60, 
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
        price: 40,
        image: "https://shopsource.singoo.cc/1109/general/ZyRm67yCZWQ4JJwW.webp",
        category: "Agriculture & Livestocks",
        description: "High-nutrient fertilizer bag to enhance crop growth and yield."
      },
      {
        id: 10,
        name: "Tractor Model",
        price: 1500,
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
        price: 60,
        image: "https://www.3chub.com/cdn/shop/files/Infinix-Smart-10-Silver.jpg?v=1750179595&width=950",
        category: "Phone/Device",
        description: "Compact smartphone with fast processor and long battery life."
      },
      {
        id: 12,
        name: "Tablet",
        price: 250,
        image: "https://m.media-amazon.com/images/I/61kfL%2BGcXBL.jpg",
        category: "Phone/Device",
        description: "Large-screen tablet suitable for work and entertainment."
      },
      {
        id: 13,
        name: "Tecno Spark 40 Pro+",
        price: 150,
        image: "https://d13pvy8xd75yde.cloudfront.net/global/spark-40-pro-%2B/KM7%20%E9%BB%91.png",
        category: "Phone/Device",
        description: "High-performance Tecno Spark 40 Pro+ with excellent camera features."
      },
      {
        id: 14,
        name: "Tablet Model",
        price: 200,
        image: "https://paykobo.com/media/q1.jpg",
        category: "Phone/Device",
        description: "Affordable tablet model for students and professionals."
      },
      {
        id: 15,
        name: "Spark 20 Pro",
        price: 200,
        image: "https://d13pvy8xd75yde.cloudfront.net/global/nga/banner/camon-40/mob%E5%B0%81%E9%9D%A2.png",
        category: "Phone/Device",
        description: "Tecno Spark 20 Pro with sleek design and powerful performance."
      },
    ],
  },
];