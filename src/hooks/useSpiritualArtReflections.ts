import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  divine_message: string;
  image_url: string;
  prompt_used: string;
  created_at: string;
  updated_at: string;
}

interface SpiritualReflection {
  id: string;
  spiritual_art_id: string;
  text: string;
  author_name: string;
  likes: number;
  created_at: string;
  updated_at: string;
  spiritual_art: SpiritualArt;
}

interface Comment {
  id: string;
  reflection_id: string;
  text: string;
  created_at: string;
}

export const useSpiritualArtReflections = () => {
  const [reflections, setReflections] = useState<SpiritualReflection[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [spiritualArt, setSpiritualArt] = useState<SpiritualArt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchReflections = async () => {
      try {
        const { data, error } = await supabase
          .from('reflections')
          .select(`
            *,
            spiritual_art (*)
          `)
          .not('spiritual_art_id', 'is', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReflections(data || []);
      } catch (error) {
        console.error('Error fetching spiritual reflections:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSpiritualArt = async () => {
      try {
        const { data, error } = await supabase
          .from('spiritual_art')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSpiritualArt(data || []);
      } catch (error) {
        console.error('Error fetching spiritual art:', error);
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
    fetchSpiritualArt();
    fetchComments();

    // Set up real-time subscriptions
    const reflectionChannel = supabase
      .channel('spiritual_reflections_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reflections'
        },
        async (payload) => {
          console.log('New spiritual reflection:', payload);
          if (payload.new.spiritual_art_id) {
            // Fetch the reflection with spiritual art data
            const { data, error } = await supabase
              .from('reflections')
              .select(`
                *,
                spiritual_art (*)
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              setReflections(prev => [data, ...prev]);
            }
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
          console.log('Updated spiritual reflection:', payload);
          if (payload.new.spiritual_art_id) {
            const { data, error } = await supabase
              .from('reflections')
              .select(`
                *,
                spiritual_art (*)
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
        }
      )
      .subscribe();

    const artChannel = supabase
      .channel('spiritual_art_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'spiritual_art'
        },
        (payload) => {
          console.log('New spiritual art:', payload);
          setSpiritualArt(prev => [payload.new as SpiritualArt, ...prev]);
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
      supabase.removeChannel(artChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const saveSpiritualArt = async (art: {
    title: string;
    description: string;
    divine_message: string;
    image_url: string;
    prompt_used?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('spiritual_art')
        .insert(art)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving spiritual art:', error);
      return { success: false, error };
    }
  };

  const addReflection = async (spiritualArtId: string, text: string, authorName: string) => {
    try {
      const { error } = await supabase
        .from('reflections')
        .insert({
          spiritual_art_id: spiritualArtId,
          text: text,
          author_name: authorName
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error adding spiritual reflection:', error);
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

  const getSpiritualArtById = (artId: string) => {
    return spiritualArt.find(art => art.id === artId);
  };

  return {
    reflections,
    comments,
    spiritualArt,
    loading,
    saveSpiritualArt,
    addReflection,
    toggleLike,
    getLikeCount,
    hasUserLiked,
    addComment,
    getCommentsForReflection,
    getSpiritualArtById
  };
};