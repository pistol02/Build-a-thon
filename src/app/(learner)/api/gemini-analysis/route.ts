import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create the analysis prompt
    const prompt = `
      Analyze the following video transcript and provide a detailed description 
      that includes:
      
      1. Main ideas and key concepts
      2. Important points and takeaways
      3. Summary of the overall message
      4. Any actionable insights or recommendations
      
      Format the response in HTML with proper headings (h2, h3) and paragraphs.
      Make it well-structured and easy to read.
      
      Here's the transcript to analyze:
      ${transcript}
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the analysis
    return NextResponse.json({
      success: true,
      content: text
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to analyze transcript",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}