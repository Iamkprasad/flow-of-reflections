import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  instagram_id: string;
  title: string;
  image_url: string;
  caption: string;
  permalink: string;
}

interface Reflection {
  id: string;
  post_id: string;
  text: string;
  likes: number;
  created_at: string;
  updated_at: string;
  posts: Post;
}

interface Comment {
  id: string;
  reflection_id: string;
  text: string;
  created_at: string;
}

export const useRealtimeReflections = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchReflections = async () => {
      try {
        const { data, error } = await supabase
          .from('reflections')
          .select(`
            *,
            posts (*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReflections(data || []);
      } catch (error) {
        console.error('Error fetching reflections:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }
      setComments(data || []);
    };

    fetchReflections();
    fetchComments();

    // Set up real-time subscriptions
    const reflectionChannel = supabase
      .channel('reflections_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reflections'
        },
        async (payload) => {
          console.log('New reflection:', payload);
          // Fetch the reflection with post data
          const { data, error } = await supabase
            .from('reflections')
            .select(`
              *,
              posts (*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            setReflections(prev => [data, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reflections'
        },
        async (payload) => {
          console.log('Updated reflection:', payload);
          const { data, error } = await supabase
            .from('reflections')
            .select(`
              *,
              posts (*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            setReflections(prev => 
              prev.map(reflection => 
                reflection.id === data.id ? data : reflection
              )
            );
          }
        }
      )
      .subscribe();

    const commentChannel = supabase
      .channel('comments_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          console.log('New comment:', payload);
          setComments(prev => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reflectionChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const addReflection = async (postId: string, text: string) => {
    try {
      const { error } = await supabase
        .from('reflections')
        .insert({
          post_id: postId,
          text: text
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error adding reflection:', error);
      return { success: false, error };
    }
  };

  const incrementLikes = async (reflectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('reflections')
        .update({ 
          likes: reflections.find(r => r.id === reflectionId)?.likes + 1 || 1 
        })
        .eq('id', reflectionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing likes:', error);
    }
  };

  const addComment = async (reflectionId: string, text: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          reflection_id: reflectionId,
          text: text
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error };
    }
  };

  const getCommentsForReflection = (reflectionId: string) => {
    return comments.filter(comment => comment.reflection_id === reflectionId);
  };

  return {
    reflections,
    comments,
    loading,
    addReflection,
    incrementLikes,
    addComment,
    getCommentsForReflection
  };
};