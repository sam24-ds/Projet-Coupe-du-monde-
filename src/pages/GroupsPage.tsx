// src/pages/GroupsPage.tsx

import { useState, useEffect, useMemo } from 'react';
import type { Group, Team } from '../types';
import { getAllGroups, getAllTeams } from '../services/apiService';
import TeamCard from '../components/TeamCard'; 
import { useNavigate } from 'react-router-dom';

function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsData, teamsData] = await Promise.all([
          getAllGroups(),
          getAllTeams()
        ]);
        setGroups(groupsData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const filteredGroups = useMemo(() => {
    if (!selectedGroupName) {
      return groups; 
    }
    return groups.filter(group => group.name === selectedGroupName);
  }, [groups, selectedGroupName]);

  const handleGroupClick = (groupId: number) => {
    navigate(`/?group=${groupId}`);
  };


  if (isLoading) return <p className="text-center text-xl mt-10">Chargement des groupes...</p>;

  return (
    // 1. Fond de page gris clair pour faire ressortir les cartes
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Groupes de la Compétition</h1>

        {/* Filtre <select> */}
        <div className="flex justify-center mb-10">
          <select 
            value={selectedGroupName} 
            onChange={e => setSelectedGroupName(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          >
            <option value="">Voir tous les groupes</option>
            {groups.map(g => <option key={g.id} value={g.name}>Groupe {g.name}</option>)}
          </select>
        </div>

        {/* Conteneur pour la liste des groupes */}
        <div className="flex flex-col gap-10"> 
          {filteredGroups.map(group => (
            
            // 2. LA CARTE DE GROUPE (cliquable)
            <div 
              key={group.id} 
              // Nouveau style de carte : shadow-lg, bordure subtile, et effet de survol
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer 
                         transition-all duration-300 ease-in-out 
                         hover:shadow-2xl hover:scale-[1.02]" // Effet de "soulèvement"
              onClick={() => handleGroupClick(group.id)}
            >
              
              {/* 3. En-tête de la carte */}
              <div className="flex justify-between items-center bg-gray-50 p-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  Groupe {group.name}
                </h2>
                {/* 4. Indicateur de clic */}
                <span className="text-sm font-medium text-blue-600 hidden md:block">
                  (Cliquer pour filtrer les matchs)
                </span>
              </div>
              
              {/* 5. Grille des équipes (réorganisée) */}
              <div 
                className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center"
              >
                {teams
                  .filter(team => team.groupId === group.id)
                  .map(team => (
                    <TeamCard key={team.id} team={team} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupsPage;