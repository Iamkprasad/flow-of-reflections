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

export const useInstagramPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshFromInstagram = async () => {
    setRefreshing(true);
    try {
      const response = await supabase.functions.invoke('fetch-instagram');
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      // Refresh local posts after fetching from Instagram
      await fetchPosts();
      console.log('Instagram posts refreshed successfully');
    } catch (error) {
      console.error('Error refreshing Instagram posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRandomPosts = (count: number = 2): Post[] => {
    if (posts.length < count) return posts;
    
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    refreshing,
    refreshFromInstagram,
    getRandomPosts
  };
};