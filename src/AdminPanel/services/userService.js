const STORAGE_KEY = "lanta_users";

/* Initialize default users */
export const initializeUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);

  if (!users) {
    const defaultUsers = [
      {
        id: "U001",
        name: "John Doe",
        email: "john@email.com",
        phone: "08012345678",
        orders: 12,
        status: "Active",
        signupDate: "2026-03-01",
        addresses: [
          {
            id: "A001",
            country: "Nigeria",
            state: "Lagos",
            city: "Ikeja",
            zip: "100001",
            addressLine: "12 Adeola Odeku Street"
          }
        ],
        orderHistory: [
          {
            orderId: "O1001",
            product: "Laptop",
            amount: 150000,
            status: "Delivered",
            date: "2026-03-02"
          },
          {
            orderId: "O1002",
            product: "Shoes",
            amount: 8000,
            status: "Processing",
            date: "2026-03-03"
          }
        ]
      },
      {
        id: "U002",
        name: "Aisha Bello",
        email: "aisha@email.com",
        phone: "08098765432",
        orders: 5,
        status: "Active",
        signupDate: "2026-03-04",
        addresses: [
          {
            id: "A002",
            country: "Nigeria",
            state: "Oyo",
            city: "Ibadan",
            zip: "200002",
            addressLine: "45 Oluyole Street"
          }
        ],
        orderHistory: [
          {
            orderId: "O1003",
            product: "Bag",
            amount: 4500,
            status: "Delivered",
            date: "2026-03-05"
          }
        ]
      },
      {
        id: "U003",
        name: "Michael James",
        email: "michael@email.com",
        phone: "08011223344",
        orders: 3,
        status: "Blocked",
        signupDate: "2026-03-06",
        addresses: [],
        orderHistory: []
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

/* Get users */
export const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

/* Save users */
export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

/* Delete user */
export const deleteUser = (id) => {
  const users = getUsers().filter((user) => user.id !== id);
  saveUsers(users);
};

/* Ban user */
export const banUser = (id) => {
  const users = getUsers().map((user) =>
    user.id === id ? { ...user, status: "Blocked" } : user
  );

  saveUsers(users);
};

/* Unban user */
export const unbanUser = (id) => {
  const users = getUsers().map((user) =>
    user.id === id ? { ...user, status: "Active" } : user
  );

  saveUsers(users);
};