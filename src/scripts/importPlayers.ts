import { createClient } from '@supabase/supabase-js';
import playersData from '../data/players.json'; // Assurez-vous que le chemin d'accès est correct

// Assurez-vous que vos variables d'environnement sont correctement définies dans .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement Supabase ne sont pas définies.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Player {
  nom: string;
}

async function importPlayers() {
  console.log('Début de l\'importation des joueurs...');

  for (const player of playersData as Player[]) {
    try {
      const { data, error } = await supabase
        .from('joueurs') // Assurez-vous que le nom de votre table est bien 'joueurs'
        .insert([
          { nom: player.nom }
        ])
        .select(); // Optionally select the inserted data

      if (error) {
        console.error(`Erreur lors de l'insertion du joueur ${player.nom}:`, error.message);
      } else {
        console.log(`Joueur ${player.nom} importé avec succès.`);
      }
    } catch (error) {
      console.error(`Une erreur inattendue est survenue lors de l'importation du joueur ${player.nom}:`, error);
    }
  }

  console.log('Importation des joueurs terminée.');
}

importPlayers();