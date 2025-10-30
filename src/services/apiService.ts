
import type { Match, Team, Group, UserCredentials, UserSignupData, UserProfile, AuthResponse } from "../types";

// NOTE : on utilise le proxy /api pour dev
export const API_BASE_URL = '/api';

interface AddTicketPayload {
  matchId: number;
  category: string;
  quantity: number;
}

// Fetch avec cookies (pour toutes les requêtes authentifiées)
async function cookieFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Envoie automatiquement les cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }

  return response.status === 204 ? ({} as T) : await response.json();
}

// === MATCHS (publics) ===

export const getAllMatches = async (): Promise<Match[]> => {
  const response = await fetch(`${API_BASE_URL}/matches/availability`);
  if (!response.ok) throw new Error('Failed to fetch Match');
  const apiResponse = await response.json();
  return apiResponse.data;
};

export const getMatchDetailsById = async (id: string): Promise<Match> => {  
  const [matchResponse, availabilityResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/matches/${id}`),
    fetch(`${API_BASE_URL}/matches/${id}/availability`)
  ]);

  if (!matchResponse.ok || !availabilityResponse.ok) {
    throw new Error('Impossible de récupérer toutes les informations du match..');
  }

  const matchData = await matchResponse.json();
  const availabilityData = await availabilityResponse.json();

  return {
    ...matchData.data,
    categories: availabilityData.data.categories,
    availableSeats: availabilityData.data.totalAvailableSeats
  };
};

//AUTHENTIFICATION

export function loginUser(credentials: UserCredentials) {
  return cookieFetch<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export const registerUser = (userData: UserSignupData) => {
  return cookieFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getMe = (): Promise<UserProfile> => {
  return cookieFetch<UserProfile>("/auth/me");
};

export const logoutUser = () => {
  return cookieFetch("/auth/signout", { method: "POST" });
};

// === ÉQUIPES ET GROUPES ===

export const getAllTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) throw new Error('Failed to fetch teams.');
  return (await response.json()).data;
};

export const getAllGroups = async (): Promise<Group[]> => {
  const response = await fetch(`${API_BASE_URL}/groups`);
  if (!response.ok) throw new Error('Failed to fetch groups.');
  return (await response.json()).data;
};

//TICKETS ET RÉSERVATIONS

export const addTicketToBooking = (payload: AddTicketPayload) => {
  return cookieFetch("/tickets", { method: "POST", body: JSON.stringify(payload) });
};

export const payPendingTickets = () => cookieFetch("/tickets/pay-pending", { method: "POST" });
export const getMyTickets = () => cookieFetch("/tickets");
export const getPendingTickets = () => cookieFetch("/tickets/pending");
export const removeTicketFromBooking = (ticketId: string) =>
  cookieFetch(`/tickets/${ticketId}`, { method: "DELETE" });
