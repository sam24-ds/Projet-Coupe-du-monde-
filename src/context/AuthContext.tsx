import { createContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, getMe } from "../services/apiService";
import type { Match, UserProfile } from "../types";

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const isAuthenticated = Boolean(user);

  async function login(email: string, password: string) {

    const { access_token } = await loginUser({ email, password });

    localStorage.setItem("jwt_token", access_token);

    const me = await getMe(access_token);
    setUser(me);
  }

  function logout() {
    localStorage.removeItem("jwt_token");
    setUser(null);
  }

  // Au démarrage → si token existant → on récupère le user
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    getMe(token)
      .then(setUser)
      .catch(() => logout());
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
