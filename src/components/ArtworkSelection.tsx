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
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in px-4">
      <div className="text-center space-y-4">
        <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white">
          Choose what speaks to your soul
        </h2>
        <p className="font-opensans text-blue-200 text-base md:text-lg max-w-md mx-auto">
          Trust your first instinct. Click on the artwork that resonates with you in this moment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {artworks.map((artwork, index) => (
          <Card
            key={artwork.id}
            className="group cursor-pointer overflow-hidden bg-white/10 backdrop-blur-sm border-accent/30 hover:shadow-spiritual transition-all duration-500 hover:scale-[1.02] animate-scale-in"
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => onArtworkSelected(artwork)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  console.error('Image failed to load:', artwork.imageUrl);
                  e.currentTarget.src = 'data:image/svg+xml;base64,' + btoa('<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#1a365d"/><text x="200" y="200" text-anchor="middle" fill="#ffd700" font-size="24">🪷 Sacred Art</text></svg>');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="font-playfair text-lg md:text-xl font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
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
          className="font-opensans border-accent text-accent hover:bg-accent hover:text-primary px-6 py-2"
        >
          {isRefreshing ? "Creating new artworks..." : "Show me different options"}
        </Button>
      </div>
    </div>
  );
};

export default ArtworkSelection;