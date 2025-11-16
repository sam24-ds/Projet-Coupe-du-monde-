import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Zap, DollarSign, TrendingUp, TrendingDown, Clock, Tag } from 'lucide-react';
import { useState } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { addTicketToBooking } from '../services/apiService';
import toast from 'react-hot-toast'; 

// Importation de l'image de fond pour le header du panier (panier plein)
import cartHeaderBackground from "../img/cart_header_bg.jpg"; 
// La même image pour le panier vide
import emptyCartBackground from '../img/cart_header_bg.jpg'; 

function CartPage() {
    // FUSION DES HOOKS ET PROPS
    const { cartItems, removeFromCart, updateItemQuantity, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // ÉTATS DE LA VERSION DE VOTRE GROUPE
    const [isProcessing, setIsProcessing] = useState(false);
    
    // ÉTATS DE VOTRE DESIGN INNOVANT
    const [priceTrend, setPriceTrend] = useState<{ risk: number; direction: 'up' | 'down' | 'stable' } | null>(null);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const totalTickets = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // LOGIQUE INNOVANTE : Calcul de la réduction des frais
    const BASE_SERVICE_FEE = 5.00;
    const DISCOUNT_PER_TICKET = 0.50; 
    const MAX_DISCOUNT_TICKETS = 8; 

    const reductionTickets = Math.min(totalTickets, MAX_DISCOUNT_TICKETS);
    const serviceFeeReduction = Math.max(0, (reductionTickets - 1) * DISCOUNT_PER_TICKET);
    const finalServiceFee = Math.max(0.50, BASE_SERVICE_FEE - serviceFeeReduction); 
    const finalTotal = totalPrice + finalServiceFee;
    
    // LOGIQUE INNOVANTE : Simuler la tendance des prix
    const handleSimulatePrice = () => {
        if (totalTickets === 0) return;

        let totalAvailableSeats = 0;
        cartItems.forEach(item => {
            totalAvailableSeats += item.quantity; 
        });
        
        const rarityScore = totalTickets / 10; 
        
        let risk: number;
        let direction: 'up' | 'down' | 'stable';

        if (rarityScore > 0.5) { 
            risk = Math.min(Math.round(rarityScore * 15), 99);
            direction = 'up';
        } else if (rarityScore < 0.2) { 
            risk = 0;
            direction = 'stable';
        } else {
            risk = Math.round(rarityScore * 10);
            direction = 'stable';
        }

        setPriceTrend({ risk, direction });
        setTimeout(() => setPriceTrend(null), 8000);
    };

    // Gestion du processus de commande
    const handleProceedToCheckout = async () => {
        if (!isAuthenticated) {
            toast.error("Veuillez vous connecter pour continuer.");
            // Redirection intelligente
            navigate('/authentification', { replace: false, state: { from: location } });
            return;
        }

        setIsProcessing(true);
        const loadingToast = toast.loading("Création de votre réservation...");
        
        try {
            const bookingPromises = cartItems.map(item => 
                addTicketToBooking({
                    matchId: item.matchId,
                    category: item.categoryName,
                    quantity: item.quantity,
                })
            );
            
            await Promise.all(bookingPromises);

            toast.dismiss(loadingToast);
            toast.success("Réservation créée !");
            
            clearCart();
            // Redirection vers la page de confirmation/checkout
            navigate('/checkout', { replace: true }); 

        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(`Erreur lors de la réservation : ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };


    //Cas 1 : panier vide (Utilise le design avec image de fond)
    if (cartItems.length === 0) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center relative p-4"
                style={{ backgroundImage: `url(${emptyCartBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md border-2 border-gray-200 relative z-10">
                    <div className="text-8xl mb-6 text-gray-700">🛒</div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">
                        Votre panier est vide
                    </h2>
                    <p className="text-gray-700 mb-8">
                        Explorez les matchs et réservez vos billets !
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                        Voir les matchs
                    </Link>
                </div>
            </div>
        );
    }

    //panier avec articles (Utilise le design et les nouvelles logiques)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            {/* HEADER */}
            <div
                className="relative bg-cover bg-center py-8 shadow-xl"
                style={{ backgroundImage: `url(${cartHeaderBackground})` }}
            >
                <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
                    <h1 className="text-4xl md:text-5xl font-black flex items-center">
                        <span className="text-5xl mr-4">🛒</span> 
                        Mon Panier
                    </h1>
                    <p className="text-xl mt-2 text-gray-200">
                        {totalTickets} billet{totalTickets > 1 ? "s" : ""} sélectionné
                        {totalTickets > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Colonne 1: Liste des articles (avec votre design de carte) */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={`${item.matchId}-${item.categoryName}`}
                                className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-400 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-gray-800 mb-2">
                                            ⚽ {item.matchName}
                                        </h3>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                                                {item.categoryName.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.matchId, item.categoryName)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        title="Supprimer"
                                    >
                                        {/* Icône SVG */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                    {/* Prix unitaire */}
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Prix unitaire</p>
                                        <p className="text-2xl font-black text-gray-700">{item.price}€</p>
                                    </div>

                                    {/* Contrôles de Quantité */}
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateItemQuantity(item.matchId, item.categoryName, item.quantity - 1)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold w-10 h-10 rounded-lg shadow-md transition-all"
                                        > - </button>
                                        <span className="text-2xl font-black text-gray-800 w-12 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItemQuantity(item.matchId, item.categoryName, item.quantity + 1)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold w-10 h-10 rounded-lg shadow-md transition-all"
                                        > + </button>
                                    </div>

                                    {/* Total ligne */}
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 font-semibold">Total</p>
                                        <p className="text-3xl font-black text-green-600">{(item.price * item.quantity).toFixed(2)}€</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Colonne 2: Récapitulatif, Simulateur & Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200 sticky top-4">
                            
                            {/* Récapitulatif Header */}
                            <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center">
                                <DollarSign className="w-6 h-6 mr-2" /> Récapitulatif
                            </h2>

                            {/* Simulateur de Tendance des Prix */}
                            <div className="pb-6 border-b border-gray-200 mb-6">
                                <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5 text-yellow-600" /> Simulateur de Prix
                                </h3>
                                
                                <button
                                    onClick={handleSimulatePrice}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-black py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md mb-3"
                                    disabled={isProcessing} // Désactiver pendant la commande
                                >
                                    <Clock className="w-5 h-5" /> Estimer la Tendance Maintenant
                                </button>
                                
                                {priceTrend && priceTrend.direction !== 'stable' && (
                                    <div className={`p-3 rounded-lg flex items-center justify-between font-bold ${priceTrend.direction === 'up' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {priceTrend.direction === 'up' ? (
                                            <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4"/> Risque de Hausse:</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><TrendingDown className="w-4 h-4"/> Risque de Baisse:</span>
                                        )}
                                        <span>{priceTrend.risk}%</span>
                                    </div>
                                )}
                                {priceTrend && priceTrend.direction === 'stable' && (
                                    <div className="p-3 rounded-lg bg-gray-100 text-gray-700 font-bold text-center">
                                        Prix stable
                                    </div>
                                )}
                                {!priceTrend && (
                                    <p className="text-xs text-gray-500 text-center">Cliquez pour voir la probabilité que les prix des billets changent avant votre achat.</p>
                                )}
                            </div>

                            {/* Récapitulatif des Coûts */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-semibold">Nombre de billets</span>
                                    <span className="text-xl font-black text-gray-800">{totalTickets}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-semibold">Sous-total</span>
                                    <span className="text-xl font-black text-gray-800">{totalPrice.toFixed(2)}€</span>
                                </div>
                                
                                {/* Frais de service avec Réduction (INNOVANT) */}
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-semibold flex items-center gap-1">
                                        Frais de service
                                        {serviceFeeReduction > 0 && (
                                            <Tag className="w-4 h-4 text-green-600"/>
                                        )}
                                    </span>
                                    <span className="text-xl font-black text-gray-800 flex flex-col items-end">
                                        {serviceFeeReduction > 0 && (
                                            <span className="text-sm line-through text-red-400">{BASE_SERVICE_FEE.toFixed(2)}€</span>
                                        )}
                                        <span>{finalServiceFee.toFixed(2)}€</span>
                                    </span>
                                </div>

                                <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-black text-green-800">TOTAL</span>
                                        <span className="text-4xl font-black text-green-700">{finalTotal.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions de Commande (Bouton Valider du groupe) */}
                            <div className="space-y-3">
                                <button 
                                    onClick={handleProceedToCheckout} // Fonctionnalité du groupe
                                    disabled={isProcessing}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Réservation en cours...
                                        </>
                                    ) : (
                                        <>
                                            🎫 Passer la commande
                                        </>
                                    )}
                                </button>
                                <Link
                                    to="/"
                                    className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
                                >
                                    Continuer mes achats
                                </Link>
                            </div>

                            {/* Info */}
                            <div className="mt-6 bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
                                <p className="text-sm text-gray-800 font-semibold flex items-start">
                                    <Clock className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"/>
                                    Vos billets seront envoyés par e-mail après le paiement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;