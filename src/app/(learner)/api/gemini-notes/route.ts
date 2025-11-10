import { NextResponse } from 'next/server';

// Declare global variables to store latest transcript
declare global {
  var latestTranscript: string | null;
  var latestVideoInfo: any | null;
}

export async function POST(req: Request) {
  try {
    const { transcript, videoId, videoUrl } = await req.json();

    // Store the latest transcript globally
    global.latestTranscript = transcript;
    global.latestVideoInfo = { videoId, videoUrl };

    return NextResponse.json({
      success: true,
      message: 'Transcript received and stored'
    });
  } catch (error) {
    console.error('Error storing transcript:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to store transcript'
    }, { status: 500 });
  }
}