import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// ✅ Importation de l'image de fond pour le header du panier (panier plein)
import cartHeaderBackground from "../cart_header_bg.jpg"; // <--- Votre image de fond désirée

// ✅ CHANGEMENT ICI : emptyCartBackground utilise la MÊME IMAGE que cartHeaderBackground
import emptyCartBackground from '../cart_header_bg.jpg'; // <--- Utilisez la même image ici !

function CartPage() {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalTickets = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // 🛒 Cas 1 : panier vide
  if (cartItems.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative p-4"
        style={{ backgroundImage: `url(${emptyCartBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md border-2 border-gray-200 relative z-10">
          <div className="text-8xl mb-6 text-gray-700">🛒</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Votre panier est vide
          </h2>
          <p className="text-gray-700 mb-8">
            Explorez les matchs et réservez vos billets !
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Voir les matchs
          </Link>
        </div>
      </div>
    );
  }

  // 🎟️ Cas 2 : panier avec articles
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div
        className="relative bg-cover bg-center py-8 shadow-xl"
        style={{ backgroundImage: `url(${cartHeaderBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-black flex items-center">
            <span className="text-5xl mr-4">🛒</span> 
            Mon Panier
          </h1>
          <p className="text-xl mt-2 text-gray-200">
            {totalTickets} billet{totalTickets > 1 ? "s" : ""} sélectionné
            {totalTickets > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ... (le reste de votre code reste identique) ... */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.matchId}-${item.categoryName}`}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-400 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-800 mb-2">
                      ⚽ {item.matchName}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                        {item.categoryName.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.matchId, item.categoryName)
                    }
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Supprimer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Prix unitaire
                    </p>
                    <p className="text-2xl font-black text-gray-700">
                      {item.price}€
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.matchId,
                          item.categoryName,
                          item.quantity - 1
                        )
                      }
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold w-10 h-10 rounded-lg shadow-md transition-all"
                    >
                      -
                    </button>
                    <span className="text-2xl font-black text-gray-800 w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.matchId,
                          item.categoryName,
                          item.quantity + 1
                        )
                      }
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold w-10 h-10 rounded-lg shadow-md transition-all"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-semibold">Total</p>
                    <p className="text-3xl font-black text-green-600">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200 sticky top-4">
              <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700 font-semibold">
                    Nombre de billets
                  </span>
                  <span className="text-xl font-black text-gray-800">
                    {totalTickets}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700 font-semibold">Sous-total</span>
                  <span className="text-xl font-black text-gray-800">
                    {totalPrice.toFixed(2)}€
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700 font-semibold">
                    Frais de service
                  </span>
                  <span className="text-xl font-black text-gray-800">5.00€</span>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-green-800">
                      TOTAL
                    </span>
                    <span className="text-4xl font-black text-green-700">
                      {(totalPrice + 5).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
                  🎫 Passer la commande
                </button>

                <Link
                  to="/"
                  className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Continuer mes achats
                </Link>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
                <p className="text-sm text-gray-800 font-semibold flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Vos billets seront envoyés par e-mail après le paiement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;