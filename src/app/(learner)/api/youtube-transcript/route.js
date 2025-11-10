// Create this file at: app/api/youtube-transcript/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    // Use fetch directly to get the captions from YouTube
    // This uses the InnerTube API that YouTube's frontend uses
    
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // Extract the caption track URLs from the page
    const captionTracksMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
    
    if (!captionTracksMatch) {
      return NextResponse.json({ error: 'No captions available for this video' }, { status: 404 });
    }
    
    // Parse the caption tracks JSON
    const captionTracks = JSON.parse(captionTracksMatch[1].replace(/\\"/g, '"'));
    
    // Find the first English track or any track if English is not available
    const track = captionTracks.find(track => track.languageCode === 'en') || captionTracks[0];
    
    if (!track || !track.baseUrl) {
      return NextResponse.json({ error: 'No caption tracks found' }, { status: 404 });
    }
    
    // Fetch the caption file (XML format)
    const captionResponse = await fetch(track.baseUrl);
    const captionXml = await captionResponse.text();
    
    // Parse the XML to extract the captions with timestamps
    const transcript = parseCaptionXml(captionXml);
    
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript', details: error.message },
      { status: 500 }
    );
  }
}

function parseCaptionXml(xml) {
  // Simple regex-based XML parser for caption data
  // Each caption entry looks like: <text start="1.23" dur="4.56">Caption text</text>
  const captionRegex = /<text\s+start="([\d\.]+)"\s+dur="([\d\.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  const transcript = [];
  
  let match;
  while ((match = captionRegex.exec(xml)) !== null) {
    const startTime = parseFloat(match[1]);
    const duration = parseFloat(match[2]);
    // Decode HTML entities in the text
    const text = match[3]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]*>/g, ''); // Remove any HTML tags
    
    transcript.push({
      start: startTime,
      duration,
      text: text.trim()
    });
  }
  
  return transcript;
}