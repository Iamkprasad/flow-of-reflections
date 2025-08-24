-- Create spiritual_art table for AI generated art
CREATE TABLE public.spiritual_art (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  divine_message TEXT NOT NULL,
  image_url TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spiritual_art ENABLE ROW LEVEL SECURITY;

-- Create policies for spiritual art
CREATE POLICY "Spiritual art is viewable by everyone" 
ON public.spiritual_art 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create spiritual art" 
ON public.spiritual_art 
FOR INSERT 
WITH CHECK (true);

-- Add spiritual_art_id to reflections table
ALTER TABLE public.reflections 
ADD COLUMN spiritual_art_id UUID REFERENCES public.spiritual_art(id),
ADD COLUMN author_name TEXT;

-- Update reflections policies to work with spiritual art
DROP POLICY IF EXISTS "Anyone can create reflections" ON public.reflections;
CREATE POLICY "Anyone can create reflections" 
ON public.reflections 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for spiritual art timestamps
CREATE TRIGGER update_spiritual_art_updated_at
BEFORE UPDATE ON public.spiritual_art
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for spiritual_art
ALTER TABLE public.spiritual_art REPLICA IDENTITY FULL;