import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    readTime: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    loadBlogPosts();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }
    setUser(user);
    setIsLoading(false);
  };

  const loadBlogPosts = () => {
    // For now, use local storage to simulate a database
    const stored = localStorage.getItem('blog_posts');
    if (stored) {
      setBlogPosts(JSON.parse(stored));
    }
  };

  const saveBlogPosts = (posts: BlogPost[]) => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
    setBlogPosts(posts);
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const post: BlogPost = {
      id: Date.now(),
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: newPost.readTime || "5 min read"
    };

    const updatedPosts = [post, ...blogPosts];
    saveBlogPosts(updatedPosts);

    setNewPost({ title: "", excerpt: "", content: "", readTime: "" });
    setIsCreating(false);

    toast({
      title: "Post created",
      description: "Your blog post has been published successfully.",
    });
  };

  const handleDeletePost = (id: number) => {
    const updatedPosts = blogPosts.filter(post => post.id !== id);
    saveBlogPosts(updatedPosts);
    
    toast({
      title: "Post deleted",
      description: "The blog post has been removed.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-white font-opensans">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-4xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="font-opensans text-blue-200 mt-2">
                  Manage your sacred wisdom content
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsCreating(!isCreating)}
                  className="bg-accent hover:bg-accent/90 text-primary font-opensans"
                >
                  {isCreating ? "Cancel" : "Create New Post"}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-accent/50 text-white hover:bg-white/10 font-opensans"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Create New Post Form */}
            {isCreating && (
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-accent/30 mb-8">
                <h2 className="font-playfair text-2xl font-semibold text-white mb-6">
                  Create New Blog Post
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white font-opensans">Title</Label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Enter post title"
                      className="bg-white/5 border-accent/50 text-white placeholder:text-blue-300"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white font-opensans">Excerpt</Label>
                    <Textarea
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                      placeholder="Brief description of the post"
                      className="bg-white/5 border-accent/50 text-white placeholder:text-blue-300 min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white font-opensans">Content</Label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="Full post content"
                      className="bg-white/5 border-accent/50 text-white placeholder:text-blue-300 min-h-[200px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white font-opensans">Read Time</Label>
                    <Input
                      value={newPost.readTime}
                      onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
                      placeholder="e.g., 5 min read"
                      className="bg-white/5 border-accent/50 text-white placeholder:text-blue-300"
                    />
                  </div>
                  
                  <Button
                    onClick={handleCreatePost}
                    className="w-full bg-accent hover:bg-accent/90 text-primary font-opensans"
                  >
                    Publish Post
                  </Button>
                </div>
              </Card>
            )}

            {/* Existing Posts */}
            <div className="space-y-6">
              <h2 className="font-playfair text-3xl font-semibold text-white">
                Published Posts ({blogPosts.length})
              </h2>
              
              {blogPosts.length === 0 ? (
                <Card className="p-8 bg-white/10 backdrop-blur-sm border-accent/30 text-center">
                  <p className="text-blue-200 font-opensans">
                    No blog posts yet. Create your first post to share sacred wisdom.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <Card 
                      key={post.id}
                      className="p-6 bg-white/10 backdrop-blur-sm border-accent/30"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-playfair text-xl font-semibold text-white">
                            {post.title}
                          </h3>
                          <p className="text-blue-200 font-opensans mt-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 mt-4 text-sm text-blue-300">
                            <span>{post.date}</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleDeletePost(post.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-400/50 text-red-400 hover:bg-red-400/20"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
