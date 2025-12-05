import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Layers,
  Type,
  Palette,
  Layout,
  Star,
  ArrowUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SuggestionCard as SuggestionCardType } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  Eye,
  Layers,
  Type,
  Palette,
  Layout,
  Star,
  ArrowUp,
};

const colorClasses: Record<string, string> = {
  violet: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  amber: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  pink: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  gold: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  red: "from-red-500/20 to-orange-500/20 border-red-500/30",
};

interface SuggestionCardProps {
  card: SuggestionCardType;
  index: number;
}

export function SuggestionCard({ card, index }: SuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1, shadow: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const Icon = iconMap[card.icon] || Eye;
  const colorClass = colorClasses[card.color] || colorClasses.violet;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 15;
    const tiltY = (x - 0.5) * -15;
    
    setTilt({
      x: tiltX,
      y: tiltY,
      scale: 1.02,
      shadow: 30,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, scale: 1, shadow: 0 });
  }, []);

  const isScore = card.category === "score";
  const isImprovements = card.category === "improvements";
  const needsTruncation = typeof card.content === "string" && card.content.length > 200;

  return (
    <div
      ref={cardRef}
      className={`card-3d ${card.span === 2 ? "col-span-1 md:col-span-2" : ""}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`card-suggestion-${card.category}`}
    >
      <Card
        className={`
          h-full overflow-visible
          bg-gradient-to-br ${colorClass}
          glass
          cursor-pointer
          will-change-transform
        `}
        style={{
          transform: `
            perspective(1000px) 
            rotateX(${tilt.x}deg) 
            rotateY(${tilt.y}deg) 
            scale(${tilt.scale})
            translateZ(${isHovered ? 20 : 0}px)
          `,
          boxShadow: isHovered 
            ? `0 ${10 + tilt.shadow}px ${30 + tilt.shadow}px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)`
            : `0 4px 12px rgba(0, 0, 0, 0.1)`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out",
        }}
        onClick={() => !isScore && setIsExpanded(!isExpanded)}
      >
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="p-2 rounded-lg bg-background/50">
            <Icon className="w-5 h-5 text-foreground" />
          </div>
          <CardTitle className="text-lg font-display font-semibold" data-testid={`text-card-title-${card.category}`}>
            {card.title}
          </CardTitle>
          {needsTruncation && !isScore && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {isScore ? (
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
                <span 
                  className="relative text-7xl font-display font-bold bg-gradient-to-br from-primary to-purple-400 bg-clip-text text-transparent"
                  data-testid="text-score-value"
                >
                  {card.content}
                </span>
                <span className="text-2xl font-display text-muted-foreground ml-1">/100</span>
              </div>
            </div>
          ) : isImprovements ? (
            <ul className="space-y-3">
              {(card.content as string[]).map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Badge 
                    variant="outline" 
                    className="min-w-[24px] h-6 flex items-center justify-center font-display font-bold shrink-0"
                  >
                    {idx + 1}
                  </Badge>
                  <span className="text-sm leading-relaxed" data-testid={`text-improvement-${idx + 1}`}>
                    {improvement}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p 
              className={`text-sm leading-relaxed ${
                !isExpanded && needsTruncation ? "line-clamp-4" : ""
              }`}
              data-testid={`text-card-content-${card.category}`}
            >
              {card.content as string}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
