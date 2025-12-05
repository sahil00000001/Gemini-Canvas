import { GoogleGenAI } from "@google/genai";
import type { DesignCritique } from "@shared/schema";

if (!process.env.GEMINI_API_KEY) {
  console.warn("Warning: GEMINI_API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const AVAILABLE_MODELS = {
  heavy: "gemini-2.5-pro",
  light: "gemini-2.5-flash",
} as const;

const DESIGN_CRITIQUE_PROMPT = `You are a professional graphic design critic with deep expertise in visual design principles. Analyze this design image and provide detailed, constructive feedback.

You MUST respond with a valid JSON object in this exact format (no markdown, no code blocks, just pure JSON):
{
  "overallImpression": "2-3 sentences describing your first impression and emotional response, plus how well it fits the apparent target audience",
  "visualHierarchy": "Analysis of whether the most important element is immediately clear and if the eye flows naturally through the design",
  "typography": "Evaluation of font choices - are they appropriate for the message? Assessment of readability and consistency",
  "colorAnalysis": "Does the color palette work well together? Any accessibility concerns with contrast?",
  "composition": "Analysis of balance, visual weight, use of whitespace, and alignment",
  "score": 75,
  "improvements": ["First specific, actionable improvement", "Second specific, actionable improvement", "Third specific, actionable improvement"]
}

Important:
- The score must be a number between 0 and 100
- The improvements array must contain exactly 3 items
- Be specific and constructive in all feedback
- Consider both aesthetic and functional aspects of the design
- Respond ONLY with the JSON object, no additional text`;

function parseJsonResponse(text: string): DesignCritique {
  let jsonText = text.trim();
  
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.slice(3);
  }
  
  if (jsonText.endsWith("```")) {
    jsonText = jsonText.slice(0, -3);
  }
  
  jsonText = jsonText.trim();
  
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonText = jsonMatch[0];
  }
  
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${e instanceof Error ? e.message : "Unknown error"}`);
  }
}

function validateCritique(critique: Partial<DesignCritique>): DesignCritique {
  const validated: DesignCritique = {
    overallImpression: critique.overallImpression || "Unable to analyze overall impression.",
    visualHierarchy: critique.visualHierarchy || "Unable to analyze visual hierarchy.",
    typography: critique.typography || "Unable to analyze typography.",
    colorAnalysis: critique.colorAnalysis || "Unable to analyze colors.",
    composition: critique.composition || "Unable to analyze composition.",
    score: 50,
    improvements: [],
  };
  
  if (typeof critique.score === "number") {
    validated.score = Math.max(0, Math.min(100, Math.round(critique.score)));
  } else if (typeof critique.score === "string") {
    const parsed = parseInt(critique.score, 10);
    validated.score = isNaN(parsed) ? 50 : Math.max(0, Math.min(100, parsed));
  }
  
  if (Array.isArray(critique.improvements)) {
    validated.improvements = critique.improvements
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .slice(0, 3);
  }
  
  while (validated.improvements.length < 3) {
    validated.improvements.push("Consider seeking additional feedback on this design.");
  }
  
  return validated;
}

export async function analyzeDesign(
  imageBase64: string,
  modelType: "heavy" | "light"
): Promise<{ critique: DesignCritique; modelUsed: string; processingTime: number }> {
  const startTime = Date.now();
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured. Please add your API key to use design analysis.");
  }
  
  const modelName = AVAILABLE_MODELS[modelType];
  
  if (!imageBase64 || !imageBase64.includes("base64")) {
    throw new Error("Invalid image data provided.");
  }
  
  const base64Data = imageBase64.includes(",") 
    ? imageBase64.split(",")[1] 
    : imageBase64;

  let mimeType = "image/jpeg";
  if (imageBase64.includes("image/png")) {
    mimeType = "image/png";
  } else if (imageBase64.includes("image/webp")) {
    mimeType = "image/webp";
  } else if (imageBase64.includes("image/gif")) {
    mimeType = "image/gif";
  }

  try {
    console.log(`Analyzing design with model: ${modelName}`);
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: DESIGN_CRITIQUE_PROMPT,
            },
          ],
        },
      ],
    });

    const responseText = response.text;
    
    if (!responseText || responseText.trim().length === 0) {
      throw new Error("Received empty response from AI model.");
    }
    
    console.log("Raw AI response received, parsing...");
    
    const parsedCritique = parseJsonResponse(responseText);
    const critique = validateCritique(parsedCritique);
    
    const processingTime = Date.now() - startTime;
    console.log(`Analysis completed in ${processingTime}ms with score: ${critique.score}`);

    return {
      critique,
      modelUsed: modelName,
      processingTime,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("quota") || error.message.includes("rate")) {
        throw new Error("API rate limit reached. Please try again later or switch to Light mode.");
      }
      if (error.message.includes("invalid") || error.message.includes("API key")) {
        throw new Error("Invalid API key. Please check your Gemini API configuration.");
      }
      if (error.message.includes("model")) {
        throw new Error(`Model ${modelName} is not available. Please try the other mode.`);
      }
      throw error;
    }
    
    throw new Error("Failed to analyze design. Please try again.");
  }
}
