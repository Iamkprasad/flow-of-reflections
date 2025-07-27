import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IntroModal from "@/components/IntroModal";
import PostSelection from "@/components/PostSelection";
import ReflectionForm from "@/components/ReflectionForm";
import ThankYou from "@/components/ThankYou";

interface Post {
  id: string;
  image: string;
  title: string;
}

type PageState = "intro" | "selection" | "reflection" | "thankyou";

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageState>("intro");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showIntroModal, setShowIntroModal] = useState(true);

  useEffect(() => {
    // Auto-show intro modal on first visit
    const hasVisited = localStorage.getItem("taporuh-visited");
    if (hasVisited) {
      setShowIntroModal(false);
      setCurrentPage("selection");
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem("taporuh-visited", "true");
    setShowIntroModal(false);
    setCurrentPage("selection");
  };

  const handlePostSelected = (post: Post) => {
    setSelectedPost(post);
    setCurrentPage("reflection");
  };

  const handleReflectionSubmit = (reflection: string) => {
    // Here you would typically save the reflection to a database
    console.log("Reflection submitted:", { reflection, post: selectedPost });
    setCurrentPage("thankyou");
  };

  const handleBackToSelection = () => {
    setSelectedPost(null);
    setCurrentPage("selection");
  };

  const handleStartOver = () => {
    setSelectedPost(null);
    setCurrentPage("selection");
  };

  const handleViewReflections = () => {
    navigate("/reflections");
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <IntroModal 
        isOpen={showIntroModal} 
        onClose={handleIntroComplete} 
      />
      
      <div className="container mx-auto px-4 py-12">
        {currentPage === "selection" && (
          <PostSelection onPostSelected={handlePostSelected} />
        )}
        
        {currentPage === "reflection" && selectedPost && (
          <ReflectionForm
            selectedPost={selectedPost}
            onSubmit={handleReflectionSubmit}
            onBack={handleBackToSelection}
          />
        )}
        
        {currentPage === "thankyou" && (
          <ThankYou
            onViewReflections={handleViewReflections}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
