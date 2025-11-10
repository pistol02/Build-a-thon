import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/ui/SearchBar';

// Import AR component dynamically to avoid SSR issues
const ARScene = dynamic(() => import('@/components/ui/ARScene'), { ssr: false });

// Mock video data to avoid API dependency
const MOCK_VIDEOS = {
  "mathematics": "JbhBdOfMEPs",
  "physics": "FRD2_RNcbPo",
  "chemistry": "FSyAehMdpyI",
  "biology": "QnQe0xW_JY4",
  "history": "Yocja_N5s1I",
  "literature": "cjW5A3vsl5A",
  "computer science": "zOjov-2OZ0E",
  "programming": "zOjov-2OZ0E",
  "art": "oJVYlrVUe_8",
  "music": "vcBn04IyELc",
  "default": "EWa3EIz5cLQ"
};

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [arEnabled, setArEnabled] = useState<boolean>(false);

  const handleSearch = async (searchTopic: string) => {
    setIsLoading(true);
    setError(null);
    setTopic(searchTopic);
    
    try {
      // Instead of fetching from API, use our mock data
      setTimeout(() => {
        const lowerTopic = searchTopic.toLowerCase();
        
        // Find the closest matching topic or use default
        const matchedTopic = Object.keys(MOCK_VIDEOS).find(key => 
          lowerTopic.includes(key) || key.includes(lowerTopic)
        ) || "default";
        
        const id = MOCK_VIDEOS[matchedTopic as keyof typeof MOCK_VIDEOS] || MOCK_VIDEOS.default;
        setVideoId(id);
        setIsLoading(false);
      }, 800); // Simulate API delay
      
    } catch (err) {
      setError('Failed to fetch video. Please try again.');
      setVideoId(null);
      setIsLoading(false);
    }
  };

  const startAR = () => {
    if (!videoId) {
      setError('Please search for a topic first to load a video.');
      return;
    }
    setArEnabled(true);
  };

  const exitAR = () => {
    setArEnabled(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>AR/VR Classroom</title>
        <meta name="description" content="Learn with AR/VR using YouTube videos" />
        <link rel="icon" href="/favicon.ico" />
        {/* Include AR.js and related scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ar.js/3.3.1/ar.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      </Head>

      <main className="container mx-auto px-4 py-8">
        {!arEnabled ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">AR/VR Educational Classroom</h1>
            
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {videoId && !isLoading && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Video Preview for: {topic}</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 md:h-96"
                  ></iframe>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={startAR}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Enter AR Classroom
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={exitAR}
              className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Exit AR
            </button>
            <ARScene videoId={videoId} topic={topic} />
          </div>
        )}
      </main>
    </div>
  );
}