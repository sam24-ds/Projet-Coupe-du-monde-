import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import {Authentification} from "./pages/Authentification";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import TeamsPage from './pages/TeamsPage';
import GroupsPage from './pages/GroupsPage';
import CheckoutPage from "./pages/CheckoutPage";
import { Toaster } from 'react-hot-toast';
import { RegisterPage } from "./pages/RegisterPage";

function App(){
  return(
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<HomePage/>} />
          <Route path="/match/:id" element={<MatchDetailPage/>}/>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Authentification/>}/>

           {/* Route Protégée */}
          <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
          } />
          <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
          } />
        </Routes>   
      </CartProvider>
    </AuthProvider>
  );
}

export default App;