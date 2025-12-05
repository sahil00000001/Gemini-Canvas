import { X, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="modal-about"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      
      <Card
        className="relative z-10 max-w-2xl w-full glass shadow-3d animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
          data-testid="button-close-about"
        >
          <X className="w-5 h-5" />
        </Button>

        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6 animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-500/40 rounded-full blur-xl scale-125" />
              <Avatar className="relative w-32 h-32 border-4 border-primary/30">
                <AvatarFallback className="text-4xl font-display font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                  DO
                </AvatarFallback>
              </Avatar>
            </div>

            <h2 className="text-3xl font-display font-bold text-foreground mb-2" data-testid="text-about-name">
              Design Oracle AI
            </h2>
            
            <p className="text-muted-foreground mb-6" data-testid="text-about-tagline">
              AI-Powered Design Critique
            </p>

            <div className="prose prose-sm dark:prose-invert max-w-md mb-8">
              <p className="text-foreground/80 leading-relaxed" data-testid="text-about-description">
                Design Oracle AI is an advanced design analysis tool powered by Google's Gemini AI models. 
                Upload any design and receive instant, professional-grade feedback on visual hierarchy, 
                typography, color usage, composition, and more.
              </p>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Choose between <strong>Light Mode</strong> (Gemini 2.5 Flash) for quick analyses or 
                <strong> Heavy Duty Mode</strong> (Gemini 2.5 Pro) for deeper, more comprehensive critiques.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button variant="outline" size="sm" data-testid="button-github">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" data-testid="button-linkedin">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" data-testid="button-email">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>

            <div className="w-full pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground" data-testid="text-about-footer">
                Created with passion for design excellence
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Powered by Google Gemini AI
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
