import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ArtRevealProps {
  art: SpiritualArt;
  onStartReflection: () => void;
  onBack?: () => void;
}

const ArtReveal = ({ art, onStartReflection, onBack }: ArtRevealProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-playfair text-4xl font-semibold text-white">
          Your Sacred Artwork
        </h2>
        <p className="font-opensans text-blue-200 text-lg max-w-md mx-auto">
          Allow this sacred creation to speak to your soul
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Artwork Display */}
        <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
          <div className="aspect-square p-4">
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-playfair text-xl font-medium text-white">
              {art.title}
            </h3>
          </div>
        </Card>

        {/* Description & Action */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
            <div className="space-y-4">
              <h4 className="font-playfair text-xl font-medium text-white">
                Sacred Wisdom
              </h4>
              <p className="font-opensans text-blue-100 text-base leading-relaxed">
                {art.description}
              </p>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={onStartReflection}
              className="w-full py-4 bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold"
            >
              Share Your Sacred Reflection
            </Button>
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full font-opensans border-accent text-accent hover:bg-accent hover:text-primary"
              >
                Choose Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtReveal;