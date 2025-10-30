
import type { Match, Team, Group,UserCredentials, UserSignupData,  UserProfile, AuthResponse} from "../types";

export const API_BASE_URL = 'https://worldcup2026.shrp.dev';


//Fetch utilisé pour les endpoints privés

export async function authFetch<T>(endpoint: string, options: RequestInit = {}):Promise<T>{
    const token = localStorage.getItem('jwt_token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  //config : en-tetes par defaut + en-tetes données en paramètre
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }
  if (response.status === 204 ){
      return  {} as T 
  }
   
  const r = await response.json();
  console.log("API Response:", r);
  if (r.data !== undefined) {
      return r.data as T ;
    }
    
    return r as T;
}


//Fonction pour recuperer tous les match

export const getAllMatches = async (): Promise<Match[]> =>{
    const response = await fetch(`${API_BASE_URL}/matches/availability`);
    if (!response.ok){
        throw new Error('Failed to fetch Match')
    }
    const apiResponse = await response.json();
    return apiResponse.data;
}

// Fonction pour recuperer les details sur un Match

export const getMtchDetailsById = async (id : string): Promise<Match> => {

    const matchDetailsUrl = `${API_BASE_URL}/matches/${id}`;
    const availabilityUrl = `${API_BASE_URL}/matches/${id}/availability`;

    //les appels fetch sont en paralleles
    const [matchResponse, availabilityResponse] = await Promise.all([
        fetch(matchDetailsUrl),
        fetch(availabilityUrl)
    ]);

    if (!matchResponse.ok || !availabilityResponse.ok){
        throw new Error ('Impossible de récupérer toutes les informations du match..')
    }

    const matchData = await matchResponse.json();
    const availabilityData = await availabilityResponse.json();

    const basicInfo = matchData.data;
    const pricingInfo = availabilityData.data;

    //On combine les deux objet pour avoir toutes les informations dont a besoins (detail sur les equipe du match et detail sur les prix du match)
    const combinedMatchData: Match = {
    ...basicInfo, // On prend toutes les infos generales (équipes, stade...)
    categories: pricingInfo.categories, // On ajoute les catégories de tickets
    availableSeats: pricingInfo.totalAvailableSeats // Et le nombre de places
  };
  
  return combinedMatchData; 
};


export function loginUser(credentials: UserCredentials) {
  return authFetch<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
export const registerUser = (userData: UserSignupData) => {
  return authFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};
export const getMe = (): Promise<UserProfile> => {
    return authFetch<UserProfile>('/auth/me');
}
//fonction pour récupérer toutes les équipes
export const getAllTeams = async (): Promise<Team[]> => {
  
    const response = await fetch(`${API_BASE_URL}/teams`);
    if (!response.ok) throw new Error('Failed to fetch teams.');
    const data = await response.json();
    return data.data;
};

//fonction pour récupérer tous les groupes
export const getAllGroups = async (): Promise<Group[]> => {
    
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) throw new Error('Failed to fetch groups.');
    const data = await response.json();
    return data.data;
};
