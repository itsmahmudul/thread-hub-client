import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const AdminRoute = ({ children }) => {
  const { user: authUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.email) {
      setLoading(false);
      return;
    }

    axiosPublic
      .get(`/users?email=${encodeURIComponent(authUser.email)}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authUser, axiosPublic]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!authUser) return <Navigate to="/login" replace />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
