import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ArtReveal from "@/components/ArtReveal";
import ReflectionForm from "@/components/ReflectionForm";
import ThankYou from "@/components/ThankYou";
import { useSpiritualArt } from "@/hooks/useSpiritualArt";

interface SpiritualArt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

type PageState = "landing" | "generating" | "reveal" | "reflection" | "thankyou";

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageState>("landing");
  const [currentArt, setCurrentArt] = useState<SpiritualArt | null>(null);
  const { generateArt, isGenerating } = useSpiritualArt();

  const handleBeginJourney = async () => {
    setCurrentPage("generating");
    const art = await generateArt();
    if (art) {
      setCurrentArt(art);
      setCurrentPage("reveal");
    } else {
      setCurrentPage("landing");
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
    setCurrentPage("landing");
  };

  const handleViewReflections = () => {
    navigate("/reflections");
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-12">
        {currentPage === "landing" && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="font-cormorant text-5xl font-bold text-foreground leading-tight">
                Spiritual Art Experience
              </h1>
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                Embark on a journey of inner discovery through AI-generated spiritual artwork.
                Each piece is uniquely created to inspire reflection and connection.
              </p>
            </div>
            
            <Card className="p-8 bg-gradient-card border-border/50 shadow-spiritual">
              <Button
                onClick={handleBeginJourney}
                className="w-full py-6 text-lg bg-gradient-primary hover:shadow-glow transition-all duration-300 font-inter"
                disabled={isGenerating}
              >
                Begin Journey
              </Button>
            </Card>
          </div>
        )}
        
        {currentPage === "generating" && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="animate-float">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow mb-6">
                <span className="text-3xl animate-pulse">✨</span>
              </div>
            </div>
            <h2 className="font-cormorant text-3xl font-semibold text-foreground">
              Your artwork is manifesting...
            </h2>
            <p className="font-inter text-muted-foreground">
              The universe is creating something beautiful just for you
            </p>
          </div>
        )}
        
        {currentPage === "reveal" && currentArt && (
          <ArtReveal 
            art={currentArt} 
            onStartReflection={handleStartReflection}
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
