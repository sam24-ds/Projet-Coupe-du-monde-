import { useContext, useState, useEffect } from "react"; // Ajout de useState et useEffect
import { AuthContext } from "../context/AuthContext";
import { User, LogOut, Ticket, Clock, CheckCircle, Link } from "lucide-react"; // Nouvelles icônes
import { getMyTickets } from '../services/apiService'; // Import de la fonction API
import type { Ticket as TicketType } from '../types'; // Renommer Ticket pour éviter le conflit avec l'icône Lucide

export default function ProfilePage() {
    const auth = useContext(AuthContext);
    
    // NOUVEL ÉTAT DE FONCTIONNALITÉ : Gestion des tickets
    const [myTickets, setMyTickets] = useState<TicketType[]>([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(true); // Renommé pour éviter le conflit

    if (!auth) {
        return <p className="text-center text-lg mt-10 text-red-500">AuthContext non disponible. Veuillez contacter le support.</p>;
    }

    const { user, logout } = auth;

    // ✅ LOGIQUE FUSIONNÉE : Charger les tickets de l'utilisateur
    useEffect(() => {
        if (!user) return; // Ne charge rien si l'utilisateur n'est pas identifié

        getMyTickets()
            .then(response => {
                if (response) {
                    setMyTickets(response);
                }
            })
            .catch(err => console.error("Impossible de charger les tickets:", err))
            .finally(() => setIsLoadingTickets(false));
    }, [user]);
    
    // --- Styles d'accentuation (pour la démo) ---
    const ACCENT_COLOR = "blue";
    const accentBorder = `border-${ACCENT_COLOR}-600`;
    const accentText = `text-${ACCENT_COLOR}-600`;
    // ---------------------------------------------


    // Gère le cas où l'utilisateur n'est pas encore chargé
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                 <div className="bg-white p-8 rounded-xl text-center shadow-lg">
                    <p className="text-xl text-gray-600 animate-pulse">Chargement du profil...</p>
                </div>
            </div>
        );
    }
    
    // Rendu Principal
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            
            <div className="max-w-4xl mx-auto">
                
                {/* 1. HEADER DU PROFIL (VOTRE DESIGN TAILWIND) */}
                <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 border-t-4 ${accentBorder}`}>
                    <h1 className={`text-4xl font-black text-gray-900 flex items-center gap-3 ${accentText}`}>
                        <User className="w-8 h-8" /> Mon Tableau de Bord
                    </h1>
                    <p className="text-gray-500 mt-1">Bienvenue {user.firstname} ! Gérez vos informations et vos billets.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLONNE GAUCHE: DÉTAILS & DÉCONNEXION */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-5 border-2 border-gray-100">
                            
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 border-gray-200">
                                Informations Personnelles
                            </h2>
                            
                            {/* Nom Complet */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-gray-600 font-semibold">Nom complet:</p>
                                <p className="text-lg font-bold text-gray-900">{user.firstname} {user.lastname}</p>
                            </div>
                            
                            {/* Email */}
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-gray-600 font-semibold">Email:</p>
                                <p className={`text-lg font-bold ${accentText}`}>{user.email}</p>
                            </div>
                            
                            {/* Date de naissance */}
                            {user.birthDate && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <p className="text-gray-600 font-semibold">Date de naissance:</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {new Date(user.birthDate).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            )}

                            {/* Bouton de Déconnexion */}
                            <div className="pt-4">
                                <button
                                    onClick={logout}
                                    className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg 
                                               shadow-lg hover:bg-red-700 transition duration-300 flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-5 h-5"/> Se Déconnecter
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* COLONNE DROITE: MES TICKETS (NOUVELLE FONCTIONNALITÉ) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-5 border-2 border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 border-gray-200 flex items-center gap-2">
                                <Ticket className="w-6 h-6 text-gray-500" /> Mes Tickets
                            </h2>

                            {isLoadingTickets ? (
                                <div className="text-center py-10">
                                    <p className="text-xl text-gray-600 animate-pulse flex items-center justify-center gap-2">
                                        <Clock className="w-5 h-5" /> Chargement de vos réservations...
                                    </p>
                                </div>
                            ) : myTickets.length > 0 ? (
                                <div className="space-y-4">
                                    {myTickets.map(ticket => (
                                        <div 
                                            key={ticket.id} 
                                            // Style de carte de ticket
                                            className={`p-4 rounded-xl shadow-md border-l-8 ${ticket.status === 'confirmed' ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-500'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                {/* Match Info */}
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900">
                                                        {ticket.match.homeTeam} vs {ticket.match.awayTeam}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(ticket.match.matchDate).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{ticket.match.stadium}</p>
                                                </div>

                                                {/* Statut */}
                                                <div className="text-right">
                                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${ticket.status === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                                                        {ticket.status === 'confirmed' ? 'Confirmé' : 'Utilisé'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Détails du Billet */}
                                            <div className="mt-3 pt-3 border-t border-gray-200 text-sm flex justify-between">
                                                <span className="font-semibold text-gray-700">
                                                    Catégorie: <span className="font-bold text-gray-900">{ticket.category.replace('_', ' ')}</span>
                                                </span>
                                                <span className="font-semibold text-gray-700">
                                                    Siège: <span className="font-bold text-gray-900">{ticket.seatNumber || 'N/A'}</span>
                                                </span>
                                                <span className="font-semibold text-gray-700 flex items-center gap-1">
                                                     <CheckCircle className="w-4 h-4 text-green-600" /> Montant: <span className="font-black text-base">{ticket.price.toFixed(2)}€</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-lg">
                                    <p className="text-lg text-gray-600">Vous n'avez pas encore de billets achetés.</p>
                                    <Link to="/" className="text-blue-600 font-semibold mt-2 block">
                                        Commencer à réserver des matchs
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}