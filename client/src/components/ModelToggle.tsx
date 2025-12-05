import { useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModelToggleProps {
  value: "light" | "heavy";
  onChange: (value: "light" | "heavy") => void;
}

export function ModelToggle({ value, onChange }: ModelToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onChange(value === "light" ? "heavy" : "light");
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            value === "light"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }`}
          data-testid="button-model-light"
        >
          <Sparkles className="w-4 h-4" />
          <span>Light</span>
        </button>

        <button
          onClick={handleToggle}
          className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
            value === "heavy"
              ? "bg-primary glow"
              : "bg-muted"
          }`}
          data-testid="button-model-toggle"
          aria-label={`Currently using ${value === "heavy" ? "Heavy Duty" : "Light"} mode`}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
              isAnimating ? "scale-110" : "scale-100"
            } ${
              value === "heavy" ? "left-9" : "left-1"
            }`}
          />
        </button>

        <button
          onClick={() => onChange("heavy")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            value === "heavy"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          data-testid="button-model-heavy"
        >
          <Zap className="w-4 h-4" />
          <span>Heavy Duty</span>
        </button>
      </div>

      {value === "heavy" && (
        <Badge variant="secondary" className="text-xs animate-in fade-in slide-in-from-top-1" data-testid="badge-request-limit">
          <Zap className="w-3 h-3 mr-1" />
          25 requests/day limit
        </Badge>
      )}
    </div>
  );
}
