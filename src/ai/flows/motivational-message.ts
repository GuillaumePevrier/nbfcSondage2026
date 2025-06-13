'use server';

/**
 * @fileOverview Un agent IA qui génère un message de motivation personnalisé basé sur la réponse du joueur au sondage.
 *
 * - generateMotivationalMessage - Une fonction qui génère un message de motivation pour un joueur en fonction de sa réponse.
 * - MotivationalMessageInput - Le type d'entrée pour la fonction generateMotivationalMessage.
 * - MotivationalMessageOutput - Le type de retour pour la fonction generateMotivationalMessage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
  playerName: z.string().describe('Le nom du joueur.'),
  willContinue: z.boolean().describe('Indique si le joueur continuera la saison prochaine (true) ou non (false).'),
});

export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('Le message de motivation personnalisé pour le joueur, en français.'),
});

export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(input: MotivationalMessageInput): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `Vous êtes un coach motivateur pour une équipe de Futsal. Générez un message de motivation personnalisé et encourageant EN FRANÇAIS pour le joueur nommé {{{playerName}}}.
Ce message doit être basé sur sa décision de continuer à jouer la saison prochaine ou non.

Si le joueur continue (la valeur de {{{willContinue}}} est true), encouragez-le pour son engagement, son esprit d'équipe et à viser l'excellence pour la saison à venir. Adaptez le message pour qu'il soit positif et inspirant.
Exemple si true: "Fantastique nouvelle, {{{playerName}}} ! Ton énergie et ton talent sont précieux pour l'équipe. Prépare-toi pour une saison exceptionnelle où nous allons tout donner ensemble !"

Si le joueur ne continue pas (la valeur de {{{willContinue}}} est false), remerciez-le sincèrement pour ses contributions passées à l'équipe, son esprit sportif, et souhaitez-lui bonne chance dans ses futurs projets, que ce soit dans le futsal ou ailleurs. Le ton doit rester positif et respectueux.
Exemple si false: "Merci pour tout ce que tu as apporté à l'équipe, {{{playerName}}}. Ton esprit combatif a été une source d'inspiration. Nous te souhaitons le meilleur pour tes futurs défis, sur et en dehors des terrains !"

Le message doit être concis, chaleureux et spécifiquement adapté à la situation (continuation ou départ).`,
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
