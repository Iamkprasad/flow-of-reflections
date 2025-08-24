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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-playfair text-4xl font-semibold text-white">
          What stirred within your soul?
        </h2>
        <p className="font-opensans text-blue-200 text-lg max-w-md mx-auto">
          Share your sacred reflection. Your words might illuminate the path for another seeker.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Selected Artwork */}
        <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
          <div className="aspect-square p-4">
            <img
              src={selectedArt.imageUrl}
              alt={selectedArt.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-playfair text-xl font-medium text-white">
              {selectedArt.title}
            </h3>
          </div>
        </Card>

        {/* Reflection Form */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-opensans text-base font-medium text-white">
                  Your Sacred Name
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="How shall we honor your reflection?"
                  className="bg-white/5 border-accent/50 text-white font-opensans focus:shadow-glow-soft focus:border-accent transition-all duration-300 placeholder:text-blue-300"
                  maxLength={50}
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-opensans text-base font-medium text-white">
                  Why did this speak to your soul?
                </label>
                <p className="font-opensans text-sm text-blue-200">
                  What divine wisdom did it awaken? What sacred memory or feeling arose?
                </p>
              </div>
              
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Let your soul speak its sacred truth..."
                className="min-h-[120px] resize-none bg-white/5 border-accent/50 text-white font-opensans text-sm leading-relaxed focus:shadow-glow-soft focus:border-accent transition-all duration-300 placeholder:text-blue-300"
                maxLength={500}
              />
              
              <p className="font-opensans text-xs text-blue-300 text-right">
                {reflection.length}/500 characters
              </p>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 font-opensans border-accent text-accent hover:bg-accent hover:text-primary"
            >
              Choose Again
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold"
            >
              {isSubmitting ? "Sharing Sacred Words..." : "Share Sacred Reflection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionForm;