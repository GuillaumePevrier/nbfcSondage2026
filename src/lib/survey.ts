
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import type { SurveyDBData } from './players'; // Using SurveyDBData from players.ts

// Represents the data structure in the 'responses' collection in Firestore.
// The document ID in this collection will be the Player's ID.
export interface SurveyRecord extends SurveyDBData {
  // All fields from SurveyDBData are relevant.
  // playerId is the document ID itself.
}

export async function getAllSurveyRecords(): Promise<Record<string, SurveyRecord>> {
  try {
    const responsesCollectionRef = collection(db, 'responses');
    const querySnapshot = await getDocs(responsesCollectionRef);
    const records: Record<string, SurveyRecord> = {};
    querySnapshot.forEach(docSnapshot => {
      records[docSnapshot.id] = docSnapshot.data() as SurveyRecord;
    });
    return records;
  } catch (error) {
    console.error('Error fetching all survey records from Firestore:', error);
    return {};
  }
}

export async function getSurveyRecordByPlayerId(playerId: string): Promise<SurveyRecord | null> {
  try {
    const responseDocRef = doc(db, 'responses', playerId);
    const docSnap = await getDoc(responseDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as SurveyRecord;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching survey record for player ${playerId}:`, error);
    return null;
  }
}

export async function saveSurveyRecord(playerId: string, data: SurveyDBData): Promise<void> {
  try {
    if (!playerId) throw new Error("Player ID is required to save survey record.");
    const responseDocRef = doc(db, 'responses', playerId);
    // Ensure all fields intended for Firestore are included.
    // 'playerName' is part of SurveyDBData and should be passed in `data`.
    await setDoc(responseDocRef, data, { merge: true });
  } catch (error) {
    console.error(`Error saving survey record for player ${playerId}:`, error);
    throw error; // Re-throw to be caught by the action
  }
}
