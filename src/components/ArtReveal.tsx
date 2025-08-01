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
}

const ArtReveal = ({ art, onStartReflection }: ArtRevealProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-cormorant text-3xl font-semibold text-foreground">
          Your Spiritual Artwork
        </h2>
        <p className="font-inter text-muted-foreground max-w-md mx-auto">
          Allow this sacred creation to speak to your soul
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Artwork Display */}
        <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-soft">
          <div className="aspect-square p-4">
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-cormorant text-xl font-medium text-foreground">
              {art.title}
            </h3>
          </div>
        </Card>

        {/* Description & Action */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
            <div className="space-y-4">
              <h4 className="font-cormorant text-lg font-medium text-foreground">
                Spiritual Meaning
              </h4>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                {art.description}
              </p>
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={onStartReflection}
              className="w-full py-4 bg-gradient-primary hover:shadow-glow transition-all duration-300 font-inter"
            >
              Share Your Reflection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtReveal;