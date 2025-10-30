import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingTickets, payPendingTickets, removeTicketFromBooking } from '../services/apiService';
import toast from 'react-hot-toast';

interface ServerTicket {
  id: number;
  matchId: number;
  category: string;
  price: number;
  status: string;
  match?: {
    homeTeam: string;
    awayTeam: string;
    date: string;
  };
}

interface PendingBookingResponse {
  tickets: ServerTicket[];
  totalPrice: number;
}

function CheckoutPage() {
  const [pendingBooking, setPendingBooking] = useState<PendingBookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  const fetchPendingBooking = async () => {
    try {
      const response = await getPendingTickets();
      const data = (response as any).data || response;
      setPendingBooking(data);
    } catch (err: any) {
      setPendingBooking(null);
      toast.error(err.message || "Impossible de charger votre réservation.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBooking();
  }, []);

  const handleRemoveTicket = async (ticketId: number) => {
    const loadingToast = toast.loading('Suppression du ticket...');
    try {
      await removeTicketFromBooking(ticketId.toString());
      toast.dismiss(loadingToast);
      toast.success('Ticket supprimé.');
      await fetchPendingBooking();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    const loadingToast = toast.loading("Validation du paiement...");
    
    try {
      await payPendingTickets();
      toast.dismiss(loadingToast);
      toast.success("Commande validée !");
      navigate('/profile', { replace: true });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Le paiement a échoué : ${error.message}`);
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <p>Chargement de votre réservation...</p>
      </div>
    );
  }

  if (!pendingBooking || !pendingBooking.tickets || pendingBooking.tickets.length === 0) {
    return (
      <div className="page-container">
        <h2>Aucune réservation en attente</h2>
        <p>Votre panier a peut-être expiré. Vous pouvez retourner à l'accueil pour commencer une nouvelle sélection.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="page-container checkout-page">
      <h2>Récapitulatif de la commande</h2>
      <p className="expiration-timer">
        Votre réservation expirera dans quelques minutes.
      </p>

      <table className="checkout-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingBooking.tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>
                {ticket.match 
                  ? `${ticket.match.homeTeam} vs ${ticket.match.awayTeam}`
                  : `Match #${ticket.matchId}`
                }
              </td>
              <td>{ticket.category.replace('_', ' ')}</td>
              <td>{ticket.price.toFixed(2)} €</td>
              <td>
                <button 
                  className="btn-remove" 
                  onClick={() => handleRemoveTicket(ticket.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="checkout-summary">
        <h3>Total à payer : {pendingBooking.totalPrice.toFixed(2)} €</h3>
        <button 
          onClick={handlePayment} 
          className="btn-primary"
          disabled={isPaying}
        >
          {isPaying ? 'Paiement en cours...' : 'Confirmer et Payer'}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;