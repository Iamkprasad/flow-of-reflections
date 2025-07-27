import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import spiritualPost1 from "@/assets/spiritual-post-1.jpg";
import spiritualPost2 from "@/assets/spiritual-post-2.jpg";
import spiritualPost3 from "@/assets/spiritual-post-3.jpg";

interface Reflection {
  id: string;
  text: string;
  postId: string;
  postTitle: string;
  postImage: string;
  timestamp: Date;
  likes: number;
}

// Sample reflections data
const sampleReflections: Reflection[] = [
  {
    id: "1",
    text: "This mandala reminds me of the infinite patterns within our souls. Each line connects to something deeper, something eternal that we all share.",
    postId: "1",
    postTitle: "Sacred Geometry",
    postImage: spiritualPost1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 7
  },
  {
    id: "2", 
    text: "The lotus teaches us that beauty can emerge from the murkiest waters. Like our hearts - sometimes the most profound love grows from our deepest pain.",
    postId: "2",
    postTitle: "Lotus Serenity",
    postImage: spiritualPost2,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 12
  },
  {
    id: "3",
    text: "In the gentle flicker of this diya, I see my grandmother's prayers. Light has always been humanity's way of calling to the divine within.",
    postId: "3",
    postTitle: "Divine Light", 
    postImage: spiritualPost3,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 5
  },
  {
    id: "4",
    text: "Sacred geometry reveals that everything is connected - our breath, the stars, the spiral of a shell. We are all part of one infinite design.",
    postId: "1",
    postTitle: "Sacred Geometry",
    postImage: spiritualPost1,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 9
  }
];

const Reflections = () => {
  const navigate = useNavigate();
  const [reflections, setReflections] = useState(sampleReflections);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const handleLike = (id: string) => {
    setReflections(prev => 
      prev.map(reflection => 
        reflection.id === id 
          ? { ...reflection, likes: reflection.likes + 1 }
          : reflection
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="animate-float">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <span className="text-2xl">🌟</span>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in">
            <h1 className="font-cormorant text-4xl font-semibold text-foreground">
              Voices of the Soul
            </h1>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Anonymous reflections from hearts that have been touched. Each word carries 
              the light of someone's truth, shared to illuminate the path for others.
            </p>
          </div>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="font-inter animate-scale-in"
          >
            Share Your Reflection
          </Button>
        </div>

        {/* Reflections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reflections.map((reflection, index) => (
            <Card
              key={reflection.id}
              className="p-6 bg-gradient-card border-border/50 shadow-soft hover:shadow-spiritual transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                {/* Post Reference */}
                <div className="flex items-center space-x-3">
                  <img
                    src={reflection.postImage}
                    alt={reflection.postTitle}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-inter text-xs text-muted-foreground">
                      Inspired by
                    </p>
                    <p className="font-cormorant text-sm font-medium text-foreground">
                      {reflection.postTitle}
                    </p>
                  </div>
                </div>

                {/* Reflection Text */}
                <blockquote className="font-inter text-sm text-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4">
                  "{reflection.text}"
                </blockquote>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="font-inter text-xs text-muted-foreground">
                    {formatTimeAgo(reflection.timestamp)}
                  </span>
                  
                  <button
                    onClick={() => handleLike(reflection.id)}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                  >
                    <span className="text-sm group-hover:animate-glow-pulse">🪔</span>
                    <span className="font-inter text-xs">{reflection.likes}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <p className="font-inter text-sm text-muted-foreground italic">
            "In sharing our reflections, we discover we are not alone in our journey."
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => navigate("/about")}
              variant="ghost"
              className="font-inter text-muted-foreground hover:text-primary"
            >
              About Taporuh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reflections;