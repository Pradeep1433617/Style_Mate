import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-fashion-couple-real.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  const handleStartStyling = () => {
  console.log('Start Styling clicked!');
  const isAuthenticated = localStorage.getItem('authToken');
  console.log('Is Authenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    console.log('Navigating to /style-chat');
    navigate('/style-chat');
  } else {
    console.log('Navigating to /login');
    navigate('/login');
  }
 };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Fashion styling" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-primary/10 rounded-full mb-4 md:mb-6 animate-scale-in">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">AI-Powered Style Recommendations</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Style Mate</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
            Discover perfect outfit combinations tailored to any occasion. 
            Get expert color coordination and style suggestions powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-sm md:text-base w-full sm:w-auto"
              onClick={handleStartStyling}
            >
              Start Styling
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-sm md:text-base w-full sm:w-auto"
              onClick={() => document.getElementById('occasions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Looks
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};