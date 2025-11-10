import { NextResponse } from "next/server";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = "AIzaSyBfUCGjYugwOB__pxqFEzQZfJqRweHWO9s";



const promptMaker = (code: string,) => {
    return `**Code:** ${code}
    
    **Constraints:**
    - Remove all dependency
    - Keep only the logic
    - Code running environment has all the major languges, you can use them
    - Only provide the code, no Explaination or Outputs Expected
    - Write code that only tests logic, create temp variables if needed
    - If possible add time logic and print the execution time
    - Use print statements to compare the expected output and generated output
    - Call the functioanality in loop for testing multiple times
    - ABSOLUTELY NO dependencies, only native functions and variables.
    
    **Desired Outcome:**
    A dependency less code which can be ran on a blank environment

    **Test Code:** `;
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
        var output: string = await run(promptMaker(code));
        console.log(output)
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