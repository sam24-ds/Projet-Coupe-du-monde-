import type { Team } from '../types';
import { API_BASE_URL } from '../services/apiService';
import './TeamCard.css';
import { Link } from 'react-router-dom';

interface TeamCardProps {
  team: Team;
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <Link to={`/?team=${team.id}`}>

    <div className="team-card">
      <img 
        src={`${API_BASE_URL}${team.flagImagePath}`} 
        alt={`Drapeau ${team.name}`} 
        className="team-card-flag"
      />
      <h3>{team.name}</h3>
    </div>
    </Link>
  );
}

export default TeamCard;