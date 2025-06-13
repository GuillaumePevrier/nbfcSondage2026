
export interface Player {
  id: string;
  name: string;
}

export const players: Player[] = [
  { id: '1', name: 'Cedric Lebas' },
  { id: '2', name: 'Erwan Anfray' },
  { id: '3', name: 'Ewen Bersot' },
  { id: '4', name: 'François Beaudouin' },
  { id: '5', name: 'Guillaume Pévrier' },
  { id: '6', name: 'Jean Romu' },
  { id: '7', name: 'Laurent Collet' },
  { id: '8', name: 'Max Fremont' },
  { id: '9', name: 'Nicolas Ge' },
  { id: '10', name: 'Rom Savatte' },
  { id: '11', name: 'Vincent Poilvet' },
  { id: '12', name: 'Drd Julien' },
  { id: '13', name: 'Germain Mqn' },
  { id: '14', name: 'Jérémy Aubert' },
  { id: '15', name: 'Nicolas Beillard' },
  { id: '16', name: 'Dimitri Hudin' },
  { id: '17', name: 'Yann Uvy' },
  { id: '18', name: 'Yoann Poulain' },
  { id: '19', name: 'Léo Briantais' },
  { id: '20', name: 'Thibault Smolevsky' },
  { id: '21', name: 'Kévin MH' },
  { id: '22', name: 'Alexander Alessandro' },
  { id: '23', name: 'Nico Lamacq' },
  { id: '24', name: 'Jaddour Omar' },
  { id: '25', name: 'Nicolas Gousset' },
  { id: '26', name: 'Martin Lbn' },
  { id: '27', name: 'Vincent Bourdoiseau' },
  { id: '28', name: 'Alecs Gen' },
  { id: '29', name: 'Amine Rhidane' },
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
