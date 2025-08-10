import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back",
          description: "Successfully signed in to admin panel.",
        });
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-sm border-accent/30">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src="/src/assets/taporuh-logo.svg" 
              alt="Taporuh" 
              className="h-16 w-16"
            />
          </div>
          
          <div>
            <h1 className="font-playfair text-3xl font-bold text-white">
              Admin Portal
            </h1>
            <p className="font-opensans text-blue-200 mt-2">
              Enter the sacred space of creation
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-opensans">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-white/5 border-accent/50 text-white placeholder:text-blue-300 focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-opensans">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border-accent/50 text-white placeholder:text-blue-300 focus:border-accent"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-primary hover:shadow-glow transition-all duration-300 font-opensans font-semibold"
            >
              {isLoading ? "Entering..." : "Enter Sacred Space"}
            </Button>
          </form>

          <p className="text-blue-300 text-sm font-opensans">
            Only authorized guardians of wisdom may enter
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;