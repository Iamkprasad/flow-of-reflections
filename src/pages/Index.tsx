import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ArtReveal from "@/components/ArtReveal";
import ArtworkSelection from "@/components/ArtworkSelection";
import ReflectionForm from "@/components/ReflectionForm";
import ThankYou from "@/components/ThankYou";
import { useSpiritualArt } from "@/hooks/useSpiritualArt";

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

type PageState = "landing" | "generating" | "selection" | "reveal" | "reflection" | "thankyou";

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageState>("landing");
  const [currentArt, setCurrentArt] = useState<SpiritualArt | null>(null);
  const [availableArtworks, setAvailableArtworks] = useState<SpiritualArt[]>([]);
  const { generateTwoArtworks, isGenerating } = useSpiritualArt();

  const handleBeginJourney = async () => {
    setCurrentPage("generating");
    const artworks = await generateTwoArtworks();
    if (artworks && artworks.length === 2) {
      setAvailableArtworks(artworks);
      setCurrentPage("selection");
    } else {
      setCurrentPage("landing");
    }
  };

  const handleArtworkSelected = (art: SpiritualArt) => {
    setCurrentArt(art);
    setCurrentPage("reveal");
  };

  const handleRefreshArtworks = async () => {
    const artworks = await generateTwoArtworks();
    if (artworks && artworks.length === 2) {
      setAvailableArtworks(artworks);
    }
  };

  const handleStartReflection = () => {
    setCurrentPage("reflection");
  };

  const handleReflectionSubmit = () => {
    setCurrentPage("thankyou");
  };

  const handleStartOver = () => {
    setCurrentArt(null);
    setAvailableArtworks([]);
    setCurrentPage("landing");
  };

  const handleViewReflections = () => {
    navigate("/reflections");
  };

  return (
    <div className="min-h-screen bg-gradient-background text-white">
      <div className="container mx-auto px-4 py-12">
        {currentPage === "landing" && (
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-8">
              <div className="flex justify-center mb-8">
                <img 
                  src="/src/assets/taporuh-logo.svg" 
                  alt="Taporuh - Spiritual Sanctuary" 
                  className="h-20 w-20 animate-float"
                />
              </div>
              <h1 className="font-playfair text-6xl font-bold text-white leading-tight">
                Taporuh
              </h1>
              <p className="font-opensans text-xl text-blue-200 leading-relaxed">
                Awaken your soul through words, images, and experiences
              </p>
              <p className="font-opensans text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Embark on a journey of inner discovery through AI-generated spiritual artwork.
                Each piece is uniquely created to inspire reflection and connection.
              </p>
            </div>
            
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-accent/30 shadow-spiritual">
              <Button
                onClick={handleBeginJourney}
                className="w-full py-6 text-xl bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold"
                disabled={isGenerating}
              >
                Begin Your Spiritual Journey
              </Button>
            </Card>
          </div>
        )}
        
        {currentPage === "generating" && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="animate-float">
              <div className="w-20 h-20 mx-auto bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow mb-6">
                <span className="text-3xl text-accent animate-pulse">🪷</span>
              </div>
            </div>
            <h2 className="font-playfair text-4xl font-semibold text-white">
              Your sacred artwork is manifesting...
            </h2>
            <p className="font-opensans text-blue-200 text-lg">
              The universe is creating something beautiful just for your soul
            </p>
          </div>
        )}
        
        {currentPage === "selection" && (
          <ArtworkSelection 
            artworks={availableArtworks}
            onArtworkSelected={handleArtworkSelected}
            onRefresh={handleRefreshArtworks}
            isRefreshing={isGenerating}
          />
        )}
        
        {currentPage === "reveal" && currentArt && (
          <ArtReveal 
            art={currentArt} 
            onStartReflection={handleStartReflection}
            onBack={() => setCurrentPage("selection")}
          />
        )}
        
        {currentPage === "reflection" && currentArt && (
          <ReflectionForm
            selectedArt={currentArt}
            onSubmit={handleReflectionSubmit}
            onBack={() => setCurrentPage("reveal")}
          />
        )}
        
        {currentPage === "thankyou" && (
          <ThankYou
            onViewReflections={handleViewReflections}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
