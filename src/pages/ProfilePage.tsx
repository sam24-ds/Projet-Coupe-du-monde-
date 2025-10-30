import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { getMyTickets } from '../services/apiService';
import './ProfilePage.css';

//type pour nos tickets, c'est mieux que 'any'
interface MyTicket {
  id: string;
  match: { 
    homeTeam: string; 
    awayTeam: string;
    date: string;
    stadium: string;
  };
  category: string;
  status: 'confirmed' | 'used' | 'pending_payment'; // Statuts possibles
  seatNumber?: string;
  qrCode?: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [myTickets, setMyTickets] = useState<MyTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyTickets()
      .then(response => {
        if (response && response.data && response.data.tickets) {
          setMyTickets(response.data.tickets);
        }
      })
      .catch(err => console.error("Impossible de charger les tickets:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (!user) {
    return <div className="page-container"><p>Chargement du profil...</p></div>;
  }

  return (
    <div className="page-container profile-page">
      <div className="profile-header">
        <h1>Mon Profil</h1>
        <button onClick={logout} className="logout-button">Déconnexion</button>
      </div>
      
      <div className="profile-details-card">
        <p><strong>Nom :</strong> {user.firstname} {user.lastname}</p>
        <p><strong>Email :</strong> {user.email}</p>
        {user.birthDate && <p><strong>Date de naissance :</strong> {new Date(user.birthDate).toLocaleDateString('fr-FR')}</p>}
      </div>

      <div className="tickets-section">
        <h2>Mes Tickets</h2>
        {isLoading ? (
          <p>Chargement de vos tickets...</p>
        ) : myTickets.length > 0 ? (
          <div className="tickets-list">
            {myTickets.map(ticket => (
              <div key={ticket.id} className={`ticket-card status-${ticket.status}`}>
                <div className="ticket-match-info">
                  <h3>{ticket.match.homeTeam} vs {ticket.match.awayTeam}</h3>
                  <p>{new Date(ticket.match.date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  <p>{ticket.match.stadium}</p>
                </div>
                <div className="ticket-details">
                  <span className="ticket-category">{ticket.category.replace('_', ' ')}</span>
                  <span className="ticket-seat">Siège : {ticket.seatNumber || 'N/A'}</span>
                  <span className={`ticket-status`}>{ticket.status === 'confirmed' ? 'Confirmé' : 'Utilisé'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Vous n'avez pas encore de tickets achetés.</p>
        )}
      </div>
    </div>
  );
}