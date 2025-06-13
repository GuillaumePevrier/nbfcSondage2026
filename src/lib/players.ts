export interface Player {
  id: string;
  name: string;
}

export const players: Player[] = [
  { id: '1', name: 'Guillaume P.' },
  { id: '2', name: 'Antoine G.' },
  { id: '3', name: 'Kylian M.' },
  { id: '4', name: 'Zinedine Z.' },
  { id: '5', name: 'Michel P.' },
  { id: '6', name: 'Lilian T.' },
  { id: '7', name: 'Didier D.' },
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
