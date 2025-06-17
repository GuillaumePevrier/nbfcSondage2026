"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SurveyResponse, Player } from '@/types';
import { players as defaultPlayers } from '@/data/players';

interface SurveyState {
  responses: SurveyResponse[];
  players: Player[];
  addResponse: (response: SurveyResponse) => void;
  getSummary: () => { pending: number; yes: number; no: number; totalPlayers: number; teams: number };
  resetResponses: () => void; 
}

const getInitialPlayers = (): Player[] => {
  if (typeof window !== 'undefined') {
    const storedPlayers = localStorage.getItem('futsal-players');
    if (storedPlayers) {
      try {
        const parsedPlayers = JSON.parse(storedPlayers);
        if (Array.isArray(parsedPlayers) && parsedPlayers.length > 0) {
          return parsedPlayers;
        }
      } catch (e) {
        console.error("Failed to parse players from localStorage", e);
      }
    }
  }
  return defaultPlayers;
};


export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      responses: [],
      players: getInitialPlayers(),
      addResponse: (response) =>
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
          state.players = getInitialPlayers(); // Ensure players are re-initialized on rehydration
        }
      }
    }
  )
);
