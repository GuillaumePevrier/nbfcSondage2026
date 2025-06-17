'use server';

/**
 * @fileOverview Generates an audio summary of the futsal team survey results.
 *
 * - summarizeSurveyResults - A function that generates an audio summary of the survey results.
 * - SummarizeSurveyResultsInput - The input type for the summarizeSurveyResults function. Currently empty.
 * - SummarizeSurveyResultsOutput - The return type for the summarizeSurveyResults function, containing the audio data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSurveyResultsInputSchema = z.object({});
export type SummarizeSurveyResultsInput = z.infer<typeof SummarizeSurveyResultsInputSchema>;

const SummarizeSurveyResultsOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'An audio summary of the survey results, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type SummarizeSurveyResultsOutput = z.infer<typeof SummarizeSurveyResultsOutputSchema>;

export async function summarizeSurveyResults(
  input: SummarizeSurveyResultsInput
): Promise<SummarizeSurveyResultsOutput> {
  return summarizeSurveyResultsFlow(input);
}

const summarizeSurveyResultsPrompt = ai.definePrompt({
  name: 'summarizeSurveyResultsPrompt',
  input: {schema: SummarizeSurveyResultsInputSchema},
  output: {schema: SummarizeSurveyResultsOutputSchema},
  prompt: `Generate an audio summary of the futsal team survey results.  The survey results indicate the number of players available for the next season. The audio should be short, clear, and suitable for a team manager to quickly understand the team's availability.

  Output the audio as a data URI, so that it can be played directly in the application.
  `,
});

const summarizeSurveyResultsFlow = ai.defineFlow(
  {
    name: 'summarizeSurveyResultsFlow',
    inputSchema: SummarizeSurveyResultsInputSchema,
    outputSchema: SummarizeSurveyResultsOutputSchema,
  },
  async input => {
    // Since Gemini 2.0 Flash experimental image generation is the only model able to generate media,
    // using that model for audio generation by configuring responseModalities
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: `Generate an audio summary of the futsal team survey results.  The survey results indicate the number of players available for the next season. The audio should be short, clear, and suitable for a team manager to quickly understand the team's availability. The summary should emphasize the number of players who responded 'Yes' and the number who responded 'No'. Also include the total number of teams that can be formed with the available players. The final result must be returned as a data URI with proper MIME type.`, // Modified prompt here
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {audioDataUri: media.url};
  }
);
