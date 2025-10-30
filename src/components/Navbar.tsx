import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css'; 

function Navbar() {
  const { cartItems } = useCart(); // On récupère la liste des articles du panier

  // On calcule le nombre total de tickets (pas juste le nombre de lignes) avec reduce
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Coupe du Monde 2026</Link>
      <Link to="/teams" className="navbar-link">Équipes</Link>
    <Link to="/groups" className="navbar-link">Groupes</Link>
    <Link to="/profile" className="navbar-link">Profile</Link>
      <Link to="/cart" className="navbar-cart">
        🛒 Panier ({totalItems})
      </Link>
    </nav>
  );
}

export default Navbar;