interface ColorPaletteProps {
  name: string;
  colors: string[];
  description: string;
}

export const ColorPalette = ({ name, colors, description }: ColorPaletteProps) => {
  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:shadow-card transition-all duration-300 animate-scale-in">
      <div className="flex gap-2 mb-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-full shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <h4 className="font-semibold text-lg mb-2">{name}</h4>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </div>
  );
};
