// src/AdminPanel/services/orderService.js
import { categories } from "../../service/dummyCategories"; // <-- correct relative path

const statuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getOrders() {
  let orders = [];
  let orderIdCounter = 1;

  categories.forEach((category) => {
    category.products.forEach((product) => {
      const numberOfOrders = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numberOfOrders; i++) {
        const status = getRandomItem(statuses);
        const tracking = status === "Shipped" || status === "Delivered" ? `TRK${Math.floor(100000 + Math.random() * 900000)}` : null;

        orders.push({
          id: `ORD${orderIdCounter.toString().padStart(4, "0")}`,
          sellerBrand: product.brand,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          user: `User ${orderIdCounter}`,
          userEmail: `user${orderIdCounter}@example.com`,
          userPhone: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: status,
          tracking: tracking,
        });

        orderIdCounter++;
      }
    });
  });

  return orders;
}