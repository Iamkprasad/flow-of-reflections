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

  const toggleLike = async (reflectionId: string) => {
    try {
      const { data, error } = await supabase.rpc('toggle_reflection_like', {
        reflection_uuid: reflectionId
      });

      if (error) throw error;
      return { success: true, isLiked: data };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error };
    }
  };

  const getLikeCount = async (reflectionId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_reflection_like_count', {
        reflection_uuid: reflectionId
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting like count:', error);
      return 0;
    }
  };

  const hasUserLiked = async (reflectionId: string, userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_user_liked_reflection', {
        reflection_uuid: reflectionId,
        user_uuid: userId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking if user liked:', error);
      return false;
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
    toggleLike,
    getLikeCount,
    hasUserLiked,
    addComment,
    getCommentsForReflection
  };
};