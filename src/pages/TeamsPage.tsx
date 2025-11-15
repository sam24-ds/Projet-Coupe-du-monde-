// src/pages/TeamsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import type { Team } from '../types';
import { getAllTeams } from '../services/apiService';
import TeamCard from '../components/TeamCard';

// ✅ PARTIE CONSERVÉE : Importation de l'image de fond pour le header
import teamsPageBackground from "../img/teams_bg.jpg"; // <--- Assurez-vous que le chemin est correct !

function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContinent, setSelectedContinent] = useState('');

    // ✅ LOGIQUE CONSERVÉE : Chargement des données au montage
    useEffect(() => {
        getAllTeams().then(data => {
            setTeams(data);
            setIsLoading(false);
        });
    }, []);

    // Extraction automatique de la liste des continents disponibles
    const continents = useMemo(() =>
        [...new Set(teams.map(team => team.continent))].sort(),
        [teams]
    );

    // Filtrage
    const filteredTeams = useMemo(() => {
        if (!selectedContinent) return teams;
        return teams.filter(team => team.continent === selectedContinent);
    }, [teams, selectedContinent]);

    if (isLoading) return <p className="text-center text-lg mt-10">Chargement des équipes...</p>;

    return (
        <div className="min-h-screen bg-gray-50"> {/* Conteneur principal */}
            
            {/* HEADER AVEC IMAGE DE FOND POUR TITRE ET FILTRE */}
            <div
                className="relative bg-cover bg-center py-12 px-4 shadow-xl"
                style={{ backgroundImage: `url(${teamsPageBackground})` }}
            >
                {/* Overlay sombre pour la lisibilité */}
                <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

                <div className="max-w-6xl mx-auto relative z-10 text-white">
                    {/* Suppression du logo ⚽ */}
                    <h1 className="text-5xl font-extrabold text-center mb-4">
                        Équipes Qualifiées
                    </h1>
                    
                    <p className="text-xl text-center text-gray-200 mb-8">
                        Sélectionnez un continent pour filtrer les participants
                    </p>

                    {/* Filtre par Continent */}
                    <div className="flex justify-center">
                        <select 
                            value={selectedContinent} 
                            onChange={(e) => setSelectedContinent(e.target.value)}
                            // Couleurs ajustées pour être visibles sur fond sombre du header
                            className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-gray-700 text-white shadow-md focus:ring-blue-500 focus:border-blue-500 font-bold transition-all outline-none"
                        >
                            <option value="">Tous les continents</option>
                            {continents.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>


            {/* Grille des équipes */}
            <div className="max-w-6xl mx-auto px-4 py-10">
                {filteredTeams.length === 0 ? (
                    <p className="text-center text-gray-500 mt-6">Aucune équipe trouvée pour ce continent.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filteredTeams.map(team => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeamsPage;