import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem("access");
  const rol = localStorage.getItem("rol");

  if (!token) {
    alert("Debes iniciar sesión para acceder a esta página");
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(rol)) {
    alert(" No tienes permiso para acceder a esta sección");
    return <Navigate to="/" replace />;
  }

  return children;
}
