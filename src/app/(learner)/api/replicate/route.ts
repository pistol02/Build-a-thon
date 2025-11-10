import Replicate from "replicate";
import { NextResponse } from "next/server";

const REPLICATE_API_TOKEN = ""

const promptMaker = (changes: string, inputSchema: string, outputSchema: string, dataSources: string) => {
    return `**Prompt:** ${changes}
    
    **Constraints:**
    - Write Correct code
    - Code should be optimised and contain minimum lines of code.
    - Include clear and concise comments or docstrings to explain the code's logic.
    - Code should be production ready.
    - Strictly follow the schemas for input and output.
    
    **Desired Outcome:**
    A WORKING code snippet that is works out of the box
    
    **Input Schema:** ${inputSchema}
    **Output Schema:** ${outputSchema}

    **Data Sources:** ${dataSources}

    **Generated Code:** `;
}

const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN
});
async function run(text: string) {
    const output: string[] | any = await replicate.run(
        "meta/codellama-70b-instruct:a279116fe47a0f65701a8817188601e2fe8f4b9e04a518789655ea7b995851bf",
        {
            input: {
                top_k: 10,
                top_p: 0.95,
                prompt: text,
                max_tokens: 500,
                temperature: 0.8,
                system_prompt: "",
                repeat_penalty: 1.1,
                presence_penalty: 0,
                frequency_penalty: 0
            }
        }
    );
    return output.join(" ");
}

export async function GET(request: any) {
    try {
        // Extract text from the query parameter
        const changes = request.nextUrl.searchParams.get("changes");
        const inputSchema = request.nextUrl.searchParams.get("inputSchema");
        const outputSchema = request.nextUrl.searchParams.get("outputSchema");
        const dataSources = request.nextUrl.searchParams.get("dataSources");


        console.log(changes, inputSchema, outputSchema, dataSources)
        var output: string = await run(promptMaker(changes, inputSchema, outputSchema, dataSources));
        var outputAsArray = output.split("\n");
        var genLang = outputAsArray[0].replace('`', "")
        var genCode = outputAsArray.slice(1, -1).join("\n");
        return NextResponse.json({ code: genCode, language: genLang }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        // Return an error response if there's an issue
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}