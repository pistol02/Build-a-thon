import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Return empty if no data is available
    if (!global.latestTranscript) {
      return NextResponse.json({
        success: true,
        transcript: null,
        videoInfo: null
      });
    }

    return NextResponse.json({
      success: true,
      transcript: global.latestTranscript,
      videoInfo: global.latestVideoInfo
    });
  } catch (error) {
    console.error('Error fetching latest transcript:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch latest transcript'
    }, { status: 500 });
  }
}