import { type Match } from "../types";
import './MatchCard.css'
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/apiService";

interface MatchCardProps {
    match : Match;
}

function MatchCard ({match}: MatchCardProps){

    if (typeof match.homeTeam !== 'object' || typeof match.awayTeam !=='object'){
        return null;
    }

    const homeTeamFlagUrl = `${API_BASE_URL}${match.homeTeam.flagImagePath}`;
    const awayTeamFlagUrl = `${API_BASE_URL}${match.awayTeam.flagImagePath}`

    return(
        <Link to={`/match/${match.id}`} className="match-card">
            <div className="match-card-teams">
                <span className="team-display">
                    <img src={homeTeamFlagUrl} alt={`Drapeau de ${match.homeTeam.name}`} className="flag-icon" />
                    {match.homeTeam.name}
                </span>
                <span>vs</span>
                <span className="team-display">
                {match.awayTeam.name}
                <img src={awayTeamFlagUrl} alt={`Drapeau de ${match.awayTeam.name}`} className="flag-icon" />
                </span>
            </div>

            <div className="match-card-info">
                <p>{new Date(match.date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                <p>{match.stadium.name}, {match.stadium.city}</p>
            </div>

            <div className="match-card-availibility">
                {match.availableSeats > 0 ? (
                    <p className="seats-available">{match.availableSeats} places disponibles</p>
            ) : (
            <p className="sold-out">Complet</p>
            )}
                

            </div>
        </Link>
    )
}

export default MatchCard

