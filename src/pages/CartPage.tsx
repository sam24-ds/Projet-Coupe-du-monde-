import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addTicketToBooking } from '../services/apiService';
import toast from 'react-hot-toast';
import './CartPage.css';

function CartPage() {
  const { cartItems, removeFromCart, updateItemQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour continuer.");
      navigate('/login', { replace: false, state: { from: '/checkout' } });
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Création de votre réservation...");
    
    try {
      const bookingPromises = cartItems.map(item => 
        addTicketToBooking({
          matchId: item.matchId,
          category: item.categoryName,
          quantity: item.quantity,
        })
      );
      
      await Promise.all(bookingPromises);

      toast.dismiss(loadingToast);
      toast.success("Réservation créée !");
      
      clearCart();
      navigate('/checkout', { replace: true });

    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Erreur lors de la réservation : ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Votre panier est vide</h2>
        <Link to="/" className="btn-primary">Continuer mes achats</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Récapitulatif de votre panier</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Catégorie</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={`${item.matchId}-${item.categoryName}`}>
              <td>{item.matchName}</td>
              <td>{item.categoryName.replace('_', ' ')}</td>
              <td>{item.price.toFixed(2)} €</td>
              <td className="quantity-controls">
                <button onClick={() => updateItemQuantity(item.matchId, item.categoryName, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItemQuantity(item.matchId, item.categoryName, item.quantity + 1)}>+</button>
              </td>
              <td>{(item.price * item.quantity).toFixed(2)} €</td>
              <td>
                <button className="btn-remove" onClick={() => removeFromCart(item.matchId, item.categoryName)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <h3>Total général : {totalPrice.toFixed(2)} €</h3>
        <button 
          className="btn-primary"
          onClick={handleProceedToCheckout} 
          disabled={isProcessing}
        >
          {isProcessing ? "Réservation en cours..." : "Valider et continuer"}
        </button>
      </div>
    </div>
  );
}

export default CartPage;