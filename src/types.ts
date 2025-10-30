export interface Stadium {
    id : number;
    name: string;
    city: string;
    country: string;
    capacity: number;
}

export interface Group {
  id: number;
  name: string;
}

export interface Team {
    id:number;
    name:string;
    flag:string;
    flagImagePath: string;
    groupId: number;
    continent: string;
}

//Un type pour une seule catégorie de ticket
export interface TicketCategory{
    available : boolean;
    price:number;
    availableSeats: number;
}

//Un type pour l'objet qui contient toutes les catégories
export interface MatchCategories {
    VIP : TicketCategory;
    CATEGORY_1 : TicketCategory;
    CATEGORY_2 : TicketCategory;
    CATEGORY_3 : TicketCategory;


}



export interface Match {
    id : number;
    homeTeam : Team;
    awayTeam : Team;
    stadium : Stadium;
    date : string;
    availableSeats:number;
    categories?: MatchCategories;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSignupData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthDate?: string;
}

// Type pour la réponse d'authentification
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
    
  };
}

export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  birthDate: string;
}

