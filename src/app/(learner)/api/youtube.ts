import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  videoId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { topic } = req.query;
  
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Topic parameter is required' });
  }
  
  try {
    // Replace with your actual YouTube API key
    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(topic)}+educational&type=video&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: 'Error fetching from YouTube API' });
    }
    
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      return res.status(200).json({ videoId });
    } else {
      return res.status(404).json({ error: 'No videos found for this topic' });
    }
  } catch (error) {
    console.error('YouTube API error:', error);
    return res.status(500).json({ error: 'Failed to fetch video from YouTube' });
  }
}
