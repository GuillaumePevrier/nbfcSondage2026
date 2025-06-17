"use client";

import { create } from 'zustand';
import type { SurveyResponse, Player } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface SurveyState {
  responses: SurveyResponse[];
  players: Player[];
  isLoadingPlayers: boolean;
  isLoadingResponses: boolean;
  fetchPlayers: () => Promise<void>;
  fetchResponses: () => Promise<void>;
  addResponse: (response: Omit<SurveyResponse, 'id' | 'submissionTime' | 'playerName'> & { playerName?: string }) => Promise<void>;
  getSummary: () => { pending: number; yes: number; no: number; totalPlayers: number; teams: number };
  resetResponses: () => Promise<void>;
  initStore: () => Promise<void>;
}

export const useSurveyStore = create<SurveyState>()((set, get) => ({
  responses: [],
  players: [],
  isLoadingPlayers: false,
  isLoadingResponses: false,

  fetchPlayers: async () => {
    set({ isLoadingPlayers: true });
    try {
      const { data, error } = await supabase.from('joueurs').select('id, nom');
      if (error) throw error;
      const fetchedPlayers = data.map(p => ({ id: String(p.id), name: p.nom })) || [];
      set({ players: fetchedPlayers, isLoadingPlayers: false });
    } catch (error) {
      console.error('Error fetching players:', error);
      set({ isLoadingPlayers: false, players: [] }); // Garder les joueurs locaux en fallback ou vider ?
    }
  },

  fetchResponses: async () => {
    set({ isLoadingResponses: true });
    try {
      const { data, error } = await supabase.from('survey_responses').select('*');
      if (error) throw error;
      // Assurez-vous que les IDs sont des chaînes si nécessaire et que les dates sont bien gérées
      const fetchedResponses = data.map(r => ({
        ...r,
        id: String(r.id),
        playerId: String(r.player_id),
        submissionTime: r.submission_time,
      })) || [];
      set({ responses: fetchedResponses, isLoadingResponses: false });
    } catch (error) {
      console.error('Error fetching responses:', error);
      set({ isLoadingResponses: false });
    }
  },

  addResponse: async (responseInput) => {
    const player = get().players.find(p => p.id === responseInput.playerId);
    if (!player) {
      console.error("Player not found for response:", responseInput.playerId);
      // Gérer l'erreur, peut-être avec un toast
      return;
    }

    const newResponse = {
      player_id: responseInput.playerId,
      player_name: player.name, // Utiliser le nom du joueur trouvé
      participating: responseInput.participating,
      submission_time: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .insert([newResponse])
        .select()
        .single(); // S'attendre à un seul enregistrement retourné

      if (error) throw error;

      if (data) {
         const addedResponse: SurveyResponse = {
          id: String(data.id),
          playerId: String(data.player_id),
          playerName: data.player_name,
          participating: data.participating,
          submissionTime: data.submission_time,
        };
        set((state) => ({
          responses: [...state.responses.filter(r => r.playerId !== addedResponse.playerId), addedResponse],
        }));
      }
    } catch (error) {
      console.error('Error adding response:', error);
      // Gérer l'erreur, peut-être avec un toast
    }
  },

  getSummary: () => {
    const state = get();
    const totalPlayers = state.players.length;
    const yesCount = state.responses.filter(r => r.participating).length;
    const noCount = state.responses.filter(r => !r.participating).length;
    
    // Calculer les réponses uniques par joueur pour 'respondedCount'
    const respondedPlayerIds = new Set(state.responses.map(r => r.playerId));
    const respondedCount = respondedPlayerIds.size;

    const pendingCount = totalPlayers - respondedCount;
    const teams = Math.floor(yesCount / 10); // Supposant 10 joueurs par équipe

    return {
      pending: pendingCount < 0 ? 0 : pendingCount,
      yes: yesCount,
      no: noCount,
      totalPlayers,
      teams,
    };
  },

  resetResponses: async () => {
    try {
      const { error } = await supabase.from('survey_responses').delete().neq('id', '0'); // Supprime toutes les lignes
      if (error) throw error;
      set({ responses: [] });
    } catch (error) {
      console.error('Error resetting responses:', error);
    }
  },
  
  initStore: async () => {
    await get().fetchPlayers();
    await get().fetchResponses();
  },
}));

// Initialiser le store au chargement de l'application (côté client)
if (typeof window !== 'undefined') {
  useSurveyStore.getState().initStore();
}
