export interface Player {
  id: string;
  name: string;
}

export interface SurveyResponse {
  id: string; // Unique ID for the response
  playerId: string;
  playerName: string;
  participating: boolean;
  submissionTime: string; // ISO date string
}

export interface SurveySummary {
  pending: number;
  yes: number;
  no: number;
  totalPlayers: number;
  teams: number;
}
