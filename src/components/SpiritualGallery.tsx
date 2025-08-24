import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, User, Sparkles } from "lucide-react";
import { useSpiritualArtReflections } from "@/hooks/useSpiritualArtReflections";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SpiritualGallery = () => {
  const { reflections, loading, toggleLike, getLikeCount } = useSpiritualArtReflections();
  const [likedReflections, setLikedReflections] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleLike = async (reflectionId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like reflections",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await toggleLike(reflectionId);
      if (result.success) {
        const newCount = await getLikeCount(reflectionId);
        setLikeCounts(prev => ({ ...prev, [reflectionId]: newCount }));
        
        setLikedReflections(prev => {
          const newSet = new Set(prev);
          if (result.isLiked) {
            newSet.add(reflectionId);
          } else {
            newSet.delete(reflectionId);
          }
          return newSet;
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-accent mx-auto animate-spin" />
          <p className="font-opensans text-blue-200 text-lg">Loading sacred gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="font-playfair text-5xl font-bold text-white">
              Sacred Gallery
            </h1>
            <p className="font-opensans text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Explore the divine artwork and heartfelt reflections from souls who have journeyed through spiritual discovery.
            </p>
          </div>

          {/* Gallery Grid */}
          {!reflections || reflections.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-3 text-blue-300 font-opensans text-lg">
                <Sparkles className="animate-pulse" />
                <span>The sacred gallery awaits the first reflection...</span>
                <Sparkles className="animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {reflections.map((reflection) => (
                <Card key={reflection.id} className="overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft hover:shadow-glow transition-all duration-300">
                  {/* Artwork Image */}
                  <div className="aspect-square relative">
                    <img
                      src={reflection.spiritual_art.image_url}
                      alt={reflection.spiritual_art.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-accent/90 text-primary font-opensans font-medium">
                        Sacred Art
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Artwork Title & Divine Message */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-xl font-semibold text-white">
                        {reflection.spiritual_art.title}
                      </h3>
                      <div className="bg-gradient-to-r from-accent/20 to-transparent p-3 rounded-lg border-l-2 border-accent">
                        <p className="font-opensans text-sm text-blue-100 italic leading-relaxed">
                          "{reflection.spiritual_art.divine_message}"
                        </p>
                      </div>
                    </div>

                    {/* User Reflection */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-accent" />
                        <span className="font-opensans text-sm font-medium text-accent">
                          {reflection.author_name || "Anonymous Soul"}
                        </span>
                      </div>
                      <p className="font-opensans text-sm text-blue-200 leading-relaxed bg-white/5 p-3 rounded-lg">
                        {reflection.text}
                      </p>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2 text-blue-300">
                        <Calendar className="h-4 w-4" />
                        <span className="font-opensans text-xs">
                          {formatDate(reflection.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(reflection.id)}
                          className={`text-white hover:text-accent transition-colors ${
                            likedReflections.has(reflection.id) ? 'text-accent' : ''
                          }`}
                        >
                          <Heart 
                            className={`h-4 w-4 mr-1 ${
                              likedReflections.has(reflection.id) ? 'fill-current' : ''
                            }`} 
                          />
                          <span className="text-xs font-opensans">
                            {likeCounts[reflection.id] || reflection.likes || 0}
                          </span>
                        </Button>

                        <Button variant="ghost" size="sm" className="text-white hover:text-accent">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs font-opensans">Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpiritualGallery;