import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from "./context/AuthContext";
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import TeamsPage from './pages/TeamsPage';
import GroupsPage from './pages/GroupsPage';
import { Toaster } from 'react-hot-toast';

function App(){
  return(
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
          } />
          <Route path="/" element={<HomePage/>} />
          <Route path="/match/:id" element={<MatchDetailPage/>}/>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/login" element={<Login/>}/>
        </Routes>   
      </CartProvider>
    </AuthProvider>
  );
}

export default App;