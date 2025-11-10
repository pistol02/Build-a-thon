// /api/gemini-chat/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { message, context } = await request.json();
    
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Prepare the chat context
    let systemPrompt = "You are a helpful assistant that analyzes videos and answers questions about them.";
    
    // Add video context if available
    if (context?.transcript) {
      systemPrompt += "\n\nHere is the transcript of the video:";
      systemPrompt += "\n" + context.transcript.substring(0, 10000); // Limit length if needed
    }
    
    if (context?.summary) {
      systemPrompt += "\n\nHere is a summary of the video:";
      systemPrompt += "\n" + context.summary;
    }
    
    if (context?.videoId) {
      systemPrompt += `\n\nThis is for YouTube video with ID: ${context.videoId}`;
    }
    
    systemPrompt += "\n\nWhen referring to specific parts of the video, include timestamps in the format HH:MM:SS that the user can click to navigate to those moments.";
    
    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "I'm going to ask questions about a video. Please help me understand it better." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll do my best to help you understand the video content based on the transcript and summary provided." }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });
    
    // Send the message with context
    const result = await chat.sendMessage([
      { text: systemPrompt },
      { text: message }
    ]);
    
    const response = result.response.text();
    
    return Response.json({
      success: true,
      response: response
    });
    
  } catch (error) {
    console.error("Error in Gemini chat API:", error);
    return Response.json({
      success: false,
      error: error.message || "Failed to process chat request",
      details: error.toString()
    }, { status: 500 });
  }
}