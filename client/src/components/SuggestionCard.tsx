import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
  CheckCircle2,
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

  const Icon = iconMap[card.icon] || Eye;
  const colorClass = colorClasses[card.color] || colorClasses.violet;

  const isScore = card.category === "score";
  const isImprovements = card.category === "improvements";
  const needsTruncation = typeof card.content === "string" && card.content.length > 200;

  return (
    <motion.div
      className={`card-3d ${card.span === 2 ? "col-span-1 md:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      data-testid={`card-suggestion-${card.category}`}
    >
      <Card
        className={`
          h-full overflow-visible
          bg-gradient-to-br ${colorClass}
          glass
          cursor-pointer
          hover-elevate
          transition-all duration-300
        `}
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
            <ul className="space-y-4">
              {(card.content as string[]).map((improvement, idx) => (
                <motion.li 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-border/30 hover:border-primary/40 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-display font-semibold bg-primary/10 text-primary border-primary/20"
                      >
                        Priority {idx + 1}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90" data-testid={`text-improvement-${idx + 1}`}>
                      {improvement}
                    </p>
                  </div>
                </motion.li>
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
    </motion.div>
  );
}
