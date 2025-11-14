import { useParams, Link } from "react-router-dom";

import { useState, useEffect, useMemo } from "react";

import { type Match, type TicketCategory } from "../types";

import { getMtchDetailsById, API_BASE_URL } from "../services/apiService";

import { useCart } from "../context/CartContext";

// Note : DollarSign est remplacé par Ticket dans le bouton ci-dessous

import { ArrowLeft, MapPin, Building2, Ticket, DollarSign } from 'lucide-react'; 



// Importation de l'image de fond du stade

import stadiumBackground from "../sta.jpg"; 



function MatchDetailPage() {

    const { id } = useParams<{ id: string }>();

    const [match, setMatch] = useState<Match | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; categoryName: string | null; details: TicketCategory | null; color: string | null; }>({

        visible: false, x: 0, y: 0, categoryName: null, details: null, color: null

    });

    const { addToCart } = useCart();



    // Mapping statique de la couleur

    const categoryColorMap: Record<string, string> = useMemo(() => ({

        'VIP': 'red',

        'CATEGORY_1': 'green',

        'CATEGORY_2': 'gray',

        'CATEGORY_3': 'blue',

    }), []);



    useEffect(() => {

        if (!id) return;

        const fetchMatchDetails = async () => {

            try {

                setIsLoading(true);

                const data = await getMtchDetailsById(id);

                

                if (data.categories && !selectedCategory) {

                    const firstCategory = Object.keys(data.categories)[0];

                    setSelectedCategory(firstCategory);

                }

                setMatch(data);

            } catch (err: any) {

                setError(err.message);

            } finally {

                setIsLoading(false);

            }

        };

        fetchMatchDetails();

    }, [id]); 



    // Gère le survol et le déplacement de la souris sur les zones du stade

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, categoryName: string) => {

        const details = match?.categories ? match.categories[categoryName as keyof typeof match.categories] : null;

        setTooltip({

            visible: true,

            x: e.clientX,

            y: e.clientY,

            categoryName: categoryName,

            details: details,

            color: categoryColorMap[categoryName] || 'gray'

        });

    };



    // Gère le départ du survol

    const handleMouseLeave = () => {

        setTooltip(prev => ({ ...prev, visible: false }));

    };



    // Gère le clic (Sélectionne la catégorie pour la persistance)

    const handleCategorySelect = (categoryName: string) => {

        setSelectedCategory(categoryName);

        setTooltip(prev => ({ ...prev, visible: false })); // Cache la bulle au clic

    };

    

    // --- Composant de la bulle flottante (Tooltip) ---

    const FloatingTooltip = () => {

        if (!tooltip.visible || !tooltip.details || !tooltip.categoryName) return null;



        const { x, y, categoryName, details, color } = tooltip;



        return (

            <div

                style={{ left: x + 20, top: y - 80 }} 

                className={`fixed z-50 bg-white p-3 rounded-xl shadow-2xl border-t-4 border-${color}-600 transition-opacity max-w-xs`}

            >

                <h4 className={`font-black text-base uppercase text-${color}-600`}>

                    {categoryName.replace("_", " ")}

                </h4>

                <p className="text-sm text-gray-700 font-bold">

                    {details.price}€ / {details.availableSeats} places

                </p>

            </div>

        );

    };

    // --- Fin du Composant de la bulle flottante (Tooltip) ---





    if (isLoading) return <p className="text-center text-xl text-gray-700 mt-10">Chargement...</p>;

    if (error) return <p className="text-red-600 text-center mt-10 text-lg">Erreur: {error}</p>;

    if (!match) return <p className="text-center mt-10">Match non trouvé.</p>;



    const activeCategory = selectedCategory;



    // Fonction utilitaire pour générer les props d'interaction du stade

    const getTribuneProps = (categoryName: string) => ({

        onClick: () => handleCategorySelect(categoryName),

        onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => handleMouseEnter(e, categoryName),

        onMouseLeave: handleMouseLeave,

        className: `absolute z-20 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80`

    });



    return (

        <div className="min-h-screen bg-gray-50">

            

            <FloatingTooltip /> 

            

            {/* Bouton retour et Header */}

            {/* ✅ CHANGEMENT : Fond gris sombre/noir et texte blanc */}

            <div className="bg-gray-800 shadow-md">

                <div className="max-w-7xl mx-auto px-4 py-4">

                    <Link

                        to="/"

                        className="flex items-center space-x-2 text-white hover:text-yellow-300 font-bold transition-colors"

                    >

                        {/* L'icône ArrowLeft sera blanche grâce à text-white */}

                        <ArrowLeft className="w-5 h-5" /> 

                        <span>Retour à la liste des matchs</span>

                    </Link>

                </div>

            </div>



            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header du match */}

                <div 

                    className="rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden bg-cover bg-center"

                    style={{ backgroundImage: `url(${stadiumBackground})` }}

                >

                    {/* Overlay sombre spécifique à l'en-tête du match */}

                    <div className="absolute inset-0 bg-black bg-opacity-60 rounded-3xl z-0"></div> 

                    

                    <div className="relative z-10 flex items-start justify-between">

                        <div className="flex flex-col items-center flex-1">

                            {/* Drapeau équipe à domicile */}

                            <div className="p-1 rounded-full border-4 border-yellow-400 bg-white shadow-xl mb-4">

                                <img src={`${API_BASE_URL}${match.homeTeam.flagImagePath}`} alt={match.homeTeam.name} className="w-24 h-24 object-cover rounded-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/96x96?text=Flag'; }} />

                            </div>

                            <h2 className="text-3xl font-black">{match.homeTeam.name}</h2>

                        </div>

                        <div className="flex flex-col items-center flex-shrink-0 pt-6">

                            <div className="bg-red-600 text-white font-black text-3xl p-5 rounded-xl shadow-2xl mb-4">VS</div>

                            <div className="text-center space-y-1">

                                <p className="text-base font-semibold">{new Date(match.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>

                                <p className="text-4xl font-black text-yellow-300">{new Date(match.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>

                            </div>

                        </div>

                        <div className="flex flex-col items-center flex-1">

                            {/* Drapeau équipe à l'extérieur */}

                            <div className="p-1 rounded-full border-4 border-yellow-400 bg-white shadow-xl mb-4">

                                <img src={`${API_BASE_URL}${match.awayTeam.flagImagePath}`} alt={match.awayTeam.name} className="w-24 h-24 object-cover rounded-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/96x96?text=Flag'; }} />

                            </div>

                            <h2 className="text-3xl font-black">{match.awayTeam.name}</h2>

                        </div>

                    </div>

                    <div className="relative z-10 mt-8 bg-green-700/70 rounded-xl p-4 flex items-center justify-center space-x-3 shadow-lg">

                        <MapPin className="w-5 h-5 text-yellow-300" />

                        <Building2 className="w-5 h-5 text-yellow-300" />

                        <span className="font-bold text-lg">{match.stadium.name} • {match.stadium.city}</span>

                    </div>

                </div>

                

                {/* Structure de la page : Deux colonnes pour STADE et CARTE DE SÉLECTION */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    

                    {/* Colonne 1: STADE & LÉGENDE */}

                    <div className="lg:col-span-2 space-y-8">

                        

                        {/* Plan du stade - DESIGN FINAL OVALE ET AGRANDI */}

                        <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-600">

                            <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">

                                <MapPin className="w-8 h-8 text-red-600" /> Plan du stade

                            </h2>

                            

                            {/* CONTENEUR PRINCIPAL DU STADE OVALE */}

                            <div 

                                className="relative w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden flex justify-center items-center p-4"

                                onMouseLeave={handleMouseLeave} // Gère le départ du survol global

                            >

                                {/* Cadre extérieur gris clair */}

                                <div className="absolute w-[95%] h-[90%] bg-gray-200 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

                                

                                {/* Cadre intérieur gris sombre (Zone principale des tribunes) */}

                                <div className="absolute w-[80%] h-[80%] bg-gray-800 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">

                                    

                                    {/* Terrain de Football (Centre) */}

                                    <div className="w-[60%] h-[50%] bg-green-700 rounded-lg border-2 border-white flex justify-center items-center z-10">

                                        <div className="w-full h-px bg-white absolute top-1/2 -translate-y-1/2"></div>

                                        <div className="w-16 h-16 border-2 border-white rounded-full"></div>

                                    </div>

                                    

                                    {/* ZONES DE CATÉGORIES (Positionnées sur les bords intérieurs du cercle sombre) */}

                                    

                                    {/* Zone Nord (VIP - ROUGE) - MAINTENANT EN HAUT */}

                                    <div {...getTribuneProps('VIP')} onMouseEnter={(e) => handleMouseEnter(e, 'VIP')} className={`absolute top-[10%] w-[50%] h-[20%] rounded-t-full bg-${categoryColorMap['VIP']}-600`}></div>

                                    

                                    {/* Zone Sud (CAT 2 - GRIS - INCHANGÉE) */}

                                    <div {...getTribuneProps('CATEGORY_2')} onMouseEnter={(e) => handleMouseEnter(e, 'CATEGORY_2')} className={`absolute bottom-[10%] w-[50%] h-[20%] rounded-b-full bg-${categoryColorMap['CATEGORY_2']}-600`}></div>



                                    {/* Zone Est (CAT 3 - BLEU - INCHANGÉE) */}

                                    <div {...getTribuneProps('CATEGORY_3')} onMouseEnter={(e) => handleMouseEnter(e, 'CATEGORY_3')} className={`absolute right-[10%] h-[50%] w-[18%] rounded-r-full bg-${categoryColorMap['CATEGORY_3']}-600`}></div>

                                    

                                    {/* Zone Ouest (CAT 1 - VERT) - MAINTENANT À GAUCHE */}

                                    <div {...getTribuneProps('CATEGORY_1')} onMouseEnter={(e) => handleMouseEnter(e, 'CATEGORY_1')} className={`absolute left-[10%] h-[50%] w-[18%] rounded-l-full bg-${categoryColorMap['CATEGORY_1']}-600`}></div>



                                </div> {/* FIN du Cadre intérieur sombre */}

                                

                            </div> {/* FIN DU CONTENEUR PRINCIPAL DU STADE */}

                        </div>



                        {/* Légende des catégories (Reste inchangée) */}

                        <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-600">

                            <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">

                                <Ticket className="w-6 h-6 text-red-600" /> Légende des catégories

                            </h3>

                            <div className="grid grid-cols-2 gap-4">

                                {Object.entries(categoryColorMap).map(([categoryName, color]) => {

                                    return (

                                        <div key={categoryName} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm">

                                            <div className={`w-4 h-4 rounded-full bg-${color}-600`}></div>

                                            <span className="font-semibold text-gray-800 capitalize">

                                                {categoryName.replace("_", " ")}

                                            </span>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    </div>



                    {/* Colonne 2: Carte de détails des tarifs (Affichage permanent de toutes les cartes) */}

                    {match.categories && (

                        <div className="lg:col-span-1 space-y-4">

                            <h3 className="text-2xl font-black text-gray-800 mb-2">Sélectionnez votre place</h3>

                            

                            {Object.entries(match.categories).map(([categoryName, details]) => {

                                const color = categoryColorMap[categoryName] || 'gray';

                                const isActive = selectedCategory === categoryName;

                                

                                return (

                                    <div

                                        key={categoryName}

                                        id={`card-${categoryName}`}

                                        onClick={() => handleCategorySelect(categoryName)}

                                        className={`bg-white rounded-xl shadow-md p-5 border-2 transition-all cursor-pointer 

                                            border-${color}-600 

                                            ${isActive ? `scale-[1.02] shadow-xl ring-2 ring-${color}-600` : 'hover:border-red-300'}`}

                                    >

                                        <div className="flex justify-between items-start mb-2">

                                            <h4 className={`font-black text-xl uppercase text-${color}-600`}>

                                                {categoryName.replace("_", " ")}

                                            </h4>

                                            <div className={`w-3 h-3 rounded-full bg-${color}-600 mt-2`}></div>

                                        </div>



                                        <div className="mt-3 space-y-1">

                                            <div className="flex items-baseline justify-between">

                                                <span className="text-sm font-bold text-gray-600">PRIX :</span>

                                                <span className="text-3xl font-black text-green-700">{details.price}€</span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">

                                                <span className="font-semibold">Places restantes:</span>

                                                <span className="font-bold">{details.availableSeats}</span>

                                            </div>

                                        </div>



                                        {/* Bouton Réserver/Épuisé */}

                                        {details.availableSeats > 0 ? (

                                            <button

                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    addToCart(match, categoryName, details);

                                                }}

                                                className="w-full mt-4 bg-red-600 text-white font-black py-3 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-all flex items-center justify-center"

                                            >

                                                <Ticket className="w-5 h-5 mr-2" /> Ajouter au panier

                                            </button>

                                        ) : (

                                            <button disabled className="w-full mt-4 bg-gray-400 text-white font-black py-3 px-4 rounded-lg cursor-not-allowed">

                                                Épuisé

                                            </button>

                                        )}

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}



// Fonction utilitaire pour générer les props d'interaction du stade

const getTribuneProps = (categoryName: string) => ({

    onClick: (e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); (window as any).handleCategorySelect(categoryName); },

    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { (window as any).handleMouseEnter(e, categoryName); },

    onMouseLeave: (window as any).handleMouseLeave,

    // Classes de base pour l'interaction

    className: `absolute z-20 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80`

});



export default MatchDetailPage;