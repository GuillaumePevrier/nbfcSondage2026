// src/ai/flows/motivational-message.ts
'use server';

/**
 * @fileOverview An AI agent that generates a personalized motivational message based on the player's survey response.
 *
 * - generateMotivationalMessage - A function that generates a motivational message for a player based on their response.
 * - MotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
  playerName: z.string().describe('The name of the player.'),
  willContinue: z.boolean().describe('Whether the player will continue next season (true) or not (false).'),
});

export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('The personalized motivational message for the player.'),
});

export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(input: MotivationalMessageInput): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are a motivational coach for a Futsal team. Generate a personalized motivational message for the player, {{{playerName}}}, based on their decision to continue playing next season or not.

If the player is continuing ({{{willContinue}}} is true), encourage them to keep up the good work and strive for excellence.

If the player is not continuing ({{{willContinue}}} is false), thank them for their contributions to the team and wish them well in their future endeavors.

Keep the message brief and positive.`,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
