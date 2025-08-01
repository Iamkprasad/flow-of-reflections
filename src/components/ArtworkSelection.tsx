import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ArtworkSelectionProps {
  artworks: SpiritualArt[];
  onArtworkSelected: (art: SpiritualArt) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const ArtworkSelection = ({ artworks, onArtworkSelected, onRefresh, isRefreshing }: ArtworkSelectionProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-cormorant text-3xl font-semibold text-foreground">
          Choose what speaks to your soul
        </h2>
        <p className="font-inter text-muted-foreground max-w-md mx-auto">
          Trust your first instinct. Click on the artwork that resonates with you in this moment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {artworks.map((artwork, index) => (
          <Card
            key={artwork.id}
            className="group cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:shadow-spiritual transition-all duration-500 hover:scale-[1.02] animate-scale-in"
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => onArtworkSelected(artwork)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="font-cormorant text-xl font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                  {artwork.title}
                </h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="font-inter"
        >
          {isRefreshing ? "Creating new artworks..." : "Show me different options"}
        </Button>
      </div>
    </div>
  );
};

export default ArtworkSelection;