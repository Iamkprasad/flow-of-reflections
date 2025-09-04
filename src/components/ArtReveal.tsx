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
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in px-4">
      <div className="text-center space-y-4">
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white">
          Your Sacred Artwork
        </h2>
        <p className="font-opensans text-blue-200 text-base md:text-lg max-w-md mx-auto">
          Allow this sacred creation to speak to your soul
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Artwork Display */}
        <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
          <div className="aspect-square p-4">
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                console.error('Image failed to load:', art.imageUrl);
                e.currentTarget.src = 'data:image/svg+xml;base64,' + btoa('<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#1a365d"/><text x="200" y="200" text-anchor="middle" fill="#ffd700" font-size="24">🪷 Sacred Art</text></svg>');
              }}
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-playfair text-lg md:text-xl font-medium text-white">
              {art.title}
            </h3>
          </div>
        </Card>

        {/* Description & Action */}
        <div className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6 bg-white/10 backdrop-blur-sm border-accent/30 shadow-soft">
            <div className="space-y-4">
              <h4 className="font-playfair text-lg md:text-xl font-medium text-white">
                Sacred Wisdom
              </h4>
              <p className="font-opensans text-blue-100 text-sm md:text-base leading-relaxed">
                {art.description}
              </p>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={onStartReflection}
              className="w-full py-3 md:py-4 bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold text-base md:text-lg"
            >
              Share Your Sacred Reflection
            </Button>
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full py-2 md:py-3 font-opensans border-accent text-accent hover:bg-accent hover:text-primary text-sm md:text-base"
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