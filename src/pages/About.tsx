import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="flex justify-center mb-8">
                <img 
                  src="/src/assets/taporuh-logo.svg" 
                  alt="Taporuh" 
                  className="h-24 w-24 animate-float"
                />
              </div>
              <h1 className="font-playfair text-5xl font-bold text-white">
                About Taporuh
              </h1>
              <p className="font-opensans text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
                A sacred digital sanctuary where ancient wisdom meets modern AI to illuminate the path of spiritual awakening.
              </p>
            </div>

            {/* Mission */}
            <Card className="p-8 mb-8 bg-white/10 backdrop-blur-sm border-accent/30 shadow-spiritual">
              <div className="space-y-6">
                <h2 className="font-playfair text-3xl font-semibold text-white text-center">
                  Our Sacred Mission
                </h2>
                <p className="font-opensans text-blue-100 text-lg leading-relaxed text-center">
                  Taporuh exists to bridge the gap between inner wisdom and outer expression, 
                  using AI-generated spiritual art as a catalyst for deep personal reflection 
                  and collective enlightenment.
                </p>
              </div>
            </Card>

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: "Sacred Technology",
                  icon: "🤖",
                  description: "We believe technology can be a divine instrument for spiritual growth when used with pure intention."
                },
                {
                  title: "Inner Reflection",
                  icon: "🪷",
                  description: "Every artwork generated is meant to be a mirror for your soul, revealing hidden truths and insights."
                },
                {
                  title: "Collective Wisdom",
                  icon: "🌟",
                  description: "Through sharing reflections, we build a tapestry of human experience and spiritual understanding."
                }
              ].map((value, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-sm border-accent/20 text-center hover:shadow-spiritual transition-all duration-500"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-playfair text-xl font-semibold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="font-opensans text-blue-200 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>

            {/* Journey */}
            <Card className="p-8 mb-8 bg-white/10 backdrop-blur-sm border-accent/30 shadow-spiritual">
              <div className="space-y-6">
                <h2 className="font-playfair text-3xl font-semibold text-white text-center">
                  The Taporuh Experience
                </h2>
                <div className="space-y-4 font-opensans text-blue-100 leading-relaxed">
                  <p>
                    Each journey begins with intention. When you click "Begin Your Spiritual Journey," 
                    our AI creates unique spiritual artwork paired with profound descriptions that speak 
                    to the depths of human experience.
                  </p>
                  <p>
                    You'll choose between two pieces, trusting your intuition to guide you to the artwork 
                    that resonates with your current spiritual state. This moment of choice is sacred - 
                    it's your soul recognizing itself in digital form.
                  </p>
                  <p>
                    After reflecting on your chosen piece, you're invited to share your thoughts 
                    anonymously with our community. These reflections become part of a growing 
                    collection of human wisdom, inspiring others on their own spiritual paths.
                  </p>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold"
                >
                  Begin Sacred Journey
                </Button>
                <Button
                  onClick={() => navigate("/reflections")}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-primary font-opensans"
                >
                  View Sacred Reflections
                </Button>
              </div>
              
              <p className="font-opensans text-sm text-blue-300 italic mt-8">
                "When we share our inner truth, we illuminate the way for others to find theirs."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;