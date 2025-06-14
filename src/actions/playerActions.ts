
'use server';

import { addPlayer, getPlayerByName, type Player } from '@/lib/players';
import { saveSurveyRecord } from '@/lib/survey';

export async function addNewPlayerAction(
  playerName: string
): Promise<{ success: boolean; error?: string; player?: Player }> {
  if (!playerName || playerName.trim().length < 3) {
    return { success: false, error: 'Le nom du joueur doit contenir au moins 3 caractères.' };
  }

  const normalizedPlayerName = playerName.trim();

  try {
    const existingPlayer = await getPlayerByName(normalizedPlayerName);
    if (existingPlayer) {
      return { success: false, error: `Le joueur "${normalizedPlayerName}" existe déjà.` };
    }

    // Add player to 'players' collection
    const newPlayer = await addPlayer(normalizedPlayerName);

    // Create an initial (incomplete) survey response for the new player in 'responses' collection
    await saveSurveyRecord(newPlayer.id, {
      playerName: newPlayer.name, // Denormalized name
      surveyCompleted: false,
      // Other fields like 'continues', 'timestamp', 'motivationalMessage' will be undefined or set later
    });

    return { success: true, player: newPlayer };
  } catch (error) {
    console.error("Erreur lors de l'ajout du nouveau joueur via Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    return { success: false, error: `Échec de l'ajout du joueur : ${errorMessage}` };
  }
}
