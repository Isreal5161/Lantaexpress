// src/AdminPanel/services/sellerService.js

const STORAGE_KEY = "lanta_sellers";

/* Initialize default sellers */
export const initializeSellers = () => {
  const sellers = localStorage.getItem(STORAGE_KEY);
  if (!sellers) {
    const defaultSellers = [
      {
        id: "S001",
        name: "Chinedu Okafor",
        email: "chinedu@seller.com",
        brand: "ChineTech",
        phone: "08012345678",
        status: "Verified", // Verified, Pending, Blocked
        verification: true,
        balance: 120000,
        totalProducts: 10,
        totalSales: 45,
        products: [
          { 
            id: "P001", 
            name: "Laptop", 
            price: 150000, 
            status: "Pending", 
            category: "Electronics",
            stock: 5,
            description: "High-end gaming laptop",
            images: [
              "/images/laptop1.jpg",
              "/images/laptop2.jpg",
              "/images/laptop3.jpg"
            ]
          },
          { 
            id: "P002", 
            name: "Keyboard", 
            price: 8000, 
            status: "Approved",
            category: "Accessories",
            stock: 20,
            description: "Mechanical keyboard",
            images: ["/images/keyboard1.jpg"]
          }
        ],
        sales: [
          { orderId: "O1001", product: "Laptop", amount: 150000, status: "Delivered" }
        ],
        withdrawalRequests: [
          { id: "W001", amount: 50000, status: "Pending" }
        ]
      },
      {
        id: "S002",
        name: "Aisha Bello",
        email: "aisha@seller.com",
        brand: "Aisha Bags",
        phone: "08098765432",
        status: "Pending",
        verification: false,
        balance: 0,
        totalProducts: 0,
        totalSales: 0,
        products: [],
        sales: [],
        withdrawalRequests: []
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSellers));
  }
};

/* Get all sellers */
export const getSellers = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* Save sellers */
export const saveSellers = (sellers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sellers));
};

/* Delete a seller */
export const deleteSeller = (id) => {
  const sellers = getSellers().filter((s) => s.id !== id);
  saveSellers(sellers);
};

/* Approve a product */
export const approveProduct = (sellerId, productId) => {
  const sellers = getSellers().map((s) => {
    if (s.id === sellerId) {
      s.products = s.products.map((p) =>
        p.id === productId ? { ...p, status: "Approved" } : p
      );
    }
    return s;
  });
  saveSellers(sellers);
};

/* Reject a product */
export const rejectProduct = (sellerId, productId) => {
  const sellers = getSellers().map((s) => {
    if (s.id === sellerId) {
      s.products = s.products.map((p) =>
        p.id === productId ? { ...p, status: "Rejected" } : p
      );
    }
    return s;
  });
  saveSellers(sellers);
};

/* Update seller balance */
export const updateSellerBalance = (sellerId, amount) => {
  const sellers = getSellers().map((s) =>
    s.id === sellerId ? { ...s, balance: amount } : s
  );
  saveSellers(sellers);
};

/* ======= New: Approve / Reject Seller Requests ======= */
export const approveSellerRequest = (sellerId) => {
  const sellers = getSellers().map((s) =>
    s.id === sellerId ? { ...s, status: "Verified", verification: true } : s
  );
  saveSellers(sellers);
};

export const rejectSellerRequest = (sellerId) => {
  const sellers = getSellers().map((s) =>
    s.id === sellerId ? { ...s, status: "Blocked", verification: false } : s
  );
  saveSellers(sellers);
};