import type { Match, Team, Group } from "../types";

export const API_BASE_URL = 'https://worldcup2026.shrp.dev';

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