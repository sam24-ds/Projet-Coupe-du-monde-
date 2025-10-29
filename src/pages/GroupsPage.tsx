// src/pages/GroupsPage.tsx

import { useState, useEffect, useMemo } from 'react';
import type { Group, Team } from '../types';
import { getAllGroups, getAllTeams } from '../services/apiService';
import TeamCard from '../components/TeamCard'; 

function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroupName, setSelectedGroupName] = useState('');

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
  
  //FILTRAGE
  const filteredGroups = useMemo(() => {
    if (!selectedGroupName) {
      return groups; // Si aucun filtre, on affiche tous les groupes
    }
    return groups.filter(group => group.name === selectedGroupName);
  }, [groups, selectedGroupName]);

  if (isLoading) return <p>Chargement des groupes...</p>;

  return (
    <div className="page-container">
      <h1>Groupes de la Compétition</h1>

      {/* Filtre par nom de groupe */}
      <div className="filters-container">
        <select 
          value={selectedGroupName} 
          onChange={e => setSelectedGroupName(e.target.value)}
          className="filter-select"
        >
          <option value="">Voir tous les groupes</option>
          {groups.map(g => <option key={g.id} value={g.name}>Groupe {g.name}</option>)}
        </select>
      </div>

      <div className="groups-container">
        {filteredGroups.map(group => (
          <div key={group.id} className="group-card">
            <h2>Groupe {group.name}</h2>
            <div className="group-teams-grid">
              {/* Pour chaque groupe, on filtre la liste complète des équipes */}
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
  );
}

export default GroupsPage;