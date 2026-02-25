import products from "../data/Product";

export const getProducts = async () => {
  // Later replace this with backend fetch
  return products;
};

export const getProductById = async (id) => {
  return products.find((p) => p.id === parseInt(id));
};