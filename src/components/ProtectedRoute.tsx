import { type ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode}) {
  const auth = useContext(AuthContext);
  return auth?.user ? children : <Navigate to="/login" />;
}