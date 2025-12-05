import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeDesign } from "./gemini";
import { analyzeRequestSchema } from "@shared/schema";
import type { AnalyzeResponse } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const parseResult = analyzeRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const response: AnalyzeResponse = {
          success: false,
          error: "Invalid request data: " + parseResult.error.message,
          modelUsed: "",
          processingTime: 0,
        };
        return res.status(400).json(response);
      }

      const { imageData, modelType } = parseResult.data;

      if (!imageData || !imageData.startsWith("data:image")) {
        const response: AnalyzeResponse = {
          success: false,
          error: "Invalid image data. Please upload a valid image.",
          modelUsed: "",
          processingTime: 0,
        };
        return res.status(400).json(response);
      }

      const result = await analyzeDesign(imageData, modelType);

      const response: AnalyzeResponse = {
        success: true,
        critique: result.critique,
        modelUsed: result.modelUsed,
        processingTime: result.processingTime,
      };

      return res.json(response);
    } catch (error) {
      console.error("Analysis error:", error);
      
      const response: AnalyzeResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze design",
        modelUsed: "",
        processingTime: 0,
      };
      
      return res.status(500).json(response);
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
