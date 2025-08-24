-- Fix security issues by setting proper search paths for functions
CREATE OR REPLACE FUNCTION public.get_reflection_like_count(reflection_uuid uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.reflection_likes
  WHERE reflection_id = reflection_uuid;
$function$;

CREATE OR REPLACE FUNCTION public.has_user_liked_reflection(reflection_uuid uuid, user_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS(
    SELECT 1
    FROM public.reflection_likes
    WHERE reflection_id = reflection_uuid AND user_id = user_uuid
  );
$function$;

CREATE OR REPLACE FUNCTION public.toggle_reflection_like(reflection_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;