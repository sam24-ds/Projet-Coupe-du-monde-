import {createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { Match, TicketCategory } from '../types';
import toast from 'react-hot-toast';

const CART_STORAGE_KEY = 'worldcup_cart';

export interface CartItem{
    matchId: number;
    matchName: string;
    categoryName: string;
    price:number;
    quantity:number;
    availableSeats: number;
}

export interface ICartContext {
    cartItems: CartItem[];
    addToCart: (match: Match, categoryName: string, categoryDetails: TicketCategory)=>void;
    updateItemQuantity : (matchId: number, categoryName: string, newQuantity: number) => void;
    removeFromCart: (matchId: number, categoryName: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<ICartContext>({
    cartItems: [],
    addToCart: ()=>{},
    updateItemQuantity: () => {}, 
    removeFromCart: () => {},
    clearCart: () => {},
});

export const CartProvider = ({children}: {children:ReactNode})=>{
  const [cartItems, setCartItems] = useState<CartItem[]>(()=>{
      try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (match: Match, categoryName: string, categoryDetails: TicketCategory) => {
    
    setCartItems(currentItems => {
      const ticketsForThisMatchInCart = currentItems
        .filter(item => item.matchId === match.id)
        .reduce((total, item) => total + item.quantity, 0);

      if (ticketsForThisMatchInCart >= 6) {
        // CORRECTION: toast APRÈS le setState, pas pendant
        setTimeout(() => toast.error("Vous ne pouvez pas ajouter plus de 6 tickets par match."), 0);
        return currentItems;
      }
      
      const existingItem = currentItems.find(item => 
        item.matchId === match.id && item.categoryName === categoryName
      );

      const currentQuantityForItem = existingItem ? existingItem.quantity : 0;
      if (currentQuantityForItem + 1 > categoryDetails.availableSeats) {
        setTimeout(() => toast.error("Il n'y a pas assez de places disponibles dans cette catégorie."), 0);
        return currentItems;
      }
      
      setTimeout(() => toast.success("Ticket ajouté au panier !"), 0);

      if (existingItem) {
        return currentItems.map(item => 
          item.matchId === match.id && item.categoryName === categoryName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const newItem: CartItem = {
        matchId: match.id,
        matchName: `${typeof match.homeTeam === 'object' ? match.homeTeam.name : match.homeTeam} vs ${typeof match.awayTeam === 'object' ? match.awayTeam.name : match.awayTeam}`,
        categoryName: categoryName,
        price: categoryDetails.price,
        quantity: 1,
        availableSeats: categoryDetails.availableSeats,
      };
      return [...currentItems, newItem];
    });
  };

  const updateItemQuantity = (matchId: number, categoryName: string, newQuantity: number) => {
    setCartItems(currentItems => {
      const otherTicketsForThisMatchInCart = currentItems
        .filter(item => item.matchId === matchId && item.categoryName !== categoryName)
        .reduce((total, item) => total + item.quantity, 0);

      if (otherTicketsForThisMatchInCart + newQuantity > 6) {
        setTimeout(() => toast.error("Vous ne pouvez pas dépasser 6 tickets au total pour ce match."), 0);
        return currentItems;
      }
      
      const itemToUpdate = currentItems.find(item => 
        item.matchId === matchId && item.categoryName === categoryName
      );
      if (!itemToUpdate) return currentItems;

      if (newQuantity > itemToUpdate.availableSeats) {
        setTimeout(() => toast.error("Quantité demandée supérieure au stock disponible."), 0);
        return currentItems;
      }
      
      if (newQuantity <= 0) {
        return currentItems.filter(item => 
          !(item.matchId === matchId && item.categoryName === categoryName)
        );
      }
      
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

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateItemQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};