export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const API_KEY = process.env.CAPTIONS_API_KEY;
  
    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API Key" });
    }
  
    try {
      const response = await fetch("https://api.captions.ai/api/creator/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ error: errorData.detail || "API request failed" });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }
  