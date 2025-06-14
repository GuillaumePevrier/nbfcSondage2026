
'use server';

import { getAllPlayers, getPlayerByName, type Player, type SurveyDBData, type PlayerFullSurveyData } from '@/lib/players';
import { saveSurveyRecord, getAllSurveyRecords, getSurveyRecordByPlayerId } from '@/lib/survey';
import { generateMotivationalMessage, type MotivationalMessageInput } from '@/ai/flows/motivational-message';

// This interface will be used for displaying combined player and survey data in the UI
export interface PlayerSurveyDisplayData extends Player {
  surveyCompleted: boolean;
  continues?: boolean;
  timestamp?: string;
  motivationalMessage?: string;
}

export async function getPlayersAndSurveyData(): Promise<PlayerSurveyDisplayData[]> {
  try {
    const allPlayers = await getAllPlayers();
    const allSurveyRecords = await getAllSurveyRecords(); // Fetches as Record<string, SurveyRecord>

    const combinedData: PlayerSurveyDisplayData[] = allPlayers.map(player => {
      const surveyRecord = allSurveyRecords[player.id];
      return {
        id: player.id,
        name: player.name,
        surveyCompleted: surveyRecord?.surveyCompleted || false,
        continues: surveyRecord?.continues,
        timestamp: surveyRecord?.timestamp,
        motivationalMessage: surveyRecord?.motivationalMessage,
      };
    });
    return combinedData;
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs et de leurs données de sondage:', error);
    return [];
  }
}


export async function getAIMotivationalMessageAction(playerName: string, willContinue: boolean): Promise<string> {
  try {
    const input: MotivationalMessageInput = { playerName, willContinue };
    const result = await generateMotivationalMessage(input);
    return result.message;
  } catch (error) {
    console.error('Erreur lors de la génération du message de motivation:', error);
    return "Continuez à repousser vos limites et à viser l'excellence. Votre dévouement est une source d'inspiration !"; // Fallback message
  }
}

export async function finalizeSurveyAction(
  formData: { playerName: string; willContinue: boolean },
  motivationalMessage: string
): Promise<{ success: boolean; error?: string; data?: PlayerFullSurveyData }> {
  if (!formData.playerName || formData.willContinue === undefined) {
    return { success: false, error: 'Le nom du joueur et sa décision sont requis.' };
  }

  try {
    const player = await getPlayerByName(formData.playerName);
    if (!player) {
      return { success: false, error: `Joueur "${formData.playerName}" non trouvé.` };
    }

    const surveyDataToSave: SurveyDBData = {
      playerName: player.name, // Denormalized name
      continues: formData.willContinue,
      surveyCompleted: true,
      timestamp: new Date().toISOString(),
      motivationalMessage: motivationalMessage,
    };

    await saveSurveyRecord(player.id, surveyDataToSave);
    
    const finalizedData: PlayerFullSurveyData = {
        ...player,
        ...surveyDataToSave
    }

    return { success: true, data: finalizedData };
  } catch (error) {
    console.error('Erreur lors de la finalisation du sondage (Firestore):', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    return { success: false, error: `Échec de la sauvegarde du sondage : ${errorMessage}` };
  }
}
