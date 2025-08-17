import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Quote {
  id: string;
  text: string;
  author: string;
  imageUrl: string;
}

const Quotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateQuote = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-spiritual-quote');
      
      if (error) throw error;
      
      const quote: Quote = {
        id: crypto.randomUUID(),
        text: data.text,
        author: data.author,
        imageUrl: data.imageUrl
      };

      setCurrentQuote(quote);
    } catch (error) {
      console.error('Error generating quote:', error);
      toast({
        title: "Generation failed",
        description: "Unable to create your spiritual quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateQuote();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <h1 className="font-playfair text-5xl font-bold text-white">
                Sacred Quotes
              </h1>
              <p className="font-opensans text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
                Discover divine wisdom through AI-generated spiritual quotes that resonate with your soul's journey.
              </p>
            </div>

            {/* Quote Display */}
            <div className="flex flex-col items-center space-y-8">
              {currentQuote && (
                <Card className="p-8 bg-white/10 backdrop-blur-sm border-accent/30 max-w-3xl">
                  <div className="space-y-6">
                    {/* Quote Image */}
                    <div className="flex justify-center">
                      <img 
                        src={currentQuote.imageUrl} 
                        alt="Spiritual artwork"
                        className="w-full max-w-md h-64 object-cover rounded-lg shadow-spiritual"
                      />
                    </div>
                    
                    {/* Quote Text */}
                    <div className="text-center space-y-4">
                      <blockquote className="font-playfair text-2xl text-white leading-relaxed italic">
                        "{currentQuote.text}"
                      </blockquote>
                      <cite className="font-opensans text-accent text-lg">
                        — {currentQuote.author}
                      </cite>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Button */}
              <Button 
                onClick={generateQuote}
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-primary font-opensans px-8 py-3 text-lg rounded-full shadow-spiritual transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>Channeling Wisdom...</span>
                  </div>
                ) : (
                  "✨ Generate New Quote ✨"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quotes;