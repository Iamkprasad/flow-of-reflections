import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntroModal = ({ isOpen, onClose }: IntroModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-card border-none shadow-spiritual">
        <div className="text-center space-y-6 p-6">
          <div className="animate-float">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <span className="text-2xl">🪔</span>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in-slow">
            <h2 className="font-cormorant text-2xl font-semibold text-foreground leading-relaxed">
              What you're drawn to reveals something within
            </h2>
            <p className="font-inter text-muted-foreground leading-relaxed">
              Let your intuition choose between two paths. Write what stirs in your heart, anonymously.
            </p>
          </div>
          
          <Button 
            onClick={onClose}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 font-inter font-medium px-8 py-3 animate-scale-in"
          >
            Begin the Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntroModal;