import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// ✅ Importation du nouveau logo
import Fifa2026Logo from '../img/fifa2026_logo.png'; // <--- Assurez-vous que le chemin est correct et que c'est un PNG pour la transparence !

function Navbar() {
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path: string) =>
    location.pathname === path ? "text-red-600 font-bold" : "text-gray-800 hover:text-red-500";

  return (
    <nav className="bg-gray-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Titre */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-gray-800 tracking-wide hover:text-red-600 transition-all flex items-center space-x-2"
        >
          {/* ✅ CHANGEMENT ICI : Remplacement de l'icône par l'image */}
          <img src={Fifa2026Logo} alt="FIFA World Cup 2026 Logo" className="h-8 mr-2" /> {/* Ajustez la taille (h-8) si nécessaire */}
          <span>Coupe du Monde 2026</span>
        </Link>

        {/* Liens principaux */}
        <div className="hidden md:flex space-x-6 items-center font-semibold">
          <Link to="/" className={isActive("/")}>
            Accueil
          </Link>
          <Link to="/teams" className={isActive("/teams")}>
            Équipes
          </Link>
          <Link to="/groups" className={isActive("/groups")}>
            Groupes
          </Link>

          {/* Panier */}
          <Link
            to="/cart"
            className="relative flex items-center text-gray-800 font-semibold hover:text-red-500 transition-all"
          >
            🛒
            <span className="ml-1">Panier</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Connexion / Profil */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              Mon Profil
            </Link>
          ) : (
            <Link
              to="/authentification"
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-700 transition-all shadow-md"
            >
              Se connecter
            </Link>
          )}
        </div>

        {/* Version mobile */}
        <div className="md:hidden text-gray-800 font-bold text-2xl">
          ☰
        </div>
      </div>
    </nav>
  );
}

export default Navbar;