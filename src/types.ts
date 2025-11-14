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
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  matchId: number;
  category: "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3" | "VIP";
  price: number;
  status: "pending_payment" | "used" | "confirmed";
  seatNumber: string;
  qrCode: string;
  expiresAt: string;    
  paymentDate: string;  
  validatedAt: string; 
  match: TicketMatchInfo;
}


export interface TicketMatchInfo {
  id: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: string; 
  stadium: string;
}


export interface AddToCartData {
  tickets: Ticket[];
  totalPrice: number;
  expiresAt: string; 
}


export interface AddToCartApiResponse {
  success: boolean;
  message: string;
  data: AddToCartData;
}
export interface AddTicketPayload {
  matchId: number;
  category: string;
  quantity: number;
}
export interface GroupedTickets {
  pending: Ticket[];
  confirmed: Ticket[];
  used: Ticket[];
}


export interface TicketCounts {
  total: number;
  pending: number;
  confirmed: number;
  used: number;
}


export interface MyTicketsData {
  tickets: Ticket[];
  grouped: GroupedTickets;
  counts: TicketCounts;
}
