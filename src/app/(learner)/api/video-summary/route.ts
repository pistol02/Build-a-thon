import { NextResponse } from "next/server";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-2.5-flash"; 
const API_KEY = "AIzaSyA2O-4SgQB5NSuF3MhmHNfoDvdGraVr3fE";

// Function to create a summary prompt for a video
const promptMaker = (videoUrl: string) => {
    return `**Video Analysis Request**
    
    **Video URL:** ${videoUrl}

    **Task:** 
    - Summarize the key points of the video.
    - Provide a concise, structured summary.
    - Highlight any important events or concepts.

    **Summary:** `;
};

async function run(text: string) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const parts: object[] = [{ text: text }];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    return response.text();
}

export async function GET(request: any) {
    try {
        // Extract the video URL from the query parameter
        const videoUrl = request.nextUrl.searchParams.get("videoUrl");

        if (!videoUrl) {
            return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
        }

        console.log("Processing Video Summary for:", videoUrl);
        
        const summary = await run(promptMaker(videoUrl));

        return NextResponse.json({ summary }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
