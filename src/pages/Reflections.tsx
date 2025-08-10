import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useRealtimeReflections } from "@/hooks/useRealtimeReflections";

const Reflections = () => {
  const { reflections, loading } = useRealtimeReflections();

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <h1 className="font-playfair text-5xl font-bold text-white">
                Sacred Reflections
              </h1>
              <p className="font-opensans text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
                Discover the collective wisdom of souls who have journeyed through our spiritual artwork experience.
              </p>
            </div>

            {/* Reflections Grid */}
            {!reflections || reflections.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center space-x-2 text-blue-300 font-opensans">
                  <span className="animate-pulse">🪷</span>
                  <span>Sacred reflections are manifesting...</span>
                  <span className="animate-pulse">🪷</span>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reflections.map((reflection) => (
                  <Card 
                    key={reflection.id}
                    className="p-6 bg-white/10 backdrop-blur-sm border-accent/30 hover:shadow-spiritual transition-all duration-500"
                  >
                    <div className="space-y-4">
                      <p className="font-opensans text-blue-100 leading-relaxed text-sm">
                        "{reflection.text}"
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-300 font-opensans">
                          {new Date(reflection.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-accent">💫</span>
                          <span className="text-blue-300 font-opensans">{reflection.likes}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reflections;