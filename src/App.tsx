import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import {Authentification} from "./pages/Authentification";
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import TeamsPage from './pages/TeamsPage';
import GroupsPage from './pages/GroupsPage';
import { Toaster } from 'react-hot-toast';
import { RegisterPage } from "./pages/RegisterPage";

function App(){
  return(
    <CartProvider>
      <Navbar />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          {/*ajoute ici les routes securisé c'est mieux que nodeChildren que j'avais mis en place avant */}
        </Route>
        <Route path="/" element={<HomePage/>} />
        <Route path="/match/:id" element={<MatchDetailPage/>}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/authentification" element={<Authentification/>}/>
      </Routes>   
    </CartProvider>
  );
}

export default App;