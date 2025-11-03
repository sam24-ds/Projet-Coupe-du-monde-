
import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import { loginUser, getMe, registerUser, LogoutUser } from "../services/apiService";
import type { UserProfile, UserCredentials, UserSignupData } from "../types";

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (userData: UserSignupData) => Promise<void>;
  logout: () => Promise<void>; 
  isLoading: boolean;
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
    await loginUser(credentials);
    const userData = await getMe();
    setUser(userData);
  }

  async function register(user: UserSignupData) {
    await registerUser(user);

    const userData = await getMe();
    setUser(userData);
  }

 
  async function logout() {
    LogoutUser();
    setUser(null);
    localStorage.removeItem('worldcup_cart');
  }

  useEffect(() => {

    getMe()
      .then(userData => {
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      })
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
        register,
        logout,
        isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};