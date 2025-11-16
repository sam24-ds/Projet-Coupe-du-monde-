import { type Match } from "../types";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/apiService";
import { translateTeamName } from "../utils/translations";

// Importations d'images pour le design
import stadiumBgCard from '../img/stadium_bg_card.jpg'; 

interface MatchCard {
  match: Match;
}
function MatchCard({ match }: MatchCard) {
  return (
    // Fond blanc, bordure gris sombre
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-400 hover:border-gray-600 hover:scale-105">
      
      {/* HEADER */}
      <div className="bg-gray-700 p-4 text-white flex justify-between">
        <span className="font-bold text-gray-200">Match #{match.id}</span>
        {/* Date passe en BLEU */}
        <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-md">
          {new Date(match.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>

      {/* CORPS DES ÉQUIPES */}
      <div className="p-5 text-center">
        <div className="flex items-center justify-between mb-5">
          {/* Équipe à domicile */}
          <div className="flex flex-col items-center flex-1">
            <img
              src={`${API_BASE_URL}${match.homeTeam.flagImagePath}`}
              alt={match.homeTeam.name}
              className="w-16 h-16 rounded-full border-2 border-gray-500 shadow-md mb-2"
            />
            <span className="font-bold text-gray-800 text-sm">
              {translateTeamName(match.homeTeam.name)}
            </span>
          </div>

          <div className="flex flex-col items-center px-4">
            {/* CHANGEMENT : Le bloc VS passe en BLEU */}
            <div className="bg-blue-600 text-white font-black text-xl px-5 py-3 rounded-lg shadow-lg">
              VS
            </div>
            {/* Bloc Heure reste en BLEU */}
            <div className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              {new Date(match.date).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Équipe à l'extérieur */}
          <div className="flex flex-col items-center flex-1">
            <img
              src={`${API_BASE_URL}${match.awayTeam.flagImagePath}`}
              alt={match.awayTeam.name}
              className="w-16 h-16 rounded-full border-2 border-gray-500 shadow-md mb-2"
            />
            <span className="font-bold text-gray-800 text-sm">
              {translateTeamName(match.awayTeam.name)}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-300 mb-0"></div>

        {/* SECTION: STADE + BOUTON DANS LE MÊME CONTENEUR FOND IMAGE */}
        <div 
          className="relative mt-4 rounded-xl shadow-xl overflow-hidden"
          style={{ backgroundImage: `url(${stadiumBgCard})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Overlay sombre pour la lisibilité sur l'image */}
          <div className="absolute inset-0 bg-black opacity-30 z-0 rounded-xl"></div> 
          
          {/* Nom du Stade */}
          <div className="relative z-10 py-3 text-center bg-black/10">
            <span className="font-black text-lg text-white">
              {match.stadium.name}
            </span>
          </div>
          
          {/* BOUTON VOIR LES BILLETS (Rouge) */}
          <Link
            to={`/match/${match.id}`}
            className="w-full block bg-red-600/90 text-white font-bold py-3 px-6 transition-all duration-300 hover:bg-red-700/95 shadow-lg relative z-10 flex items-center justify-center"
            style={{ borderTop: '2px solid rgba(255, 255, 255, 0.2)' }} 
          >
            <span className="mr-2">🎫</span> 
            Voir les billets 
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;