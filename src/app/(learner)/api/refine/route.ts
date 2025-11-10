import { NextResponse } from "next/server";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = "AIzaSyBfUCGjYugwOB__pxqFEzQZfJqRweHWO9s";



const promptMaker = (code: string, changes: string, inputSchema: string, outputSchema: string, dataSources: string) => {
    return `**Code:** ${code}
    **Changes:** ${changes}
    
    **Constraints:**
    - Refine the give code and perform the given changes.
    - Ensure the code is well-structured and bug-free.
    - Include clear and concise comments or docstrings to explain the code's logic.
    - Code should be production ready.
    - Strictly follow the schemas for input and output.
    
    **Desired Outcome:**
    A WORKING code snippet that is improved version of the given code with implementing the given changes
    
    **Input Schema:** ${inputSchema}
    **Output Schema:** ${outputSchema}

    **Data Sources:** ${dataSources}

    **Updated Code:** `;
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
        const changes = request.nextUrl.searchParams.get("changes");
        const inputSchema = request.nextUrl.searchParams.get("inputSchema");
        const outputSchema = request.nextUrl.searchParams.get("outputSchema");
        const dataSources = request.nextUrl.searchParams.get("dataSources");


        console.log(code, changes, inputSchema, outputSchema, dataSources)
        var output: string = await run(promptMaker(code, changes, inputSchema, outputSchema, dataSources));
        var outputAsArray = output.split("\n");
        var genLang = outputAsArray[0].replaceAll("`", "")
        var genCode = outputAsArray.slice(1, -1).join("\n");
        return NextResponse.json({ code: genCode, language: genLang }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        // Return an error response if there's an issue
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}