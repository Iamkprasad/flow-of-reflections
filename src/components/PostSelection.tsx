import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstagramPosts } from "@/hooks/useInstagramPosts";
import spiritualPost1 from "@/assets/spiritual-post-1.jpg";
import spiritualPost2 from "@/assets/spiritual-post-2.jpg";
import spiritualPost3 from "@/assets/spiritual-post-3.jpg";

interface Post {
  id: string;
  instagram_id: string;
  title: string;
  image_url: string;
  caption: string;
  permalink: string;
}

interface PostSelectionProps {
  onPostSelected: (post: Post) => void;
}

// Fallback posts for when Instagram posts aren't available
const fallbackPosts: Post[] = [
  { 
    id: "fallback-1", 
    instagram_id: "fallback-1",
    image_url: spiritualPost1, 
    title: "Sacred Geometry",
    caption: "Sacred geometry pattern",
    permalink: ""
  },
  { 
    id: "fallback-2", 
    instagram_id: "fallback-2",
    image_url: spiritualPost2, 
    title: "Lotus Serenity",
    caption: "Lotus in serene waters",
    permalink: ""
  },
  { 
    id: "fallback-3", 
    instagram_id: "fallback-3",
    image_url: spiritualPost3, 
    title: "Divine Light",
    caption: "Divine light illumination",
    permalink: ""
  },
];

const PostSelection = ({ onPostSelected }: PostSelectionProps) => {
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const { posts, loading, refreshing, refreshFromInstagram, getRandomPosts } = useInstagramPosts();

  // Get two random posts from available posts or fallback
  const getRandomSelection = () => {
    const availablePosts = posts.length > 0 ? posts : fallbackPosts;
    return getRandomPosts ? getRandomPosts(2) : availablePosts.slice(0, 2);
  };

  useEffect(() => {
    if (!loading) {
      setSelectedPosts(getRandomSelection());
    }
  }, [posts, loading]);

  const handlePostClick = (post: Post) => {
    onPostSelected(post);
  };

  const handleRefresh = () => {
    setSelectedPosts(getRandomSelection());
  };

  const handleRefreshInstagram = async () => {
    await refreshFromInstagram();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-cormorant text-3xl font-semibold text-foreground">
          Choose what speaks to your soul
        </h2>
        <p className="font-inter text-muted-foreground max-w-md mx-auto">
          Trust your first instinct. Click on the image that resonates with you in this moment.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleRefreshInstagram}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="font-inter"
          >
            {refreshing ? "Fetching..." : "Refresh from Instagram"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <p className="font-inter text-muted-foreground">Loading spiritual posts...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {selectedPosts.map((post, index) => (
            <Card
              key={post.id}
              className="group cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:shadow-spiritual transition-all duration-500 hover:scale-[1.02] animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => handlePostClick(post)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="font-cormorant text-xl font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleRefresh}
          className="font-inter text-muted-foreground hover:text-primary transition-colors duration-300 underline"
        >
          Show me different options
        </button>
      </div>
    </div>
  );
};

export default PostSelection;