import type { Match, Team, Group } from "../types";
import MatchCard from "../components/MatchCard";
import { useState, useEffect, useMemo } from "react";
import { getAllMatches, getAllTeams, getAllGroups } from "../services/apiService";
import { useSearchParams } from "react-router-dom"; 

// Importation de l'image de fond 
import homePageBackground from "../img/worldcup_bg.jpg"; 

function HomePage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // états des filtres 
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. CHARGEMENT DES DONNÉES (Uniquement)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [matchesData, teamsData, groupsData] = await Promise.all([
                    getAllMatches(),
                    getAllTeams(),
                    getAllGroups(),
                ]);
                setMatches(matchesData);
                setTeams(teamsData);
                setGroups(groupsData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []); 


    useEffect(() => {
        const searchParams = new URLSearchParams();
        selectedTeamId != ''?searchParams.set('team', selectedTeamId):searchParams.delete('team');
        selectedGroupId != ''?searchParams.set('group', selectedGroupId):searchParams.delete('group');
        selectedDate != ''?searchParams.set('date', selectedDate):searchParams.delete('date');
        setSearchParams(searchParams,{ replace: true});
    }, [selectedTeamId, selectedGroupId, selectedDate]);
    useEffect(() => {
        const teamIdFromUrl = searchParams.get('team') || '';
        const groupIdFromUrl = searchParams.get('group') || '';
        const dateFromUrl = searchParams.get('date') || '';
        
        setSelectedTeamId(teamIdFromUrl);
        setSelectedGroupId(groupIdFromUrl);
        setSelectedDate(dateFromUrl);
    }, [searchParams]);
    const filteredMatches = useMemo(() => {
        let temp = matches;

        if (selectedDate) {
            temp = temp.filter(match => match.date.startsWith(selectedDate));
        }
        
        if (selectedTeamId) {
            temp = temp.filter(match =>
                match.homeTeam.id === parseInt(selectedTeamId) ||
                match.awayTeam.id === parseInt(selectedTeamId)
            );
        }
        
        if (selectedGroupId) {

            temp = temp.filter(match =>
                (match.homeTeam.groupId && match.homeTeam.groupId === parseInt(selectedGroupId)) ||
                (match.awayTeam.groupId && match.awayTeam.groupId === parseInt(selectedGroupId))
            );
        }
        return temp;
    }, [matches, selectedDate, selectedTeamId, selectedGroupId]); // Dépendances propres


    const availableDates = useMemo(
        () => [...new Set(matches.map(m => m.date.split("T")[0]))].sort(),
        [matches]
    );

    const clearFilters = () => {
        setSelectedDate('');
        setSelectedTeamId('');
        setSelectedGroupId('');
        // setSearchParams({}, { replace: true }); // 'useEffect 3' s'en chargera
    };

    if (isLoading) {
        return <p className="text-center text-xl mt-10">Chargement des matchs...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 text-lg">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50"> 
            {/* HEADER (Nouveau design conservé) */}
            <div 
                className="relative bg-cover bg-center py-12 px-4 shadow-xl"
                style={{ backgroundImage: `url(${homePageBackground})` }}
            >
                <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-white"> 
                    <h1 className="text-4xl font-extrabold text-center mb-8">
                        Billetterie Coupe du Monde 2026
                    </h1>

                    {/* FILTRES (Le JSX est bon) */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
                        
                        {/* Filtre Date */}
                        <select
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Filtrer par date</option>
                            {availableDates.map(date => (
                                <option key={date} value={date}>
                                    {new Date(date).toLocaleDateString("fr-FR")}
                                </option>
                            ))}
                        </select>

                        {/* Filtre Équipe */}
                        <select
                            value={selectedTeamId}
                            onChange={e => setSelectedTeamId(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Filtrer par équipe</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        {/* Filtre Groupe */}
                        <select
                            value={selectedGroupId}
                            onChange={e => setSelectedGroupId(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Filtrer par groupe</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    Groupe {group.name}
                                </option>
                            ))}
                        </select>

                        {/* RESET */}
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* LISTE DES MATCHS (Le JSX est bon) */}
            <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <MatchCard key={match.id} match={match} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        Aucun match ne correspond à vos critères.
                    </p>
                )}
            </main>
        </div>
    );
}

export default HomePage;