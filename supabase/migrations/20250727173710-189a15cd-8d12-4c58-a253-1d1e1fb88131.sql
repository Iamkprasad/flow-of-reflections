-- Create posts table for Instagram posts
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instagram_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  permalink TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reflections table
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for real-time comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since everything is anonymous)
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT USING (true);

CREATE POLICY "Reflections are viewable by everyone" 
ON public.reflections FOR SELECT USING (true);

CREATE POLICY "Anyone can create reflections" 
ON public.reflections FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update reflection likes" 
ON public.reflections FOR UPDATE USING (true);

CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" 
ON public.comments FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reflections_updated_at
  BEFORE UPDATE ON public.reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER TABLE public.reflections REPLICA IDENTITY FULL;
ALTER TABLE public.comments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reflections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;