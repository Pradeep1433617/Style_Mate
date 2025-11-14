import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface OccasionCardProps {
  title: string;
  description: string;
  image: string;
  delay?: number;
}

export const OccasionCard = ({ title, description, image, delay = 0 }: OccasionCardProps) => {
  return (
    <Card 
      className="group overflow-hidden border-border bg-card hover:shadow-soft transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={`${image}?v=3`} 
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        
        <Button variant="ghost" className="w-full group/btn">
          <span>View Suggestions</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
