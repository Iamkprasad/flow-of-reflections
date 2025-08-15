import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Load blog posts from localStorage (where admin creates them)
    const loadBlogPosts = () => {
      const stored = localStorage.getItem('blog_posts');
      if (stored) {
        setBlogPosts(JSON.parse(stored));
      } else {
        // Fallback to default posts if none exist
        setBlogPosts([
          {
            id: 1,
            title: "The Sacred Art of Inner Reflection",
            excerpt: "Discover how spiritual artwork can unlock deeper understanding of your soul's journey...",
            date: "January 15, 2025",
            readTime: "5 min read"
          },
          {
            id: 2,
            title: "Manifesting Through Divine Creativity",
            excerpt: "Learn how AI-generated spiritual art connects us to universal consciousness...",
            date: "January 12, 2025",
            readTime: "7 min read"
          },
          {
            id: 3,
            title: "The Lotus Path: Finding Peace in Digital Age",
            excerpt: "Ancient wisdom meets modern technology in our quest for spiritual awakening...",
            date: "January 10, 2025",
            readTime: "6 min read"
          }
        ]);
      }
    };

    loadBlogPosts();
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
                Sacred Wisdom
              </h1>
              <p className="font-opensans text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
                Explore the depths of spiritual knowledge through articles that illuminate 
                the path to inner peace and divine understanding.
              </p>
            </div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <Card 
                  key={post.id}
                  className="p-8 bg-white/10 backdrop-blur-sm border-accent/30 hover:shadow-spiritual transition-all duration-500 cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-accent font-opensans">{post.date}</span>
                      <span className="text-blue-300 font-opensans">{post.readTime}</span>
                    </div>
                    
                    <h2 className="font-playfair text-2xl font-semibold text-white group-hover:text-accent transition-colors duration-300">
                      {post.title}
                    </h2>
                    
                    <p className="font-opensans text-blue-100 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="pt-4">
                      <span className="font-opensans text-accent text-sm hover:underline">
                        Continue Reading →
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Coming Soon */}
            <div className="text-center mt-16 py-12">
              <div className="inline-flex items-center space-x-2 text-blue-300 font-opensans">
                <span className="animate-pulse">✨</span>
                <span>More sacred wisdom coming soon</span>
                <span className="animate-pulse">✨</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;