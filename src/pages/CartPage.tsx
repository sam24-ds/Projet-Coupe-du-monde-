import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css'; 

function CartPage() {
  
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  // On calcule le total
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Cas 1: Le panier est vide
  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Votre panier est vide</h2>
        <Link to="/" className="btn-primary">Continuer mes achats</Link>
      </div>
    );
  }

  // Cas 2: Le panier contient des articles
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
        <button className="btn-primary">Passer la commande</button>
      </div>
    </div>
  );
}

export default CartPage;