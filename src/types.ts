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
export interface UserSignupData extends UserCredentials {
  firstname: string;
  lastname: string;
  birthDate: string;
}
export interface AuthResponse {
  user: UserProfile;
  access_token: string;
}
export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  birthDate: string;
}

