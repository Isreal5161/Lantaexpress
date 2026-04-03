const API_URL = process.env.REACT_APP_API_URL || "https://lantaxpressbackend.onrender.com/api/auth";

const parseAuthResponse = async (res) => {
  let payload = null;

  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const error = new Error(payload?.message || "Server error. Try again later.");
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

// REGISTER
export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseAuthResponse(res);
};

// LOGIN
export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseAuthResponse(res);
};