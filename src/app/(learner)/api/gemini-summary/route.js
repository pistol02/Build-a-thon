// File path: app/api/gemini-summary/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI API with your API key
// Make sure to use environment variables in production
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript) {
      return Response.json({ 
        success: false, 
        error: "Transcript is required" 
      }, { status: 400 });
    }
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Create prompt for summary generation
    const prompt = `
      You are an AI assistant that creates concise, informative summaries of video content.
      
      Below is a transcript of a video with timestamps. Please create a clear, well-structured summary of the video content that:
      1. Identifies the main topics and key points
      2. Organizes information logically
      3. Is around 250-300 words
      4. Uses bullet points for key takeaways if appropriate
      
      Here is the transcript:
      
      ${transcript}
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    
    return Response.json({ 
      success: true, 
      summary 
    });
    
  } catch (error) {
    console.error("Gemini Summary API error:", error);
    return Response.json({ 
      success: false, 
      error: error.message || "Failed to generate summary" 
    }, { status: 500 });
  }
}