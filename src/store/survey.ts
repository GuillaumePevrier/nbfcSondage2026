"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SurveyResponse, Player } from '/home/user/studio/src/types/index.ts';
import playersData from '@/data/players.json';

interface SurveyState {
  responses: SurveyResponse[];
  players: Player[];
  addResponse: (response: SurveyResponse) => void;
  getSummary: () => { pending: number; yes: number; no: number; totalPlayers: number; teams: number };
  resetResponses: () => void; 
}

// Map players from JSON data, ensuring each has an 'id'
const initialPlayersFromJSON: Player[] = playersData.map((player: { nom: string }) => ({
  id: crypto.randomUUID(), // Generate a unique ID for each player from JSON
  name: player.nom,
}));

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      responses: [],
      players: initialPlayersFromJSON, // Use players directly from JSON
      addResponse: (response) => // Ensure response also includes playerName from the form logic
        set((state) => {
          // Remove existing response for the player, if any
          const otherResponses = state.responses.filter(r => r.playerId !== response.playerId);
          return { responses: [...otherResponses, response] };
        }),
      getSummary: () => {
        const state = get();
        const totalPlayers = state.players.length;
        const yesCount = state.responses.filter(r => r.participating).length;
        const noCount = state.responses.filter(r => !r.participating).length;
        const respondedCount = state.responses.length;
        const pendingCount = totalPlayers - respondedCount;
        const teams = Math.floor(yesCount / 10);
        return {
          pending: pendingCount < 0 ? 0 : pendingCount, // Ensure pending is not negative
          yes: yesCount,
          no: noCount,
          totalPlayers,
          teams,
        };
      },
      resetResponses: () => set({ responses: [] }),
    }),
    {
      name: 'futsal-survey-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ responses: state.responses }), // Only persist responses
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.players = initialPlayersFromJSON; // Always load players from JSON on rehydration
        }
      }
    }
  )
);
