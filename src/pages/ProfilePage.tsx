import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "lucide-react"; // Importation d'une icône pour le titre

export default function ProfilePage() {
    const auth = useContext(AuthContext);

    if (!auth) {
        return <p className="text-center text-lg mt-10 text-red-500">AuthContext non disponible. Veuillez contacter le support.</p>;
    }

    const { user, logout } = auth;

    return (
        // Conteneur principal (fond gris clair)
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            
            <div className="max-w-3xl mx-auto">
                
                {/* HEADER ET TITRE */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-t-4 border-blue-600">
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <User className="w-8 h-8 text-blue-600" /> Mon Profil
                    </h1>
                    <p className="text-gray-500 mt-1">Gérez vos informations personnelles et votre session.</p>
                </div>
                
                {/* CONTENU DU PROFIL */}
                {user ? (
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
                        
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 border-gray-200">
                            Détails du Compte
                        </h2>
                        
                        {/* Information Nom Complet */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <p className="text-gray-600 font-semibold">Nom complet:</p>
                            <p className="text-lg font-bold text-gray-900">{user.firstname} {user.lastname}</p>
                        </div>
                        
                        {/* Information Email */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <p className="text-gray-600 font-semibold">Email:</p>
                            <p className="text-lg font-bold text-blue-600">{user.email}</p>
                        </div>
                        
                        {/* Information Date de naissance */}
                        {user.birthDate && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <p className="text-gray-600 font-semibold">Date de naissance:</p>
                                <p className="text-lg font-bold text-gray-900">{user.birthDate}</p>
                            </div>
                        )}

                        {/* Bouton de Déconnexion */}
                        <div className="pt-6">
                            <button
                                onClick={logout}
                                className="w-full md:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg 
                                           shadow-lg hover:bg-red-700 transition duration-300 ease-in-out 
                                           transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Se Déconnecter
                            </button>
                        </div>
                    </div>
                ) : (
                    // État de chargement
                    <div className="bg-white p-8 rounded-xl text-center shadow-lg">
                        <p className="text-xl text-gray-600 animate-pulse">Chargement de votre profil...</p>
                    </div>
                )}
            </div>
        </div>
    );
}