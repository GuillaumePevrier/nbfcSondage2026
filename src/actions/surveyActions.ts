'use server';

import fs from 'fs/promises';
import path from 'path';
import type { PlayerResponse, PlayerResponses, SurveyFormData } from '@/lib/players';
import { generateMotivationalMessage } from '@/ai/flows/motivational-message';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'responses.json');

async function readResponses(): Promise<PlayerResponses> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data) as PlayerResponses;
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier de réponses:', error);
    return {};
  }
}

async function writeResponses(responses: PlayerResponses): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(responses, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier de réponses:', error);
    throw new Error('Échec de la sauvegarde des réponses.');
  }
}

export async function getPlayerResponses(): Promise<PlayerResponses> {
  return await readResponses();
}

export async function getAIMotivationalMessageAction(playerName: string, willContinue: boolean): Promise<string> {
  try {
    const result = await generateMotivationalMessage({ playerName, willContinue });
    return result.message;
  } catch (error) {
    console.error('Erreur lors de la génération du message de motivation:', error);
    return "Continuez à repousser vos limites et à viser l'excellence. Votre dévouement est une source d'inspiration !";
  }
}

export async function finalizeSurveyAction(
  formData: SurveyFormData,
  motivationalMessage: string
): Promise<{ success: boolean; error?: string; data?: PlayerResponse }> {
  if (!formData.playerName || formData.willContinue === undefined) {
    return { success: false, error: 'Le nom du joueur et sa décision sont requis.' };
  }

  try {
    const responses = await readResponses();
    const now = new Date().toISOString();

    const updatedResponse: PlayerResponse = {
      ...responses[formData.playerName], 
      playerName: formData.playerName,
      continues: formData.willContinue,
      surveyCompleted: true,
      timestamp: now,
      motivationalMessage: motivationalMessage,
    };
    
    responses[formData.playerName] = updatedResponse;

    await writeResponses(responses);
    
    return { success: true, data: updatedResponse };
  } catch (error) {
    console.error('Erreur lors de la finalisation du sondage:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    return { success: false, error: `Échec de la sauvegarde du sondage : ${errorMessage}` };
  }
}
