import { SuggestionCard } from "./SuggestionCard";
import { motion } from "framer-motion";
import type { DesignCritique, SuggestionCard as SuggestionCardType } from "@shared/schema";

interface SuggestionsGridProps {
  critique: DesignCritique | null;
  isLoading: boolean;
}

function createSuggestionCards(critique: DesignCritique): SuggestionCardType[] {
  return [
    {
      id: "overall",
      category: "overallImpression",
      title: "Overall Impression",
      content: critique.overallImpression,
      icon: "Eye",
      color: "violet",
      span: 2,
    },
    {
      id: "hierarchy",
      category: "visualHierarchy",
      title: "Visual Hierarchy",
      content: critique.visualHierarchy,
      icon: "Layers",
      color: "blue",
      span: 1,
    },
    {
      id: "typography",
      category: "typography",
      title: "Typography",
      content: critique.typography,
      icon: "Type",
      color: "amber",
      span: 1,
    },
    {
      id: "color",
      category: "colorAnalysis",
      title: "Color Analysis",
      content: critique.colorAnalysis,
      icon: "Palette",
      color: "pink",
      span: 1,
    },
    {
      id: "composition",
      category: "composition",
      title: "Composition & Layout",
      content: critique.composition,
      icon: "Layout",
      color: "emerald",
      span: 1,
    },
    {
      id: "score",
      category: "score",
      title: "Design Score",
      content: critique.score,
      icon: "Star",
      color: "gold",
      span: 2,
    },
    {
      id: "improvements",
      category: "improvements",
      title: "Top 3 Priority Improvements",
      content: critique.improvements,
      icon: "ArrowUp",
      color: "red",
      span: 2,
    },
  ];
}

function SkeletonCard({ span = 1, height = "h-40" }: { span?: number; height?: string }) {
  return (
    <div className={`${span === 2 ? "col-span-1 md:col-span-2" : ""}`}>
      <div className={`${height} rounded-xl shimmer`} />
    </div>
  );
}

export function SuggestionsGrid({ critique, isLoading }: SuggestionsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6" data-testid="grid-suggestions-loading">
        <SkeletonCard span={2} height="h-32" />
        <SkeletonCard height="h-48" />
        <SkeletonCard height="h-48" />
        <SkeletonCard height="h-48" />
        <SkeletonCard height="h-48" />
        <SkeletonCard span={2} height="h-40" />
        <SkeletonCard span={2} height="h-48" />
      </div>
    );
  }

  if (!critique) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center" data-testid="empty-suggestions">
        <div className="relative p-8 rounded-full bg-gradient-to-br from-muted to-accent/30 mb-6 animate-float">
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl" />
          <svg
            className="relative w-16 h-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground mb-2" data-testid="text-empty-title">
          Ready to Analyze
        </h3>
        <p className="text-muted-foreground max-w-sm" data-testid="text-empty-description">
          Upload a design to get AI-powered feedback with detailed suggestions for improvement
        </p>
      </div>
    );
  }

  const cards = createSuggestionCards(critique);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6" 
      data-testid="grid-suggestions"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div key={card.id} variants={itemVariants}>
          <SuggestionCard card={card} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}
