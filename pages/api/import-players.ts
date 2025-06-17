import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import playersData from '../../data/players.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const IMPORT_SECRET = process.env.IMPORT_SECRET;

if (!supabaseUrl || !supabaseAnonKey) {
  // In a real application, handle this error more gracefully in production
  console.error('Supabase environment variables are not defined.');
  // You might want to throw an error or return a 500 response here
}

const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic security check
  if (req.query.secret !== IMPORT_SECRET || !IMPORT_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
     return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('Starting player import via API Route...');

  let importedCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const player of playersData) {
    const { data, error } = await supabase
      .from('joueurs')
      .insert([
        { nom: player.nom }
      ])
      // You might want to add .select() here if you need the inserted data back
      // .select('id')
      ;

    if (error) {
      console.error(`Error inserting player ${player.nom}:`, error);
      errorCount++;
      errors.push({ player: player.nom, error: error.message });
    } else {
      console.log(`Player ${player.nom} imported successfully.`);
      importedCount++;
    }
  }

  console.log('Player import finished.');
  res.status(200).json({
    message: 'Player import finished',
    importedCount,
    errorCount,
    errors: errors.length > 0 ? errors : undefined, // Include errors array only if there were errors
  });
}