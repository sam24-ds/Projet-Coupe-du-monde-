import { useState, useEffect, useMemo } from "react";
import type { Group, Team } from "../types";
import { getAllGroups, getAllTeams } from "../services/apiService";
import TeamCard from "../components/TeamCard";
import { Link } from 'react-router-dom'; // Ajout de l'import Link

// ✅ PARTIE RAJOUTÉE : Importation de l'image de fond pour le header
import groupsPageBackground from "../groups_bg.jpg"; // <--- Assurez-vous que le chemin est correct !

function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGroupName, setSelectedGroupName] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [groupsData, teamsData] = await Promise.all([
                    getAllGroups(),
                    getAllTeams(),
                ]);
                setGroups(groupsData);
                setTeams(teamsData);
            } catch (error) {
                console.error("Erreur lors du chargement des groupes :", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // 🔍 Filtrage par nom de groupe
    const filteredGroups = useMemo(() => {
        if (!selectedGroupName) return groups;
        return groups.filter((g) => g.name === selectedGroupName);
    }, [groups, selectedGroupName]);

    if (isLoading)
        return (
            <p className="text-center text-lg mt-10 text-gray-600 animate-pulse">
                Chargement des groupes...
            </p>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER AVEC IMAGE DE FOND POUR TITRE ET FILTRE */}
            <div
                className="relative bg-cover bg-center py-12 px-4 shadow-xl"
                style={{ backgroundImage: `url(${groupsPageBackground})` }}
            >
                {/* Overlay sombre pour la lisibilité */}
                <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-white">
                    {/* Suppression du logo 🏆 */}
                    <h1 className="text-5xl font-black mb-3 text-center"> 
                        Groupes de la Compétition
                    </h1>
                    <p className="text-xl text-center text-gray-200">
                        Phase de groupes — Coupe du Monde 2026
                    </p>

                    {/* FILTRE - DÉPLACÉ DANS LA SECTION DU HEADER */}
                    <div className="bg-white rounded-xl shadow-xl p-6 mt-10 border-2 border-gray-200">
                        <div className="flex items-center justify-center space-x-4">
                            <label className="text-lg font-black text-gray-700">
                                Filtrer par groupe :
                            </label>
                            <select
                                value={selectedGroupName}
                                onChange={(e) => setSelectedGroupName(e.target.value)}
                                className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white font-bold text-gray-700 hover:border-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                            >
                                {/* Suppression du logo 📊 */}
                                <option value="">Tous les groupes</option> 
                                {groups.map((g) => (
                                    <option key={g.id} value={g.name}>
                                        Groupe {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* LISTE DES GROUPES (Maintenant en dessous de la section avec image de fond) */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="space-y-10">
                    {filteredGroups.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-xl p-12 text-center border-2 border-gray-200">
                            <div className="text-6xl mb-4">😔</div>
                            <p className="text-2xl font-bold text-gray-700 mb-2">
                                Aucun groupe trouvé
                            </p>
                            <p className="text-gray-500 mb-6">
                                Modifiez votre filtre pour voir d'autres groupes.
                            </p>
                            <button
                                onClick={() => setSelectedGroupName("")}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all"
                            >
                                Voir tous les groupes
                            </button>
                        </div>
                    ) : (
                        filteredGroups.map((group) => (
                            // ✅ FONCTIONNALITÉ FUSIONNÉE : La carte est enveloppée dans un Link
                            <Link 
                                key={group.id} 
                                to={`/?group=${group.id}`} 
                                className="block group-link" // Utiliser "block" pour que le Link prenne toute la largeur
                            >
                                <div
                                    className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 group-hover:border-blue-500 transition-colors duration-300"
                                >
                                    {/* Titre du groupe */}
                                    <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-200">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                                            <span className="text-3xl font-black text-white">
                                                {group.name}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 group-hover:text-blue-700 transition-colors">
                                            Groupe {group.name}
                                        </h2>
                                    </div>

                                    {/* Liste des équipes du groupe */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                        {teams
                                            .filter((team) => team.groupId === group.id)
                                            .map((team) => (
                                                // TeamCard n'est plus cliquable ici, car le parent Link gère le clic
                                                <TeamCard key={team.id} team={team} />
                                            ))}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupsPage;