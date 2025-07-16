import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // User not logged in — redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // User logged in but not admin — redirect to home or error page
    return <Navigate to="/" replace />;
  }

  // User is admin — render children components
  return children;
};

export default AdminRoute;
