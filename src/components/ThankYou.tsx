import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ThankYouProps {
  onViewReflections: () => void;
  onStartOver: () => void;
}

const ThankYou = ({ onViewReflections, onStartOver }: ThankYouProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-slow">
      <div className="animate-float">
        <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow mb-6">
          <span className="text-3xl">✨</span>
        </div>
      </div>
      
      <Card className="p-8 bg-gradient-card border-border/50 shadow-spiritual">
        <div className="space-y-6">
          <h2 className="font-cormorant text-3xl font-semibold text-foreground">
            Your reflection has been received
          </h2>
          
          <div className="space-y-4">
            <p className="font-inter text-lg text-muted-foreground leading-relaxed">
              Thank you for sharing your light. Your words now join the collective wisdom 
              of souls who have walked this path of reflection.
            </p>
            
            <p className="font-inter text-sm text-muted-foreground italic">
              "When we share our inner truth, we illuminate the way for others to find theirs."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={onViewReflections}
              variant="outline"
              className="flex-1 font-inter"
            >
              View All Reflections
            </Button>
            <Button
              onClick={onStartOver}
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 font-inter"
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