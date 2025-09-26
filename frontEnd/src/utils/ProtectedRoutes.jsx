import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../api/index"; // jwt expiry check

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
