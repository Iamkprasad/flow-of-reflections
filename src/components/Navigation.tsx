import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Journey", icon: "🪷" },
    { path: "/quotes", label: "Sacred Quotes", icon: "🌟" },
    { path: "/reflections", label: "Sacred Reflections", icon: "📿" },
    { path: "/gallery", label: "Gallery", icon: "🎨" },
    { path: "/blog", label: "Wisdom", icon: "📜" },
    { path: "/about", label: "About", icon: "✨" },
  ];

  return (
    <header className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm border-b border-accent/30 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-8 w-8 rounded-full bg-gradient-spiritual flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-playfair text-xl md:text-2xl font-bold text-white">
              Taporuh
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-opensans text-sm transition-colors duration-300 flex items-center space-x-2 group ${
                  location.pathname === link.path
                    ? "text-accent"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </span>
                <span className="hidden lg:block">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Admin & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link to="/admin/login" className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm"
                className="border-accent text-accent hover:bg-accent hover:text-primary font-opensans"
              >
                Admin
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:text-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-accent/30">
            <nav className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-opensans text-base transition-colors duration-300 flex items-center space-x-3 py-2 px-2 rounded-md ${
                    location.pathname === link.path
                      ? "text-accent bg-accent/10"
                      : "text-blue-200 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link 
                to="/admin/login" 
                className="mt-4 pt-4 border-t border-accent/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-primary font-opensans"
                >
                  Admin Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;