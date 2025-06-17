export interface Player {
  id: string; // Sera l'ID venant de Supabase (peut être un nombre ou un UUID stringifié)
  name: string;
}

export interface SurveyResponse {
  id: string; // ID de la réponse, venant de Supabase
  playerId: string; // ID du joueur, FK vers la table joueurs
  playerName: string; // Nom du joueur (dénormalisé pour affichage facile)
  participating: boolean;
  submissionTime: string; // ISO date string (TIMESTAMPTZ de Supabase)
}

export interface SurveySummary {
  pending: number;
  yes: number;
  no: number;
  totalPlayers: number;
  teams: number;
}
