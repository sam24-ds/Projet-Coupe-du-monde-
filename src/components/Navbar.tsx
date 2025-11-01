import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; 

function Navbar() {
  const { cartItems } = useCart(); // On récupère la liste des articles du panier
  const { isAuthenticated } = useAuth();
  // On calcule le nombre total de tickets (pas juste le nombre de lignes) avec reduce
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Coupe du Monde 2026</Link>
      <Link to="/teams" className="navbar-link">Équipes</Link>
      <Link to="/groups" className="navbar-link">Groupes</Link>
      {isAuthenticated ? 
      <Link to="/profile" className="navbar-profile">
        profile 
      </Link>
      : <Link to="/authentification" className="navbar-profile">
        Se connecter
      </Link>
      }
      { <Link to="/cart" className="navbar-cart">
        🛒 Panier ({totalItems})
      </Link>
      }
    </nav>
  );
}

export default Navbar;