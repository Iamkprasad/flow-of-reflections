import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRealtimeReflections } from "@/hooks/useRealtimeReflections";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Reflection {
  id: string;
  text: string;
  created_at: string;
  likes: number;
}

interface ReflectionCardProps {
  reflection: Reflection;
}

const ReflectionCard = ({ reflection }: ReflectionCardProps) => {
  const [likeCount, setLikeCount] = useState(reflection.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleLike, getLikeCount, hasUserLiked } = useRealtimeReflections();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserLikeStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userHasLiked = await hasUserLiked(reflection.id, user.id);
        setIsLiked(userHasLiked);
      }
      
      const currentLikeCount = await getLikeCount(reflection.id);
      setLikeCount(currentLikeCount);
    };

    checkUserLikeStatus();
  }, [reflection.id, hasUserLiked, getLikeCount]);

  const handleLikeToggle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like reflections.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await toggleLike(reflection.id);
      
      if (result.success) {
        setIsLiked(result.isLiked);
        const newCount = await getLikeCount(reflection.id);
        setLikeCount(newCount);
        
        toast({
          title: result.isLiked ? "Reflection liked!" : "Like removed",
          description: result.isLiked ? "Your appreciation has been recorded." : "Your like has been removed.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update like. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-accent/30 hover:shadow-spiritual transition-all duration-500">
      <div className="space-y-4">
        <p className="font-opensans text-blue-100 leading-relaxed text-sm">
          "{reflection.text}"
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-blue-300 font-opensans text-xs">
            {new Date(reflection.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeToggle}
              disabled={isLoading}
              className="p-1 hover:bg-accent/20"
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isLiked ? 'fill-accent text-accent' : 'text-blue-300'
                }`} 
              />
            </Button>
            <span className="text-blue-300 font-opensans text-sm">{likeCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReflectionCard;