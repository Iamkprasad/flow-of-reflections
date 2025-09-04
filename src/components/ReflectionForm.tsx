import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSpiritualArtReflections } from "@/hooks/useSpiritualArtReflections";

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ReflectionFormProps {
  selectedArt: SpiritualArt;
  onSubmit: () => void;
  onBack: () => void;
}

const ReflectionForm = ({ selectedArt, onSubmit, onBack }: ReflectionFormProps) => {
  const [reflection, setReflection] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addReflection, saveSpiritualArt } = useSpiritualArtReflections();

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      toast({
        title: "Please share your reflection",
        description: "Your thoughts are valuable - please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!authorName.trim()) {
      toast({
        title: "Please enter your name",
        description: "Let others know who shared this beautiful reflection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First, save the spiritual art to the database
      const artResult = await saveSpiritualArt({
        title: selectedArt.title,
        description: selectedArt.description,
        divine_message: selectedArt.description, // Using description as divine message for now
        image_url: selectedArt.imageUrl,
        prompt_used: "AI Generated Spiritual Art"
      });

      if (!artResult.success) {
        throw new Error("Failed to save spiritual art");
      }

      // Then, add the reflection linked to the spiritual art
      const reflectionResult = await addReflection(
        artResult.data.id, 
        reflection.trim(), 
        authorName.trim()
      );
      
      if (reflectionResult.success) {
        toast({
          title: "Sacred reflection shared",
          description: "Your reflection has been added to our spiritual gallery.",
        });
        onSubmit();
      } else {
        throw new Error("Failed to save reflection");
      }
    } catch (error) {
      console.error('Reflection submission error:', error);
      toast({
        title: "Error sharing reflection",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in px-4">
      <div className="text-center space-y-4">
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white">
          What stirred within your soul?
        </h2>
        <p className="font-opensans text-blue-200 text-base md:text-lg max-w-md mx-auto">
          Share your sacred reflection. Your words might illuminate the path for another seeker.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Selected Artwork */}
        <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
          <div className="aspect-square p-4">
            <img
              src={selectedArt.imageUrl}
              alt={selectedArt.title}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                console.error('Image failed to load:', selectedArt.imageUrl);
                e.currentTarget.src = 'data:image/svg+xml;base64,' + btoa('<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#1a365d"/><text x="200" y="200" text-anchor="middle" fill="#ffd700" font-size="24">🪷 Sacred Art</text></svg>');
              }}
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-playfair text-lg md:text-xl font-medium text-white">
              {selectedArt.title}
            </h3>
          </div>
        </Card>

        {/* Reflection Form */}
        <div className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6 bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="font-opensans text-sm md:text-base font-medium text-white">
                  Your Sacred Name
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="How shall we honor your reflection?"
                  className="bg-white/5 border-accent/50 text-white font-opensans text-sm md:text-base focus:shadow-glow-soft focus:border-accent transition-all duration-300 placeholder:text-blue-300"
                  maxLength={50}
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-opensans text-sm md:text-base font-medium text-white">
                  Why did this speak to your soul?
                </label>
                <p className="font-opensans text-xs md:text-sm text-blue-200">
                  What divine wisdom did it awaken? What sacred memory or feeling arose?
                </p>
              </div>
              
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Let your soul speak its sacred truth..."
                className="min-h-[100px] md:min-h-[120px] resize-none bg-white/5 border-accent/50 text-white font-opensans text-sm leading-relaxed focus:shadow-glow-soft focus:border-accent transition-all duration-300 placeholder:text-blue-300"
                maxLength={500}
              />
              
              <p className="font-opensans text-xs text-blue-300 text-right">
                {reflection.length}/500 characters
              </p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 py-2 md:py-3 font-opensans border-accent text-accent hover:bg-accent hover:text-primary text-sm md:text-base"
            >
              Choose Again
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 md:py-3 bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold text-sm md:text-base"
            >
              {isSubmitting ? "Sharing..." : "Share Sacred Reflection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionForm;