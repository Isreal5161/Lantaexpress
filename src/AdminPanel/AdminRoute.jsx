const AdminRoute = ({ children }) => {
  let user = null;
  const token = localStorage.getItem("token");

  try {
    const storedUser = localStorage.getItem("adminUser");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("adminUser");
    user = null;
  }

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};