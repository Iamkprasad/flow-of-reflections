import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useRealtimeReflections } from "@/hooks/useRealtimeReflections";

const Reflections = () => {
  const navigate = useNavigate();
  const { reflections, loading, incrementLikes, addComment, getCommentsForReflection } = useRealtimeReflections();
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

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
    incrementLikes(id);
  };

  const handleComment = (reflectionId: string) => {
    const comment = newComment[reflectionId];
    if (comment?.trim()) {
      addComment(reflectionId, comment.trim());
      setNewComment(prev => ({ ...prev, [reflectionId]: '' }));
    }
  };

  const toggleComments = (reflectionId: string) => {
    setShowComments(prev => ({ ...prev, [reflectionId]: !prev[reflectionId] }));
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

        {loading ? (
          <div className="text-center">
            <p className="font-inter text-muted-foreground">Loading reflections...</p>
          </div>
        ) : (
          /* Reflections Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reflections.map((reflection, index) => {
              const comments = getCommentsForReflection(reflection.id);
              return (
                <Card
                  key={reflection.id}
                  className="p-6 bg-gradient-card border-border/50 shadow-soft hover:shadow-spiritual transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    {/* Post Reference */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={reflection.posts.image_url}
                        alt={reflection.posts.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-inter text-xs text-muted-foreground">
                          Inspired by
                        </p>
                        <p className="font-cormorant text-sm font-medium text-foreground">
                          {reflection.posts.title}
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
                        {formatTimeAgo(new Date(reflection.created_at))}
                      </span>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleLike(reflection.id)}
                          className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                        >
                          <span className="text-sm group-hover:animate-glow-pulse">🪔</span>
                          <span className="font-inter text-xs">{reflection.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleComments(reflection.id)}
                          className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                          <span className="text-sm">💬</span>
                          <span className="font-inter text-xs">{comments.length}</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {showComments[reflection.id] && (
                      <div className="space-y-3 pt-3 border-t border-border/20">
                        {/* Add Comment */}
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a comment..."
                            value={newComment[reflection.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ 
                              ...prev, 
                              [reflection.id]: e.target.value 
                            }))}
                            className="text-xs"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(reflection.id);
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleComment(reflection.id)}
                            className="text-xs"
                          >
                            Post
                          </Button>
                        </div>
                        
                        {/* Display Comments */}
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {comments.map((comment) => (
                            <div key={comment.id} className="text-xs text-muted-foreground italic">
                              <span className="text-foreground">"{comment.text}"</span>
                              <div className="text-xs opacity-70 mt-1">
                                {formatTimeAgo(new Date(comment.created_at))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

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