// src/app/(learner)/api/gemini-quiz/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request, Request) {
  try {
    // Extract the video summary from the request body
    const { summary } = await request.json();
    console.log("Received summary:", summary); // Debugging: Log the summary

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare the prompt for generating quiz questions
    const prompt = `
      Generate 5 quiz questions based on the following video summary. Each question should have 4 options and a correct answer. Format the response as a JSON array where each question has the following structure:
      {
        "question": "The question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Correct Option"
      }

      Video Summary:
      ${summary}
    `;

    // Generate quiz questions using the Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Preprocess the response to remove Markdown formatting
    const cleanedResponse = response.replace(/```json|```/g, "").trim();

    // Parse the cleaned response into a JSON array
    let questions;
    try {
      questions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      throw new Error("Failed to parse quiz questions. Please try again.");
    }

    // Validate the generated questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No valid quiz questions were generated.");
    }

    // Return the quiz questions
    return NextResponse.json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.error("Error in Gemini quiz API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate quiz questions",
        details: error instanceof Error ? error.toString() : "Unknown error",
      },
      { status: 500 }
    );
  }
}