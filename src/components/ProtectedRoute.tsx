import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode}) {
  const { isAuthenticated, isLoading } = useAuth();
 
  if (isLoading) {
    return <div>Vérification de l'authentification...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/authentification" />;
  }

  return children; 
}