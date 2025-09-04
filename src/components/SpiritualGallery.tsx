import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, User, Sparkles } from "lucide-react";
import { useSpiritualArtReflections } from "@/hooks/useSpiritualArtReflections";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

const SpiritualGallery = () => {
  const { reflections, loading, toggleLike, getLikeCount } = useSpiritualArtReflections();
  const [likedReflections, setLikedReflections] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleLike = async (reflectionId: string) => {
    try {
      const result = await toggleLike(reflectionId);
      if (result.success) {
        // Optimistically update the like count and state
        setLikeCounts(prev => ({ 
          ...prev, 
          [reflectionId]: result.isLiked ? (prev[reflectionId] || 0) + 1 : Math.max((prev[reflectionId] || 0) - 1, 0)
        }));
        
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

  // Memoize formatted dates to avoid recalculating on every render
  const memoizedReflections = useMemo(() => {
    if (!reflections) return [];
    return reflections.map(reflection => ({
      ...reflection,
      formattedDate: formatDate(reflection.created_at)
    }));
  }, [reflections]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4 animate-fade-in">
            <Sparkles className="h-12 w-12 text-accent mx-auto animate-spin" />
            <p className="font-opensans text-blue-200 text-lg">Loading sacred gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 md:py-16 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-16 animate-fade-in">
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white">
              Sacred Gallery
            </h1>
            <p className="font-opensans text-base md:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed px-4">
              Explore the divine artwork and heartfelt reflections from souls who have journeyed through spiritual discovery.
            </p>
          </div>

          {/* Gallery Grid */}
          {!memoizedReflections || memoizedReflections.length === 0 ? (
            <div className="text-center py-12 md:py-20 animate-fade-in">
              <div className="inline-flex items-center space-x-3 text-blue-300 font-opensans text-base md:text-lg">
                <Sparkles className="animate-pulse" />
                <span>The sacred gallery awaits the first reflection...</span>
                <Sparkles className="animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {memoizedReflections.map((reflection, index) => (
                <Card 
                  key={reflection.id} 
                  className="overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft hover:shadow-glow transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Artwork Image */}
                  <div className="aspect-square relative">
                    <img
                      src={reflection.spiritual_art.image_url}
                      alt={reflection.spiritual_art.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', reflection.spiritual_art.image_url);
                        e.currentTarget.src = 'data:image/svg+xml;base64,' + btoa('<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#1a365d"/><text x="200" y="200" text-anchor="middle" fill="#ffd700" font-size="24">🪷 Sacred Art</text></svg>');
                      }}
                    />
                    <div className="absolute top-2 md:top-4 right-2 md:right-4">
                      <Badge variant="secondary" className="bg-accent/90 text-primary font-opensans font-medium text-xs">
                        Sacred Art
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    {/* Artwork Title & Divine Message */}
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="font-playfair text-lg md:text-xl font-semibold text-white line-clamp-2">
                        {reflection.spiritual_art.title}
                      </h3>
                      <div className="bg-gradient-to-r from-accent/20 to-transparent p-2 md:p-3 rounded-lg border-l-2 border-accent">
                        <p className="font-opensans text-xs md:text-sm text-blue-100 italic leading-relaxed line-clamp-3">
                          "{reflection.spiritual_art.divine_message}"
                        </p>
                      </div>
                    </div>

                    {/* User Reflection */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                        <span className="font-opensans text-xs md:text-sm font-medium text-accent truncate">
                          {reflection.author_name || "Anonymous Soul"}
                        </span>
                      </div>
                      <p className="font-opensans text-xs md:text-sm text-blue-200 leading-relaxed bg-white/5 p-2 md:p-3 rounded-lg line-clamp-4">
                        {reflection.text}
                      </p>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-1 md:space-x-2 text-blue-300">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="font-opensans text-xs">
                          {reflection.formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(reflection.id)}
                          className={`text-white hover:text-accent transition-colors p-1 md:p-2 ${
                            likedReflections.has(reflection.id) ? 'text-accent' : ''
                          }`}
                        >
                          <Heart 
                            className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${
                              likedReflections.has(reflection.id) ? 'fill-current' : ''
                            }`} 
                          />
                          <span className="text-xs font-opensans">
                            {likeCounts[reflection.id] || reflection.likes || 0}
                          </span>
                        </Button>

                        <Button variant="ghost" size="sm" className="text-white hover:text-accent p-1 md:p-2">
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="text-xs font-opensans hidden md:inline">Share</span>
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