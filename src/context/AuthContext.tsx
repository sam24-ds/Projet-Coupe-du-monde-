<<<<<<< HEAD
//context/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, getMe } from "../services/apiService";
import type {  UserProfile } from "../types";
=======

import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
// 1. IMPORTEZ les nouvelles dépendances
import { loginUser, getMe, registerUser } from "../services/apiService";
import type { UserProfile, UserCredentials, UserSignupData } from "../types";
>>>>>>> main

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  // 2. AJOUTEZ 'register' au type
  register: (userData: UserSignupData) => Promise<void>;
  logout: () => void;
  isLoading: boolean; // J'ai renommé 'isLoading' pour plus de clarté
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  async function login(credentials: UserCredentials) {
    const { user, access_token } = await loginUser(credentials);
    localStorage.setItem("jwt_token", access_token);
    setUser(user);
  }

  async function register(userData: UserSignupData) {
    const { user, access_token } = await registerUser(userData);
    
    localStorage.setItem("jwt_token", access_token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("jwt_token");
    setUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
        setIsLoading(false);
        return;
    }

    getMe()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Chargement de la session...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated, 
        login, 
        register, // 4. EXPOSEZ 'register' dans la value
        logout,
        isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};