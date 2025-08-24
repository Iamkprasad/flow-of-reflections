-- Make post_id nullable in reflections table so we can have reflections for either posts or spiritual art
ALTER TABLE public.reflections 
ALTER COLUMN post_id DROP NOT NULL;