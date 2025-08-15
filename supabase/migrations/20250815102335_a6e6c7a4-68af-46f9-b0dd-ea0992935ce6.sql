-- Create a proper likes tracking table
CREATE TABLE public.reflection_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reflection_id, user_id)
);

-- Enable RLS on likes table
ALTER TABLE public.reflection_likes ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for likes
CREATE POLICY "Users can view all likes" 
ON public.reflection_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like reflections" 
ON public.reflection_likes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
ON public.reflection_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update reflections RLS policies to be secure
DROP POLICY IF EXISTS "Anyone can update reflection likes" ON public.reflections;

-- Create a secure policy that prevents direct like count manipulation
CREATE POLICY "No direct like count updates allowed" 
ON public.reflections 
FOR UPDATE 
USING (false);

-- Create a function to get like count for a reflection
CREATE OR REPLACE FUNCTION public.get_reflection_like_count(reflection_uuid UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.reflection_likes
  WHERE reflection_id = reflection_uuid;
$$;

-- Create a function to check if user has liked a reflection
CREATE OR REPLACE FUNCTION public.has_user_liked_reflection(reflection_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.reflection_likes
    WHERE reflection_id = reflection_uuid AND user_id = user_uuid
  );
$$;

-- Create a function to toggle like status
CREATE OR REPLACE FUNCTION public.toggle_reflection_like(reflection_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  like_exists BOOLEAN;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to like reflections';
  END IF;
  
  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM public.reflection_likes 
    WHERE reflection_id = reflection_uuid AND user_id = current_user_id
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Unlike: Remove the like
    DELETE FROM public.reflection_likes 
    WHERE reflection_id = reflection_uuid AND user_id = current_user_id;
    RETURN false;
  ELSE
    -- Like: Add the like
    INSERT INTO public.reflection_likes (reflection_id, user_id) 
    VALUES (reflection_uuid, current_user_id);
    RETURN true;
  END IF;
END;
$$;