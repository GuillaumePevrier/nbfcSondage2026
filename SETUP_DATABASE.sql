
-- Supabase Table Setup Script

-- Step 0: (Optional but Recommended) Set the search path
-- Ensures that 'public' schema is preferred. If you use other schemas, adjust accordingly.
-- SET search_path TO public;

-- Step 1: Ensure 'joueurs' table is correctly set up
-- This script attempts to create the table if it doesn't exist,
-- with 'id' as a UUID primary key.

-- IMPORTANT: If the 'joueurs' table already exists from a previous attempt
-- and its 'id' column is NOT a UUID or NOT a primary key,
-- the `CREATE TABLE IF NOT EXISTS` command below might not fix it.
-- In such cases, you might need to DROP the existing 'joueurs' table first.
-- Be very careful with DROP TABLE as it DELETES ALL DATA in that table.
-- Only uncomment and run the line below if you are sure, have backups,
-- or can easily re-import your player data.
--
-- DROP TABLE IF EXISTS public.joueurs CASCADE;

CREATE TABLE IF NOT EXISTS public.joueurs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  CONSTRAINT joueurs_pkey PRIMARY KEY (id)
);

-- After creating the table, or if it already exists and you want to ensure RLS is on:
ALTER TABLE public.joueurs ENABLE ROW LEVEL SECURITY;

-- Define Row Level Security (RLS) policies for 'joueurs' table.
-- Adjust these policies based on your application's security requirements.

-- Example: Allow public read access to player names and IDs.
CREATE POLICY "Allow public read access on joueurs"
  ON public.joueurs FOR SELECT
  USING (true);

-- Example: If you have an admin interface or specific authenticated users
-- who should be able to add/modify players, define policies for INSERT, UPDATE, DELETE.
-- For instance, to allow any authenticated user to insert (you might want to restrict this further):
-- CREATE POLICY "Allow authenticated insert on joueurs"
--   ON public.joueurs FOR INSERT
--   TO authenticated
--   WITH CHECK (true);


-- Step 2: Create 'survey_responses' table
-- This table will store the responses from the survey.
-- The 'player_id' column will reference the 'id' from the 'joueurs' table.

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  player_name text NOT NULL, -- Denormalized for convenience, could be joined instead
  participating boolean NOT NULL,
  submission_time timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT survey_responses_pkey PRIMARY KEY (id),
  CONSTRAINT survey_responses_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.joueurs(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Enable Row Level Security (RLS) for 'survey_responses' table
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Define RLS policies for 'survey_responses'.
-- Adjust these policies based on your application's security requirements.

-- Example: Allow public read access to survey responses (e.g., for the dashboard).
CREATE POLICY "Allow public read access on survey_responses"
  ON public.survey_responses FOR SELECT
  USING (true);

-- Example: Allow anyone (anonymous users included) to submit a survey response.
-- This is suitable if your survey form is public.
CREATE POLICY "Allow anonymous insert on survey_responses"
  ON public.survey_responses FOR INSERT
  WITH CHECK (true);

-- Example: Allow anyone (anonymous users included) to delete responses.
-- This is used by the "Reset Responses" button. You might want to restrict this
-- to authenticated users or specific admin roles in a production app.
CREATE POLICY "Allow anonymous delete for survey_responses"
  ON public.survey_responses FOR DELETE
  USING (true);

-- Optional: Create an index on 'player_id' in 'survey_responses' for faster lookups.
CREATE INDEX IF NOT EXISTS idx_survey_responses_player_id ON public.survey_responses(player_id);

-- After running these SQL commands in your Supabase SQL Editor:
-- 1. Ensure your '.env' or '.env.local' file has the correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
-- 2. If you dropped the 'joueurs' table, or if it's empty, re-import your players using
--    the script: `npm run import-players`
--    or by calling the API endpoint: `/api/import-players?secret=yourimportsecret`
--    (Ensure IMPORT_SECRET is also set in your .env file if using the API route).

