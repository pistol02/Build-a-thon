import { NextResponse } from "next/server";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = "AIzaSyBfUCGjYugwOB__pxqFEzQZfJqRweHWO9s";



const promptMaker = (code: string, inputSchema: string, outputSchema: string) => {
    return `**Code:** ${code}
    
    **Desired Outcome:**
    - Explain the code in minimum words
    - Explain what it does, and how it does
    - Show sample inputs or outputs
    - Explain for a fresher
    
    **Input Schema:** ${inputSchema}
    **Output Schema:** ${outputSchema}

    **Explaination:** `;
}

async function run(text: string) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
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

    const parts: object[] = [{ text: text },];

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
        // Extract text from the query parameter
        const code = request.nextUrl.searchParams.get("code");
        const inputSchema = request.nextUrl.searchParams.get("inputSchema");
        const outputSchema = request.nextUrl.searchParams.get("outputSchema");


        console.log(code, inputSchema, outputSchema)
        var output: string = await run(promptMaker(code, inputSchema, outputSchema));

        return NextResponse.json({ explaination: output }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        // Return an error response if there's an issue
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}