
import { db } from './firebase';
import { collection, doc, addDoc, getDoc, getDocs, query, where, limit, writeBatch } from 'firebase/firestore';

export interface Player {
  id: string; // Firestore document ID
  name: string;
}

export async function getAllPlayers(): Promise<Player[]> {
  try {
    const playersCollectionRef = collection(db, 'players');
    const q = query(playersCollectionRef);
    const querySnapshot = await getDocs(q);
    const players: Player[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { name: string }),
    }));
    return players.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs depuis Firestore:', error);
    return [];
  }
}

export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const playerDocRef = doc(db, 'players', id);
    const playerSnap = await getDoc(playerDocRef);
    if (playerSnap.exists()) {
      return { id: playerSnap.id, name: playerSnap.data().name } as Player;
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du joueur ${id}:`, error);
    return null;
  }
}


export async function getPlayerByName(name: string): Promise<Player | null> {
  try {
    const playersCollectionRef = collection(db, 'players');
    const q = query(playersCollectionRef, where('name', '==', name), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      return { id: playerDoc.id, name: playerDoc.data().name } as Player;
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la recherche du joueur par nom "${name}":`, error);
    return null;
  }
}

export async function addPlayer(name: string): Promise<Player> {
  try {
    const playersCollectionRef = collection(db, 'players');
    // Firestore will auto-generate an ID
    const newPlayerDocRef = await addDoc(playersCollectionRef, { name });
    return { id: newPlayerDocRef.id, name };
  } catch (error) {
    console.error(`Erreur lors de l'ajout du joueur "${name}" à Firestore:`, error);
    throw error;
  }
}

// Types related to survey responses, kept here for now as they are tightly coupled with player data
// but could be moved to survey.ts if preferred.

// Represents the raw data for a survey response (what's stored in Firestore 'responses' collection)
export interface SurveyDBData {
  playerName: string; // Denormalized player name
  continues?: boolean;
  surveyCompleted: boolean;
  timestamp?: string; // ISO string
  motivationalMessage?: string;
}

// Represents data input by the user in the survey form
export type SurveyFormData = {
  playerName: string; // Used to find player ID
  willContinue: boolean;
};

// Represents a player's complete response details, often combined with Player info
export interface PlayerFullSurveyData extends Player, SurveyDBData {
  // id and name come from Player
  // other fields from SurveyDBData
  // playerId is implicit as doc id in 'responses' or Player.id
}
