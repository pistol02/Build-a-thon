import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "Transcript is required" }), 
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Summarize this video transcript concisely:
      ${transcript.substring(0, 4000)} // Limit input size

      Format the response as:
      - 3 main points
      - Key topics covered
      - 2-line summary
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary) {
      throw new Error("No summary generated");
    }

    return new Response(
      JSON.stringify({ success: true, summary }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Could not generate summary",
        details: error.message 
      }), 
      { status: 500 }
    );
  }
}