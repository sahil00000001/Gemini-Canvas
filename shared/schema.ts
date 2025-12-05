import { z } from "zod";

// Design Critique Response Schema
export const designCritiqueSchema = z.object({
  overallImpression: z.string(),
  visualHierarchy: z.string(),
  typography: z.string(),
  colorAnalysis: z.string(),
  composition: z.string(),
  score: z.number().min(0).max(100),
  improvements: z.array(z.string()).max(3),
});

export type DesignCritique = z.infer<typeof designCritiqueSchema>;

// Analysis Request Schema
export const analyzeRequestSchema = z.object({
  imageData: z.string(), // Base64 encoded image
  modelType: z.enum(["heavy", "light"]),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

// Analysis Response Schema
export const analyzeResponseSchema = z.object({
  success: z.boolean(),
  critique: designCritiqueSchema.optional(),
  error: z.string().optional(),
  modelUsed: z.string(),
  processingTime: z.number(),
});

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;

// Card Category Types
export type CardCategory = 
  | "overallImpression"
  | "visualHierarchy"
  | "typography"
  | "colorAnalysis"
  | "composition"
  | "score"
  | "improvements";

export interface SuggestionCard {
  id: string;
  category: CardCategory;
  title: string;
  content: string | number | string[];
  icon: string;
  color: string;
  span: 1 | 2;
}

// User schema (keeping existing for compatibility)
export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
