import { Hero } from "@/components/Hero";
import { OccasionCard } from "@/components/OccasionCard";
import { ColorPalette } from "@/components/ColorPalette";
import { Shirt, Palette, Sparkles, Heart } from "lucide-react";

import workOutfit from "@/assets/work-outfit-men-real.jpg";
import dateOutfit from "@/assets/date-outfit.jpg";
import casualOutfit from "@/assets/casual-outfit-men-real.jpg";
import formalOutfit from "@/assets/formal-outfit.jpg";

const Index = () => {
  const occasions = [
    {
      title: "Work & Professional",
      description: "Polished looks that command respect and confidence in any business setting.",
      image: workOutfit,
    },
    {
      title: "Date Night",
      description: "Romantic and elegant outfits that make memorable impressions.",
      image: dateOutfit,
    },
    {
      title: "Casual Weekend",
      description: "Comfortable yet stylish ensembles for relaxed days out.",
      image: casualOutfit,
    },  
    {
      title: "Formal Events",
      description: "Sophisticated attire for galas, weddings, and special occasions.",
      image: formalOutfit,
    },
  ];

  const colorCombinations = [
    {
      name: "Sunset Romance",
      colors: ["#FF6B6B", "#FFE66D", "#FF8C42", "#E76F51"],
      description: "Warm and inviting tones perfect for evening wear",
    },
    {
      name: "Ocean Breeze",
      colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261"],
      description: "Cool and refreshing palette for spring and summer",
    },
    {
      name: "Urban Chic",
      colors: ["#2C3E50", "#95A5A6", "#ECF0F1", "#34495E"],
      description: "Sophisticated neutrals for professional settings",
    },
    {
      name: "Berry Bliss",
      colors: ["#8E24AA", "#EC407A", "#F06292", "#BA68C8"],
      description: "Vibrant and playful shades for bold statements",
    },
  ];

  const features = [
    {
      icon: Shirt,
      title: "Occasion-Based",
      description: "Get outfit suggestions tailored to your specific event or activity.",
    },
    {
      icon: Palette,
      title: "Color Harmony",
      description: "Expert color combinations that complement your style and skin tone.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced algorithms learn your preferences for personalized recommendations.",
    },
    {
      icon: Heart,
      title: "Style Confidence",
      description: "Build your wardrobe confidence with expert styling guidance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StyleMate?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered fashion companion that understands your style needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-card rounded-lg border border-border hover:shadow-card transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Style for Every Occasion</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From boardroom to ballroom, we've got your style covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasions.map((occasion, index) => (
              <OccasionCard
                key={index}
                title={occasion.title}
                description={occasion.description}
                image={occasion.image}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Color Combinations Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect Color Combinations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover harmonious palettes that bring your outfits to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorCombinations.map((combo, index) => (
              <ColorPalette
                key={index}
                name={combo.name}
                colors={combo.colors}
                description={combo.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of fashion-forward individuals who trust StyleMate for their daily outfit inspiration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-background/90 transition-colors shadow-lg">
              Get Started Free
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-primary-foreground text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© StyleMate. Your AI-powered fashion companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
