//on va créer le contexte du panier ici

import {createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { Match, TicketCategory } from '../types';
import toast from 'react-hot-toast';


//cle pour le local storage
const CART_STORAGE_KEY = 'worldcup_cart';

//forme des articles dans le panier
export interface CartItem{
    matchId: number;
    matchName: string;
    categoryName: string;
    price:number;
    quantity:number;
    availableSeats: number;
}

//objet que contiendra notre contexte

export interface ICartContext {
    cartItems: CartItem[];
    addToCart: (match: Match, categoryName: string, categoryDetails: TicketCategory)=>void;
    updateItemQuantity : (matchId: number, categoryName: string, newQuantity: number) => void;
    removeFromCart: (matchId: number, categoryName: string) => void;
}

//on cree le context avec une valeur par defaut

const CartContext = createContext<ICartContext>({
    cartItems: [],
    addToCart: ()=>{},
    updateItemQuantity: () => {}, 
    removeFromCart: () => {},
});

//on cree le provider

export const CartProvider = ({children}: {children:ReactNode})=>{
  //initialisation de l'état  
  const [cartItems, setCartItems] = useState<CartItem[]>(()=>{
      try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      // Si le parsing échoue, on retourne un panier vide
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
    });

     useEffect(() => {
    // Ce code s'exécutera chaque fois que l'état 'cartItems' change.
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

const addToCart = (match: Match, categoryName: string, categoryDetails: TicketCategory) => {
    
      setCartItems(currentItems => {
          
          // 1. On calcule combien de tickets pour ce match son deja dans le panier.
          const ticketsForThisMatchInCart = currentItems
            .filter(item => item.matchId === match.id) // On prend tous les articles pour ce match
            .reduce((total, item) => total + item.quantity, 0); // On fait la somme de leurs quantités

          //Limite globale de 6 tickets par match
          if (ticketsForThisMatchInCart >= 6) {
            toast.error("Vous ne pouvez pas ajouter plus de 6 tickets par match.");
            return currentItems; // On ne modifie pas le panier.
          }
          
          //ici on va travailler sur les categories pour verifier les stocks par categories
          const existingItem = currentItems.find(item => 
            item.matchId === match.id && item.categoryName === categoryName
          );

          //Vérification du stock
          // La quantité actuelle de l'article spécifique + 1 ne doit pas dépasser le stock
          const currentQuantityForItem = existingItem ? existingItem.quantity : 0;
          if (currentQuantityForItem + 1 > categoryDetails.availableSeats) {
            toast.error("Il n'y a pas assez de places disponibles dans cette catégorie.");
            return currentItems;
          }
          
          toast.success("Ticket ajouté au panier !");

          // Si l'article existe déjà
          if (existingItem) {
            return currentItems.map(item => 
              item.matchId === match.id && item.categoryName === categoryName
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }

          // 3. Si l'article est nouveau...
          const newItem: CartItem = {
            matchId: match.id,
            // On s'assure que match.homeTeam et awayTeam sont des objets avant d'accéder à .name
            matchName: `${typeof match.homeTeam === 'object' ? match.homeTeam.name : match.homeTeam} vs ${typeof match.awayTeam === 'object' ? match.awayTeam.name : match.awayTeam}`,
            categoryName: categoryName,
            price: categoryDetails.price,
            quantity: 1,
            availableSeats: categoryDetails.availableSeats,
          };
        // ...on crée un nouveau tableau en copiant les anciens articles et en ajoutant le nouveau
        return [...currentItems, newItem];
        });
    };

    const updateItemQuantity = (matchId: number, categoryName: string, newQuantity: number) => {

        setCartItems(currentItems => {
          //On calcule combien de tickets pour CE match sont dans le panier, sans compter l'article que nous sommes en train de modifier.
          const otherTicketsForThisMatchInCart = currentItems
            .filter(item => item.matchId === matchId && item.categoryName !== categoryName)
            .reduce((total, item) => total + item.quantity, 0);

          //Limite globale de 6 tickets par match
          if (otherTicketsForThisMatchInCart + newQuantity > 6) {
            toast.error("Vous ne pouvez pas dépasser 6 tickets au total pour ce match.");
            return currentItems;
          }
          
          const itemToUpdate = currentItems.find(item => 
            item.matchId === matchId && item.categoryName === categoryName
          );
          if (!itemToUpdate) return currentItems;

          //Vérification du stock
          if (newQuantity > itemToUpdate.availableSeats) {
            toast.error("Quantité demandée supérieure au stock disponible.");
            return currentItems;
          }
          
          // Si la nouvelle quantité est 0 ou moins, on supprime l'article
          if (newQuantity <= 0) {
            return currentItems.filter(item => 
              !(item.matchId === matchId && item.categoryName === categoryName)
            );
          }
          
          // Sinon, on met à jour la quantité
          return currentItems.map(item =>
            item.matchId === matchId && item.categoryName === categoryName
              ? { ...item, quantity: newQuantity }
              : item
          );
    });
    };

  const removeFromCart = (matchId: number, categoryName: string) => {
    
      setCartItems(currentItems => 
        currentItems.filter(item => 
          !(item.matchId === matchId && item.categoryName === categoryName)
        )
      );
    };
    return (
      <CartContext.Provider value={{ cartItems, addToCart, updateItemQuantity, removeFromCart }}>
        {children}
      </CartContext.Provider>
    );
};



//Créer un Hook personnalisé pour utiliser le contexte plus facilement

export const useCart = () => {
  return useContext(CartContext);
};