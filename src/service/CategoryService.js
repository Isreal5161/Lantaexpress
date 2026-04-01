const API_BASE = process.env.REACT_APP_API_BASE || "https://lantaxpressbackend.onrender.com/api";

const createLoadError = (message, extra = {}) => Object.assign(new Error(message), extra);

async function fetchJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw createLoadError("Network error", {
      isNetworkError: true,
      cause: error,
    });
  }

  if (!response.ok) {
    const text = await response.text();
    throw createLoadError(text || `Request failed: ${response.status}`, {
      status: response.status,
      isNetworkError: false,
    });
  }

  return response.json();
}

const mapCategory = (category, index) => ({
  id: category?._id || category?.id || `category-${index}`,
  title: category?.title || "",
});

export const getCategories = async () => {
  const categories = await fetchJson(`${API_BASE}/categories`);
  return (categories || []).map(mapCategory).filter((category) => category.title);
};

export const createCategory = async ({ title, token }) => {
  const response = await fetchJson(`${API_BASE}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  return response?.category ? mapCategory(response.category, 0) : null;
};

export const deleteCategory = async ({ id, token }) => {
  const response = await fetchJson(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response?.category ? mapCategory(response.category, 0) : null;
};