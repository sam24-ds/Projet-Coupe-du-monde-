import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import { loginUser, getMe, registerUser, logoutUser } from "../services/apiService";
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
    // Le cookie est automatiquement défini par le serveur via Set-Cookie
    const response = await loginUser(credentials);
    
    // On récupère juste les données utilisateur de la réponse
    const userData = response.data.user;
    setUser(userData);
  }

  async function register(userData: UserSignupData) {
    // Le cookie est automatiquement défini par le serveur via Set-Cookie
    const response = await registerUser(userData);
    
    // On récupère juste les données utilisateur de la réponse
    const newUser = response.data.user;
    setUser(newUser);
  }

  async function logout() {
    // Appel à l'API pour détruire la session côté serveur
    await logoutUser();
    setUser(null);
  }

  useEffect(() => {
    // Au chargement, on vérifie si l'utilisateur a une session active
    // via le cookie (pas besoin de vérifier localStorage)
    getMe()
      .then(setUser)
      .catch(() => {
        // Pas de session active, c'est normal
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