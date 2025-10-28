//on va créer le contexte du panier ici

import {createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Match, TicketCategory } from '../types';


//cle pour le local storage
const CART_STORAGE_KEY = 'worldcup_cart';

//forme des articles dans le panier
export interface CartItem{
    matchId: number;
    matchName: string;
    categoryName: string;
    price:number;
    quantity:number;
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

    const addToCart = (match: Match, categoryName: string, categoryDetails: TicketCategory)=>{
      
      //ici on a utilise la "forme fonctionnelle" de setState. C'est la manière la plus sûre
      //de mettre à jour un état qui dépend de sa valeur précédente.

      setCartItems(currentItems =>{
          //1 -On cherche si l'article existe déjà dans le panier
          const existingItem = currentItems.find(item =>
            item.matchId===match.id && item.categoryName === categoryName
          );
           
          //2 - Si l'article existe déjà...
          if (existingItem) {
            // ...on crée un NOUVEAU tableau en parcourant l'ancien avec .map()
            return currentItems.map(item =>
              item.matchId === match.id && item.categoryName === categoryName
                ?{ ...item, quantity: item.quantity + 1 } // Si c'est notre article, on crée un NOUVEL objet avec la quantité + 1

                : item // Sinon, on ne change pas l'article
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
          };
        // ...on crée un NOUVEAU tableau en copiant les anciens articles et en ajoutant le nouveau
        return [...currentItems, newItem];
        });
    };

    const updateItemQuantity = (matchId: number, categoryName: string, newQuantity: number)=>{

      setCartItems(currentItems =>{
        if (newQuantity <=0) {
        //si la nouvelle quantite est 0 ou moins, on supprime l'article, on utilise .filter() pour créer un nouveau tableau sans l'article à supprimer
        return currentItems.filter(item => ! (item.matchId === matchId && item.categoryName === categoryName));
      }

      // Sinon, on met à jour la quantité de l'article concerné
      return currentItems.map(item =>
        item.matchId === matchId && item.categoryName === categoryName
          ? { ...item, quantity: newQuantity }
          : item
      );
      }) 
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