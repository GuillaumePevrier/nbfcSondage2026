
// This file contains actions related to players
'use server';

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Player, PlayerResponse, PlayerResponses } from '@/lib/players';

const playersFilePath = path.join(process.cwd(), 'src', 'data', 'players.json');
const responsesFilePath = path.join(process.cwd(), 'src', 'data', 'responses.json');

async function readPlayers(): Promise<Player[]> {
  try {
    const data = await fs.readFile(playersFilePath, 'utf-8');
    return JSON.parse(data) as Player[];
  } catch (error) {
    // Si le fichier n'existe pas ou est vide, retourner un tableau vide.
    // Il devrait être initialisé avec des joueurs.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Erreur lors de la lecture du fichier des joueurs:', error);
    throw new Error('Impossible de lire la liste des joueurs.');
  }
}

async function writePlayers(players: Player[]): Promise<void> {
  try {
    await fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), 'utf-8');
  } catch (error) {
    console.error("Erreur lors de l'écriture du fichier des joueurs:", error);
    throw new Error('Échec de la sauvegarde de la liste des joueurs.');
  }
}

async function readResponses(): Promise<PlayerResponses> {
  try {
    const data = await fs.readFile(responsesFilePath, 'utf-8');
    return JSON.parse(data) as PlayerResponses;
  } catch (error) {
     if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    console.error('Erreur lors de la lecture du fichier de réponses:', error);
    return {}; // Retourne un objet vide si le fichier n'existe pas ou en cas d'erreur
  }
}

async function writeResponses(responses: PlayerResponses): Promise<void> {
  try {
    await fs.writeFile(responsesFilePath, JSON.stringify(responses, null, 2), 'utf-8');
  } catch (error) {
    console.error("Erreur lors de l'écriture du fichier de réponses:", error);
    throw new Error('Échec de la sauvegarde des réponses.');
  }
}

export async function addNewPlayerAction(
  playerName: string
): Promise<{ success: boolean; error?: string; player?: Player }> {
  if (!playerName || playerName.trim().length < 3) {
    return { success: false, error: 'Le nom du joueur doit contenir au moins 3 caractères.' };
  }

  try {
    const players = await readPlayers();
    const responses = await readResponses();

    const normalizedPlayerName = playerName.trim();

    // Vérifier si le joueur existe déjà (insensible à la casse)
    if (players.some(p => p.name.toLowerCase() === normalizedPlayerName.toLowerCase())) {
      return { success: false, error: `Le joueur "${normalizedPlayerName}" existe déjà.` };
    }

    const newPlayer: Player = {
      id: uuidv4(),
      name: normalizedPlayerName,
    };

    // Ajouter aux joueurs
    players.push(newPlayer);
    await writePlayers(players);

    // Ajouter aux réponses
    if (!responses[newPlayer.name]) {
      responses[newPlayer.name] = {
        playerName: newPlayer.name,
        surveyCompleted: false, // Non répondu par défaut
      };
      await writeResponses(responses);
    }
    
    return { success: true, player: newPlayer };
  } catch (error) {
    console.error("Erreur lors de l'ajout du nouveau joueur:", error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    return { success: false, error: `Échec de l'ajout du joueur : ${errorMessage}` };
  }
}
