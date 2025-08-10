import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Journey", icon: "🪷" },
    { path: "/reflections", label: "Sacred Reflections", icon: "📿" },
    { path: "/blog", label: "Wisdom", icon: "📜" },
    { path: "/about", label: "About", icon: "✨" },
  ];

  return (
    <header className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm border-b border-accent/30 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/src/assets/taporuh-logo.svg" 
              alt="Taporuh" 
              className="h-8 w-8 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-playfair text-2xl font-bold text-white">
              Taporuh
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
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
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Admin Login */}
          <div className="flex items-center space-x-4">
            <Link to="/admin/login">
              <Button 
                variant="outline" 
                size="sm"
                className="border-accent text-accent hover:bg-accent hover:text-primary font-opensans"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;