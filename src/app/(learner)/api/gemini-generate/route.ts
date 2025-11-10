import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const generatePrompt = (type: string, content: string) => {
  const prompts = {
    'Study Guide': `Create a concise study guide for the following content. Format with:
      - Key points to remember
      - Main concepts
      - Quick references
      Content: ${content}`,
    
    'FAQ': `Generate 3-4 most important FAQ questions and answers for:
      ${content}`,
    
    'Timeline': `Create a brief timeline of main events/steps from:
      ${content}`,
    
    'Summary': `Provide a concise summary with key takeaways from:
      ${content}`,
  };

  return prompts[type] || prompts['Summary'];
};

export async function POST(req: Request) {
  try {
    const { type, content } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = generatePrompt(type, content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      success: true, 
      response: text,
      type: type
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}