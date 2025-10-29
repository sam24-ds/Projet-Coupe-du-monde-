import type { Match, Team, Group } from "../types"
import MatchCard from "../components/MatchCard"
import { useState, useEffect, useMemo } from "react";
import { getAllMatches, getAllTeams, getAllGroups} from "../services/apiService";
import './HomePage.css'

function HomePage() {
  // constante pour stocker les match recuperer depuis l'api
  const [matches, setMatches] = useState<Match[]>([]);
  // constante pour stocker les equipes 
  const [teams, setTeams] = useState<Team[]>([]);
  // constante pour stocker les groupes
  const [groups, setGroups] = useState<Group[]>([]);

  //constante pour stocker l'etat du chargement des matchs
  const [isLoding, setIsLoding] = useState(true);
  //constante pour stocker les erreurs
  const [error, setError] = useState<string | null>(null);

  //Etats pour les filtres
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

useEffect(()=>{
  const loadInitialData = async () =>{
    try{
        const [matchesData, teamsData, groupsData] = await Promise.all([
        getAllMatches(), getAllTeams(), getAllGroups()
        ]);

      setMatches(matchesData);
      setTeams(teamsData);
      setGroups(groupsData);
      console.log("matche data : ", matchesData)
      console.log("matche data : ", teamsData)
      console.log("matche data : ", groupsData)

    } catch (err: any){
      setError(err.message);

    }finally{
      setIsLoding(false);
    }
  };

  loadInitialData();
}, []);

// FILTRES

const filteredMatches = useMemo(() =>{
  let tempMatches = matches;

  //Filtre par DATE
    if (selectedDate) {
      tempMatches = tempMatches.filter(match => 
        match.date.startsWith(selectedDate) // Compare le début de la date ISO (YYYY-MM-DD)
      );
    }

    //Filtre par ÉQUIPE
    if (selectedTeamId) {
      tempMatches = tempMatches.filter(match =>
        match.homeTeam.id === parseInt(selectedTeamId) ||
        match.awayTeam.id === parseInt(selectedTeamId)
      );
    }

    //Filtre par GROUPE
    if (selectedGroupId) {
      // On filtre directement sur les données du match.
     tempMatches = tempMatches.filter(match =>
        // On vérifie si le groupId de l'équipe à domicile OU de l'équipe à l'extérieur correspond au groupe sélectionné.
        match.homeTeam.groupId === parseInt(selectedGroupId) ||
        match.awayTeam.groupId === parseInt(selectedGroupId)
      );
    }
    return tempMatches;
},[matches, selectedDate, selectedTeamId, selectedGroupId])//tableau de dépendances;



  //On extrait les dates uniques pour le filtre par date
const availableDates = useMemo(() => 
    [...new Set(matches.map(match => match.date.split('T')[0]))].sort(),
    [matches]
  );

if (isLoding){
  return <p style={{ textAlign: 'center', fontSize:'1.5em'}}> Chargements des matchs ...</p>
}

if (error){
  return <p style={{color: 'red', textAlign:'center'}}>Erreur: {error}</p>;
}


// Fonction pour réinitialiser tous les filtres
    const clearFilters = () => {
    setSelectedDate('');
    setSelectedTeamId('');
    setSelectedGroupId('');
  };


return (
    <div className="app-container">
      <h1>Billetterie pour la Coupe du Monde 2026</h1>
      
      <div className="filters-container">
        {/* Filtre par Date */}
        <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="filter-select">
          <option value="">Filtrer par date</option>
          {availableDates.map(date => <option key={date} value={date}>{new Date(date).toLocaleDateString('fr-FR')}</option>)}
        </select>
        
        {/* Filtre par Équipe */}
        <select value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} className="filter-select">
          <option value="">Filtrer par équipe</option>
          {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>

        {/* Filtre par Groupe */}
        <select value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} className="filter-select">
          <option value="">Filtrer par groupe</option>
          {groups.map(group => <option key={group.id} value={group.id}>Groupe {group.name}</option>)}
        </select>

        <button onClick={clearFilters} className="clear-filter-btn">Réinitialiser</button>
      </div>

      <main className="match-list">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => <MatchCard key={match.id} match={match} />)
        ) : (
          <p>Aucun match ne correspond à vos critères de recherche.</p>
        )}
      </main>
    </div>
  );
}

export default HomePage;
