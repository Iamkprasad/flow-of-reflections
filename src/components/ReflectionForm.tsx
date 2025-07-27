import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  image: string;
  title: string;
}

interface ReflectionFormProps {
  selectedPost: Post;
  onSubmit: (reflection: string) => void;
  onBack: () => void;
}

const ReflectionForm = ({ selectedPost, onSubmit, onBack }: ReflectionFormProps) => {
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      toast({
        title: "Please share your reflection",
        description: "Your thoughts are valuable - please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      onSubmit(reflection);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-cormorant text-3xl font-semibold text-foreground">
          What stirred within you?
        </h2>
        <p className="font-inter text-muted-foreground max-w-md mx-auto">
          Share your anonymous reflection. Your words might light the way for another soul.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Selected Post */}
        <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-soft">
          <div className="aspect-square">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-cormorant text-xl font-medium text-foreground">
              {selectedPost.title}
            </h3>
          </div>
        </Card>

        {/* Reflection Form */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-inter text-sm font-medium text-foreground">
                  Why did this speak to you?
                </label>
                <p className="font-inter text-xs text-muted-foreground">
                  What emotion did it awaken? What memory or feeling arose?
                </p>
              </div>
              
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Let your heart speak freely..."
                className="min-h-[120px] resize-none bg-background/50 border-border/30 font-inter text-sm leading-relaxed focus:shadow-glow-soft transition-shadow duration-300"
                maxLength={500}
              />
              
              <p className="font-inter text-xs text-muted-foreground text-right">
                {reflection.length}/500 characters
              </p>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 font-inter"
            >
              Choose Again
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 font-inter"
            >
              {isSubmitting ? "Sharing..." : "Share Reflection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionForm;