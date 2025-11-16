// src/components/TeamCard.tsx
import React from "react";
import type { Team } from "../types";
import { API_BASE_URL } from "../services/apiService";
import { Link } from 'react-router-dom';


interface TeamCardProps {
    team: Team; 
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
    // La fonctionnalité du groupe est d'envelopper la carte dans un Link vers la page d'accueil avec filtre.
    return (
        <Link to={`/?team=${team.id}`}> 
            {/* VOTRE DESIGN TAILWIND (avec ajustements pour la cliquabilité) */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center hover:scale-105 border-2 border-blue-200 hover:border-blue-500 group cursor-pointer">
                
                {/* Drapeau */}
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-50 to-green-50 rounded-full flex items-center justify-center shadow-md mb-4 border-4 border-blue-300 group-hover:border-yellow-400 transition-all">
                    {team.flagImagePath ? (
                        <img
                            src={`${API_BASE_URL}${team.flagImagePath}`}
                            alt={team.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl">⚽</span>
                    )}
                </div>

                {/* Nom de l'équipe */}
                <h3 className="font-black text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                    {team.name}
                </h3>

                {/* Continent */}
                <p className="text-sm text-gray-500 mt-1 font-semibold">
                    {team.continent}
                </p>
                
            </div>
        </Link>
    );
};

export default TeamCard;