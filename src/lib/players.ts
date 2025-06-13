
export interface Player {
  id: string;
  name: string;
}

export const players: Player[] = [
  { id: '1', name: 'Rom Savatte' },
  { id: '2', name: 'Vincent Poilvet' },
  { id: '3', name: 'Drd Julien' },
  { id: '4', name: 'Germain Mqn' },
  { id: '5', name: 'Jérémy Aubert' },
  { id: '6', name: 'Nicolas Beillard' },
  { id: '7', name: 'Dimitri Hudin' },
  { id: '8', name: 'Yann Uvy' },
  { id: '9', name: 'Yoann Poulain' },
  { id: '10', name: 'Léo Briantais' },
  { id: '11', name: 'Mathieu Lefevre' },
  { id: '12', name: 'David Moreau' },
  { id: '13', name: 'Julien Girard' },
  { id: '14', name: 'Alexandre Petit' },
  { id: '15', name: 'Thomas Dubois' },
  { id: '16', name: 'Sébastien Roux' },
  { id: '17', name: 'Guillaume Lambert' },
  { id: '18', name: 'Anthony Mercier' },
  { id: '19', name: 'Christophe Simon' },
  { id: '20', name: 'Frédéric Royer' },
];

export type SurveyFormData = {
  playerName: string;
  willContinue: boolean | undefined;
};

export type PlayerResponse = {
  playerName: string;
  continues?: boolean;
  surveyCompleted: boolean;
  timestamp?: string;
  motivationalMessage?: string;
};

export type PlayerResponses = Record<string, PlayerResponse>;
