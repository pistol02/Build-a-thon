// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeText(text: string): Promise<string> {
  try {
    // Use the correct model name - using gemini-2.5-flash for advanced capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(text);
    const response = await result.response;
    const textResponse = response.text();
    
    return textResponse;
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    throw new Error(`Failed to analyze text with Gemini API: ${error.message}`);
  }
}