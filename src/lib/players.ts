
import fs from 'fs/promises';
import path from 'path';

export interface Player {
  id: string;
  name: string;
}

const playersFilePath = path.join(process.cwd(), 'src', 'data', 'players.json');

export async function getAllPlayers(): Promise<Player[]> {
  try {
    const data = await fs.readFile(playersFilePath, 'utf-8');
    const players = JSON.parse(data) as Player[];
    return players.sort((a, b) => a.name.localeCompare(b.name)); // Tri par nom
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier des joueurs:', error);
    // S'il y a une erreur (ex: fichier non trouvé au premier lancement), retourner un tableau vide.
    // Il est important que le fichier players.json existe avec un contenu JSON valide (ex: "[]").
    return [];
  }
}

export type SurveyFormData = {
  playerName: string;
  willContinue: boolean | undefined;
};

export type PlayerResponse = {
  playerName: string;
  continues?: boolean;
  surveyCompleted: boolean;
  timestamp?: string;
  motivationalMessage?: string;
};

export type PlayerResponses = Record<string, PlayerResponse>;
