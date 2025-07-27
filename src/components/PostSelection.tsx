import { useState } from "react";
import { Card } from "@/components/ui/card";
import spiritualPost1 from "@/assets/spiritual-post-1.jpg";
import spiritualPost2 from "@/assets/spiritual-post-2.jpg";
import spiritualPost3 from "@/assets/spiritual-post-3.jpg";

interface Post {
  id: string;
  image: string;
  title: string;
}

interface PostSelectionProps {
  onPostSelected: (post: Post) => void;
}

const posts: Post[] = [
  { id: "1", image: spiritualPost1, title: "Sacred Geometry" },
  { id: "2", image: spiritualPost2, title: "Lotus Serenity" },
  { id: "3", image: spiritualPost3, title: "Divine Light" },
];

const PostSelection = ({ onPostSelected }: PostSelectionProps) => {
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);

  // Get two random posts
  const getRandomPosts = () => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  // Initialize with random posts on first render
  if (selectedPosts.length === 0) {
    setSelectedPosts(getRandomPosts());
  }

  const handlePostClick = (post: Post) => {
    onPostSelected(post);
  };

  const handleRefresh = () => {
    setSelectedPosts(getRandomPosts());
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
      </div>

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
                src={post.image}
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