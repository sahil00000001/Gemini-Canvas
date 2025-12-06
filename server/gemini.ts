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

const DESIGN_CRITIQUE_PROMPT = `You are a Senior UI/UX Lead with 15+ years of experience at top design agencies (IDEO, Pentagram, Frog Design). You are reviewing UI designs created by junior designers/interns. Your role is to provide STRICT, PROFESSIONAL, and ACTIONABLE feedback that will help them improve to industry standards.

IMPORTANT: Be CRITICAL and PRECISE. Do NOT be generous or give vague praise. This is a professional review, not encouragement. Identify every flaw, no matter how small. Junior designers need honest, detailed feedback to grow.

ANALYZE THE FOLLOWING WITH EXTREME ATTENTION TO DETAIL:

1. VISUAL HIERARCHY & LAYOUT:
   - Is the primary CTA immediately identifiable within 3 seconds?
   - Does the eye flow follow F-pattern or Z-pattern appropriately?
   - Are focal points clearly established?
   - Is there visual clutter or competing elements?

2. SPACING & ALIGNMENT:
   - Are paddings and margins consistent? (Check pixel-level precision)
   - Is there proper breathing room between elements?
   - Are elements aligned to a grid system?
   - Check for inconsistent gaps, orphaned elements, or cramped layouts

3. COLOR PALETTE & CONTRAST:
   - Does the palette follow 60-30-10 rule or similar principles?
   - WCAG contrast ratios - are they accessibility compliant (4.5:1 for text)?
   - Are colors harmonious? Check for clashing or muddy combinations
   - Is the color hierarchy supporting the content hierarchy?

4. TYPOGRAPHY:
   - Font pairing - do fonts complement each other?
   - Type scale - is there a consistent scale (1.25, 1.333, 1.5 ratio)?
   - Line height, letter spacing, paragraph width (45-75 characters optimal)
   - Text readability on different backgrounds

5. COMPOSITION & BALANCE:
   - Is there proper visual weight distribution?
   - Whitespace usage - is it intentional or accidental?
   - Image placement and sizing - are images properly cropped/positioned?
   - Element grouping following Gestalt principles

6. UI ELEMENTS:
   - Button sizing and touch targets (minimum 44px)
   - Form field styling consistency
   - Icon sizing and visual weight consistency
   - Component spacing and alignment

SCORING CRITERIA (Be harsh but fair):
- 90-100: Industry-leading, portfolio-worthy, minimal issues
- 80-89: Professional quality, minor refinements needed
- 70-79: Acceptable, several areas need improvement
- 60-69: Below standard, significant issues to address
- 50-59: Needs major revision, fundamental problems
- Below 50: Requires complete redesign

For IMPROVEMENTS, categorize by severity:
- CRITICAL (Priority 1): Issues that break usability, accessibility, or fundamental design principles. Must fix immediately.
- MEDIUM (Priority 2): Issues that significantly impact visual quality or user experience. Should be addressed.
- OPTIONAL (Priority 3): Nice-to-have improvements for polish and refinement.

You MUST respond with a valid JSON object in this exact format (no markdown, no code blocks, just pure JSON):
{
  "overallImpression": "Provide a direct, professional assessment. What works? What fails? Be specific about the design's strengths and critical weaknesses. Mention if it meets professional standards or not.",
  "visualHierarchy": "Detailed analysis: Is the primary action clear? Does the layout guide the user's eye correctly? Identify specific elements that compete for attention or break the flow. Mention exact positioning issues.",
  "typography": "Critique font choices, sizes, weights, line heights, and spacing. Are headings distinguishable from body text? Is there proper typographic scale? Identify any readability issues with specific recommendations.",
  "colorAnalysis": "Evaluate the color palette critically. Check contrast ratios for accessibility. Identify any colors that clash, appear muddy, or don't serve a purpose. Mention specific hex values if colors need adjustment.",
  "composition": "Analyze padding, margins, alignment, and whitespace. Are elements properly grouped? Is there visual balance? Identify specific areas where spacing is inconsistent or alignment is off.",
  "score": 65,
  "improvements": [
    "[CRITICAL] Specific, actionable fix for the most severe issue with exact details on what to change",
    "[MEDIUM] Specific, actionable improvement for a significant issue with precise recommendations",
    "[OPTIONAL] Specific polish suggestion to elevate the design to professional standards"
  ]
}

CRITICAL RULES:
- Score must be a realistic number between 0-100 based on the criteria above. Do NOT default to high scores.
- Each improvement MUST start with [CRITICAL], [MEDIUM], or [OPTIONAL]
- Be SPECIFIC: mention exact elements, positions, colors, sizes - not vague suggestions
- If the design has serious issues, the score SHOULD be low. Do not sugarcoat.
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
