import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="animate-float">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <span className="text-3xl">🕉️</span>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in">
            <h1 className="font-cormorant text-4xl font-semibold text-foreground">
              About Taporuh
            </h1>
            <p className="font-inter text-lg text-muted-foreground leading-relaxed">
              Where art, spirituality, and human emotion converge
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="p-8 bg-gradient-card border-border/50 shadow-spiritual animate-fade-in">
            <div className="prose prose-lg max-w-none space-y-6">
              <div className="space-y-4">
                <p className="font-inter text-foreground leading-relaxed">
                  <span className="font-cormorant text-xl font-medium">Taporuh</span> is more than a platform—it's a sacred space where the soul's whispers 
                  find their voice. Born from the understanding that true spiritual connection happens 
                  when we allow ourselves to be moved by beauty, wisdom, and shared human experience.
                </p>

                <p className="font-inter text-foreground leading-relaxed">
                  In a world that often rushes past moments of profound meaning, we create pause. 
                  We believe that what draws us reveals something essential about our inner landscape—
                  our longings, our growth, our connection to the infinite tapestry of existence.
                </p>

                <p className="font-inter text-foreground leading-relaxed">
                  Through the simple act of choosing what speaks to us and reflecting on why, 
                  we engage in an ancient practice of self-discovery. Your anonymous words become 
                  part of a collective wisdom, showing others that they are not alone in their journey 
                  of awakening and understanding.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-6 py-4 my-8">
                <blockquote className="font-cormorant text-xl italic text-foreground leading-relaxed">
                  "When we share our inner truth, we illuminate the way for others to find theirs."
                </blockquote>
              </div>

              <div className="space-y-4">
                <h3 className="font-cormorant text-2xl font-semibold text-foreground">
                  The Philosophy
                </h3>
                <p className="font-inter text-foreground leading-relaxed">
                  Art and spirituality have always been intertwined. Sacred texts speak of truth 
                  through metaphor, wisdom traditions use symbols to convey the ineffable, 
                  and human hearts have always found the divine in beauty. Taporuh continues 
                  this tradition in a modern form—creating space for genuine reflection 
                  and authentic sharing.
                </p>
              </div>
            </div>
          </Card>

          {/* Instagram Link */}
          <Card className="p-6 bg-gradient-card border-border/50 shadow-soft animate-fade-in text-center">
            <div className="space-y-4">
              <h3 className="font-cormorant text-xl font-semibold text-foreground">
                Connect with Taporuh
              </h3>
              <p className="font-inter text-muted-foreground">
                Follow our journey of art, spirituality, and reflection
              </p>
              <a
                href="https://www.instagram.com/taporuh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 font-inter">
                  Visit @taporuh on Instagram
                </Button>
              </a>
            </div>
          </Card>

          {/* Navigation */}
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="font-inter"
              >
                Begin a Reflection
              </Button>
              <Button
                onClick={() => navigate("/reflections")}
                variant="ghost"
                className="font-inter"
              >
                View Reflections
              </Button>
            </div>
            
            <p className="font-inter text-sm text-muted-foreground italic mt-8">
              "Every soul that touches this space adds to its light."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;