
'use server';

/**
 * @fileOverview Generates an audio summary of the futsal team survey results.
 *
 * - summarizeSurveyResults - A function that generates an audio summary of the survey results.
 * - SummarizeSurveyResultsInput - The input type for the summarizeSurveyResults function.
 * - SummarizeSurveyResultsOutput - The return type for the summarizeSurveyResults function, containing the audio data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSurveyResultsInputSchema = z.object({
  yes: z.number().describe("Number of players who responded 'Yes'"),
  no: z.number().describe("Number of players who responded 'No'"),
  pending: z.number().describe("Number of players pending response"),
  totalPlayers: z.number().describe("Total number of players in the team"),
  teams: z.number().describe("Number of teams that can be formed based on 'Yes' responses"),
});
export type SummarizeSurveyResultsInput = z.infer<typeof SummarizeSurveyResultsInputSchema>;

const SummarizeSurveyResultsOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio summary of the survey results, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type SummarizeSurveyResultsOutput = z.infer<typeof SummarizeSurveyResultsOutputSchema>;

export async function summarizeSurveyResults(
  input: SummarizeSurveyResultsInput
): Promise<SummarizeSurveyResultsOutput> {
  return summarizeSurveyResultsFlow(input);
}

// This prompt object definition is good for documentation and potential direct use,
// but the flow below currently constructs its own prompt string for ai.generate.
const summarizeSurveyResultsGenkitPrompt = ai.definePrompt({
  name: 'summarizeSurveyResultsGenkitPrompt',
  input: {schema: SummarizeSurveyResultsInputSchema},
  output: {schema: SummarizeSurveyResultsOutputSchema},
  prompt: `Generate an audio summary of the futsal team survey results.
Current situation:
- Players who said 'Yes': {{{yes}}}
- Players who said 'No': {{{no}}}
- Players pending response: {{{pending}}}
- Total players: {{{totalPlayers}}}
- Potential teams: {{{teams}}}

The audio should be short, clear, and suitable for a team manager to quickly understand the team's availability.
If there are no players or no responses, the summary should state that clearly.
Output the audio as a data URI.
  `,
});

const summarizeSurveyResultsFlow = ai.defineFlow(
  {
    name: 'summarizeSurveyResultsFlow',
    inputSchema: SummarizeSurveyResultsInputSchema,
    outputSchema: SummarizeSurveyResultsOutputSchema,
  },
  async (input: SummarizeSurveyResultsInput) => {
    let promptText = `Generate a concise audio summary of the futsal team survey results. `;
    if (input.totalPlayers === 0) {
      promptText += `Currently, there are no players registered in the system. `;
    } else if (input.yes === 0 && input.no === 0 && input.pending === input.totalPlayers) {
      promptText += `No survey responses have been recorded yet. All ${input.totalPlayers} players are pending. `;
    } else {
      promptText += `Out of ${input.totalPlayers} players, ${input.yes} responded 'Yes' to participating next season, and ${input.no} responded 'No'. There are ${input.pending} players still pending a response. Based on the 'Yes' responses, ${input.teams} team(s) can potentially be formed. `;
    }
    promptText += `The final result must be returned as a data URI with proper MIME type for direct playback.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // This model is specified for media generation
      prompt: promptText,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // Per guidance, both TEXT and IMAGE needed for media
      },
    });

    return {audioDataUri: media.url};
  }
);

