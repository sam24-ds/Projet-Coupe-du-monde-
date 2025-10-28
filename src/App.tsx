import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';

function App(){
  return(
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/match/:id" element={<MatchDetailPage/>}/>
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;