import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const useSpiritualArt = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateArt = async (): Promise<SpiritualArt | null> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-spiritual-art');
      
      if (error) throw error;
      
      const artpiece: SpiritualArt = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl
      };

      return artpiece;
    } catch (error) {
      console.error('Error generating spiritual art:', error);
      toast({
        title: "Generation failed",
        description: "Unable to create your spiritual artwork. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTwoArtworks = async (): Promise<SpiritualArt[] | null> => {
    setIsGenerating(true);
    
    try {
      // Generate two different artworks simultaneously
      const [result1, result2] = await Promise.all([
        supabase.functions.invoke('generate-spiritual-art'),
        supabase.functions.invoke('generate-spiritual-art')
      ]);
      
      if (result1.error || result2.error) {
        throw new Error('Failed to generate artworks');
      }
      
      const artworks: SpiritualArt[] = [
        {
          id: crypto.randomUUID(),
          title: result1.data.title,
          description: result1.data.description,
          imageUrl: result1.data.imageUrl
        },
        {
          id: crypto.randomUUID(),
          title: result2.data.title,
          description: result2.data.description,
          imageUrl: result2.data.imageUrl
        }
      ];

      return artworks;
    } catch (error) {
      console.error('Error generating spiritual artworks:', error);
      toast({
        title: "Generation failed",
        description: "Unable to create your spiritual artworks. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateArt,
    generateTwoArtworks,
    isGenerating
  };
};