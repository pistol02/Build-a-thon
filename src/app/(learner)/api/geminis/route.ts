import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyBfUCGjYugwOB__pxqFEzQZfJqRweHWO9s');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between requests

export async function getEnvironmentalInsights(stats: {
  dataTransferred: number;
  timeSpent: number;
  totalCarbon: number;
}) {
  try {
    // Check if enough time has passed since last request
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return "Please wait a moment before requesting new insights...";
    }
    
    lastRequestTime = now;

    const prompt = `
      Analyze the following browser usage statistics and provide environmental insights:
      - Data transferred: ${stats.dataTransferred.toFixed(2)} GB
      - Time spent: ${stats.timeSpent.toFixed(2)} hours
      - Total carbon footprint: ${stats.totalCarbon.toFixed(4)} kg CO₂

      Please provide:
      1. Equivalent everyday activities with similar carbon impact
      2. Tips to reduce digital carbon footprint
      3. Projected annual impact if usage remains consistent
      4. Comparison to average user's digital carbon footprint

      Format the response in clear sections with bullet points.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting Gemini insights:', error);
    if (error.toString().includes('429')) {
      return "API rate limit reached. Please try again later. In the meantime, consider:\n\n" +
             "• Reducing video streaming quality\n" +
             "• Closing unused tabs\n" +
             "• Using browser caching\n" +
             "• Enabling data saver mode in your browser";
    }
    return 'Unable to generate environmental insights at this time.';
  }
}