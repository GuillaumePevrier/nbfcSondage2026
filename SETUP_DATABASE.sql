
-- Supprime les tables existantes si elles existent (pour repartir à neuf si besoin)
-- ATTENTION: CECI SUPPRIMERA TOUTES LES DONNÉES DE CES TABLES.
DROP TABLE IF EXISTS public.survey_responses;
DROP TABLE IF EXISTS public.joueurs;

-- 1. Création de la table "joueurs"
CREATE TABLE public.joueurs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), -- Champ optionnel pour le suivi
  CONSTRAINT joueurs_pkey PRIMARY KEY (id),
  CONSTRAINT joueurs_nom_key UNIQUE (nom) -- S'assurer que les noms des joueurs sont uniques si nécessaire
);

-- Activer Row Level Security (RLS) pour la table "joueurs"
ALTER TABLE public.joueurs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table "joueurs"
-- Permettre la lecture publique des joueurs (adaptable selon les besoins)
CREATE POLICY "Allow public read access to joueurs" ON public.joueurs
  FOR SELECT USING (true);

-- Permettre l'insertion de nouveaux joueurs par les utilisateurs authentifiés
-- (ou restreindre à un rôle 'admin' si vous avez un système d'administration)
CREATE POLICY "Allow authenticated users to insert joueurs" ON public.joueurs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permettre aux utilisateurs authentifiés de mettre à jour les joueurs
-- (vous voudrez peut-être restreindre cela aux propriétaires ou aux administrateurs)
CREATE POLICY "Allow authenticated users to update joueurs" ON public.joueurs
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Permettre aux utilisateurs authentifiés de supprimer des joueurs
-- (typiquement une opération d'administrateur)
CREATE POLICY "Allow authenticated users to delete joueurs" ON public.joueurs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Commenter/Décommenter la politique ci-dessous si vous voulez que ce soit complètement public sans authentification pour les modifications
-- ATTENTION: Non recommandé pour la production sans une autre forme de contrôle d'accès.
-- CREATE POLICY "Allow anonymous insert/update/delete for joueurs" ON public.joueurs
-- FOR ALL USING (true) WITH CHECK (true);


-- 2. Création de la table "survey_responses"
CREATE TABLE public.survey_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  player_name text NOT NULL, -- Dénormalisé pour faciliter l'affichage, mais on pourrait aussi joindre.
  participating boolean NOT NULL,
  submission_time timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT survey_responses_pkey PRIMARY KEY (id),
  CONSTRAINT survey_responses_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.joueurs(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT survey_responses_unique_player_submission UNIQUE (player_id) -- S'assurer qu'un joueur ne peut soumettre qu'une seule réponse
);

-- Activer Row Level Security (RLS) pour la table "survey_responses"
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table "survey_responses"
-- Permettre la lecture publique des réponses au sondage
CREATE POLICY "Allow public read access to survey_responses" ON public.survey_responses
  FOR SELECT USING (true);

-- Permettre aux utilisateurs authentifiés (ou anonymes si le sondage est public) d'insérer des réponses
-- Pour un sondage où n'importe qui peut répondre sans se connecter, utilisez `USING (true) WITH CHECK (true)`
-- Si seules les personnes connectées peuvent répondre : `USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated')`
-- Ici, nous allons permettre l'insertion anonyme, car le formulaire de sondage ne semble pas nécessiter de connexion.
CREATE POLICY "Allow anonymous insert to survey_responses" ON public.survey_responses
  FOR INSERT WITH CHECK (true);

-- Permettre la suppression des réponses par les utilisateurs authentifiés (par exemple, pour la fonction "Réinitialiser les Réponses")
-- Il serait préférable de restreindre cela à un rôle d'administrateur.
CREATE POLICY "Allow authenticated users to delete survey_responses" ON public.survey_responses
  FOR DELETE USING (auth.role() = 'authenticated');
  
-- Commenter/Décommenter si vous n'utilisez pas d'authentification pour la suppression et que l'API gère la sécurité
-- CREATE POLICY "Allow anonymous delete to survey_responses" ON public.survey_responses
-- FOR DELETE USING (true);


-- Index pour améliorer les performances des requêtes sur player_id dans survey_responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_player_id ON public.survey_responses(player_id);
CREATE INDEX IF NOT EXISTS idx_joueurs_nom ON public.joueurs(nom);

-- Message final
SELECT 'Script de configuration de la base de données exécuté avec succès.' as status;

-- Instructions supplémentaires:
-- 1. Exécutez ce script dans l'éditeur SQL de votre projet Supabase.
-- 2. Assurez-vous que vos variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont correctement configurées dans votre fichier .env.local.
-- 3. Si vous repartez de zéro avec la table 'joueurs', n'oubliez pas de réimporter vos joueurs via le script `npm run import-players` ou l'API route `/api/import-players`.
--    Le script `importPlayers.ts` suppose que la table 'joueurs' a une colonne 'nom'.
--    L'API route `pages/api/import-players.ts` fait de même.
--    Si la contrainte `UNIQUE (nom)` sur `joueurs` pose problème lors de l'importation de doublons,
--    vous devrez nettoyer `players.json` ou gérer les conflits dans le script d'import (`ON CONFLICT DO NOTHING` ou `ON CONFLICT DO UPDATE`).
--    Pour l'instant, le script d'import actuel ne gère pas les conflits.

-- Exemple de gestion des conflits lors de l'insertion (à ajouter dans votre script d'import si besoin):
-- .insert([{ nom: player.nom }])
-- .onConflict('nom') // Suppose que 'nom' a une contrainte UNIQUE
-- .ignore() // Ou .merge() pour mettre à jour
