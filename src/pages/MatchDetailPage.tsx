import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { type Match } from "../types";
import { getMatchDetailsById } from "../services/apiService"; 
import './MatchDetailPage.css'
import { API_BASE_URL } from "../services/apiService";
import { useCart } from '../context/CartContext';

function MatchDetailPage(){

    const {id} = useParams<{id : string}>();
    
    const [match, setMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart(); 

    useEffect(()=>{
        if(!id) return;

        const fetchMatchDetails = async ()=>{
            try{
                setIsLoading(true);
                const data = await getMatchDetailsById (id);
                //console.log('la data :', data)
                setMatch(data);

            }catch (err: any){
             setError(err.message);
            }finally{
             setIsLoading(false);
            }

        };
        fetchMatchDetails();
    }, [id]);//si l'id change, on recharge les données.
    
    if(isLoading){
        return <p style={{ textAlign: 'center' }}>Chargement du match...</p>;
    }

    if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Erreur: {error}</p>;
    }

    if (!match) {
    return <p>Match non trouvé.</p>;
    }



    return (


    <div className="detail-container">
      <Link to="/" className="back-link">← Retour à la liste des matchs</Link>
      
      <header className="detail-header">
        <h1>
            <img src={`${API_BASE_URL}${match.homeTeam.flagImagePath}`} alt="" className="header-flag"/>
            {match.homeTeam.name} 
            <span>vs</span> 
            {match.awayTeam.name}
            <img src={`${API_BASE_URL}${match.awayTeam.flagImagePath}`} alt="" className="header-flag"/>
        </h1> 
      </header>

      <section className="detail-info">
        <p><strong>Date :</strong> {new Date(match.date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
        <p><strong>Stade :</strong> {match.stadium.name}</p>
      </section>

      <section className="ticket-section">
        <h2>Billets Disponibles</h2>
        {/*vérifier que la propriété 'categories' existe avant de l'utiliser */}
        {match.categories ? (
          <div className="ticket-categories">
            {/*transformer l'objet en tableau pour pouvoir faire .map() */}
            {Object.entries(match.categories).map(([categoryName, categoryDetails]) => (
              <div key={categoryName} className="category-card">
                <h3>{categoryName.replace('_', ' ')}</h3>
                <p className="price">{categoryDetails.price.toFixed(2)} €</p>
                <p className="availability">{categoryDetails.availableSeats} places restantes</p>
                <button
                   onClick={() => addToCart(match, categoryName, categoryDetails)}
                   disabled={!categoryDetails.available || categoryDetails.availableSeats === 0}
                >
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Les informations sur les tickets ne sont pas disponibles pour ce match.</p>
        )}
      </section>
    </div>
        


    );
}

export default MatchDetailPage