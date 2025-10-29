// src/pages/TeamsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import type { Team } from '../types';
import { getAllTeams } from '../services/apiService';
import TeamCard from '../components/TeamCard';
import './TeamsPage.css'; 

function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState('');

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

  if (isLoading) return <p>Chargement des équipes...</p>;

  return (
    <div className="page-container">
      <h1>Équipes Qualifiées</h1>

      {/* Filtre par Continent */}
      <div className="filters-container">
        <select 
          value={selectedContinent} 
          onChange={(e) => setSelectedContinent(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les continents</option>
          {continents.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="teams-grid">
        {filteredTeams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

export default TeamsPage;