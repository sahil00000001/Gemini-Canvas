import { Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ModelToggle } from "./ModelToggle";

interface HeaderProps {
  modelType: "light" | "heavy";
  onModelChange: (value: "light" | "heavy") => void;
  onAboutClick: () => void;
}

export function Header({ modelType, onModelChange, onAboutClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20">
            <div className="absolute inset-0 rounded-lg bg-primary/10 blur-md" />
            <Sparkles className="relative w-6 h-6 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-display font-bold text-foreground" data-testid="text-app-title">
              Design Oracle AI
            </h1>
            <p className="text-xs text-muted-foreground" data-testid="text-app-tagline">
              AI-Powered Design Critique
            </p>
          </div>
        </div>

        <div className="hidden md:block">
          <ModelToggle value={modelType} onChange={onModelChange} />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAboutClick}
            className="gap-2"
            data-testid="button-about"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">About</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="md:hidden border-t border-border/40 py-3 px-4 bg-background/60">
        <ModelToggle value={modelType} onChange={onModelChange} />
      </div>
    </header>
  );
}
