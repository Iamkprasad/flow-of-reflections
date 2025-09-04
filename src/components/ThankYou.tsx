import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ThankYouProps {
  onViewReflections: () => void;
  onStartOver: () => void;
}

const ThankYou = ({ onViewReflections, onStartOver }: ThankYouProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 md:space-y-8 animate-fade-in-slow px-4">
      <div className="animate-float">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow mb-6">
          <span className="text-2xl md:text-3xl text-accent">🪷</span>
        </div>
      </div>
      
      <Card className="p-6 md:p-8 bg-white/10 backdrop-blur-sm border-accent/30 shadow-spiritual">
        <div className="space-y-4 md:space-y-6">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white">
            Your sacred reflection has been received
          </h2>
          
          <div className="space-y-4">
            <p className="font-opensans text-base md:text-lg text-blue-100 leading-relaxed">
              Namaste. Your divine words now join the sacred wisdom 
              of souls who have walked this path of spiritual awakening.
            </p>
            
            <p className="font-opensans text-sm md:text-base text-accent italic">
              "When we share our inner truth, we illuminate the way for others to find theirs."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
            <Button
              onClick={onViewReflections}
              variant="outline"
              className="flex-1 py-2 md:py-3 font-opensans border-accent text-accent hover:bg-accent hover:text-primary text-sm md:text-base"
            >
              View Sacred Reflections
            </Button>
            <Button
              onClick={onStartOver}
              className="flex-1 py-3 md:py-3 bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold text-sm md:text-base"
            >
              Begin Another Journey
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThankYou;