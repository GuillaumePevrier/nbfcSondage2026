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
    // If file doesn't exist or is invalid, return empty object
    console.error('Error reading responses file:', error);
    return {};
  }
}

async function writeResponses(responses: PlayerResponses): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(responses, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing responses file:', error);
    throw new Error('Failed to save responses.');
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
    console.error('Error generating motivational message:', error);
    return "Keep pushing your limits and striving for greatness. Your dedication is inspiring!";
  }
}

export async function finalizeSurveyAction(
  formData: SurveyFormData,
  motivationalMessage: string
): Promise<{ success: boolean; error?: string; data?: PlayerResponse }> {
  if (!formData.playerName || formData.willContinue === undefined) {
    return { success: false, error: 'Player name and decision are required.' };
  }

  try {
    const responses = await readResponses();
    const now = new Date().toISOString();

    const updatedResponse: PlayerResponse = {
      ...responses[formData.playerName], // Preserve any existing data
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
    console.error('Error finalizing survey:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to save survey: ${errorMessage}` };
  }
}
