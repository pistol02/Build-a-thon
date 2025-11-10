"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Split() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const chatContainerRef = useRef(null);

  // Quiz-related state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // Timestamp buttons state
  const [timestamps, setTimestamps] = useState([0, 300, 600, 900, 1200]); // Example timestamps in seconds

  // Auto-scroll chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Function to extract YouTube video ID from URL
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle video link submission
  const handleVideoSubmit = async () => {
    const extractedVideoId = extractVideoId(videoUrl);

    if (!videoUrl || !extractedVideoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setIsVideoPlaying(true);
    setVideoId(extractedVideoId);
    setIsLoading(true);
    setSummary("Analyzing video content...");
    setChatHistory([]);
    setTranscript("");
    setShowTranscript(false);

    try {
      // Fetch transcript
      const transcriptResponse = await fetch(
        `/api/youtube-transcript?videoId=${extractedVideoId}`
      );

      if (!transcriptResponse.ok) {
        throw new Error("Could not fetch video transcript");
      }

      const transcriptData = await transcriptResponse.json();

      if (!transcriptData.transcript?.length) {
        throw new Error("No captions available for this video");
      }

      const formattedTranscript = formatTranscriptBySecond(
        transcriptData.transcript
      );
      setTranscript(formattedTranscript);

      // Generate summary
      const summaryResponse = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: formattedTranscript }),
      });

      const summaryData = await summaryResponse.json();

      if (!summaryData.success) {
        throw new Error(summaryData.error || "Failed to generate summary");
      }

      setSummary(summaryData.summary);

      // Add a welcome message to chatHistory when video is ready
      setChatHistory([
        {
          role: "assistant",
          content:
            "I'm ready to help. What would you like to know about this video?",
        },
      ]);
    } catch (error) {
      console.error("Error processing video:", error);
      setSummary(`Error: ${error.message}`);
      setChatHistory([
        {
          role: "assistant",
          content: `Error: ${error.message}. Please try another video.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format transcript with proper timestamps for every second
  const formatTranscriptBySecond = (transcriptData) => {
    const lastEntry = transcriptData[transcriptData.length - 1];
    const maxDuration = Math.ceil(lastEntry.start + lastEntry.duration);

    const secondBySecond = [];
    for (let i = 0; i <= maxDuration; i++) {
      secondBySecond.push("");
    }

    transcriptData.forEach((item) => {
      const startSec = Math.floor(item.start);
      const endSec = Math.ceil(item.start + item.duration);

      for (let i = startSec; i < endSec && i < secondBySecond.length; i++) {
        secondBySecond[i] = item.text;
      }
    });

    return secondBySecond
      .map((text, seconds) => {
        if (!text) return null;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const timestamp = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

        return `${timestamp} - ${text}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  // Handle file upload (placeholder function)
  const handleFileUpload = () => {
    alert("Google Drive upload feature will be implemented later.");
  };

  // Function to seek YouTube video to a specific timestamp
  const seekToTimestamp = (timestamp) => {
    if (!videoId || !timestamp) return;

    // Update iframe src with start time
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${timestamp}`;
    }
  };

  // Handle chat submission
  const makeQuestion = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsChatLoading(true);
    const userMessage = chatInput.trim();
    setChatInput("");

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Send the request to Gemini API with the user's message and context
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: {
            transcript: transcript,
            summary: summary,
            videoId: videoId,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }

      // Add the assistant's response to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const fetchQuizQuestions = async () => {
    setIsQuizLoading(true);
    try {
      const response = await fetch("/api/gemini-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: summary }),
      });
  
      // Log the raw response
      const rawResponse = await response.text();
      console.log("Raw API response:", rawResponse);
  
      // Parse the response as JSON
      const data = JSON.parse(rawResponse);
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }
  
      setQuizQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      alert("Failed to fetch quiz questions. Please try again.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Load quiz questions
  const loadQuiz = async () => {
    if (!summary) {
      alert("Please generate a video summary first.");
      return;
    }
    await fetchQuizQuestions();
  };

  // Handle user's answer selection
  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  // Calculate the user's score
  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  // Show results when the user submits the quiz
  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  // Handle quiz navigation
  const handleQuizNavigation = (index) => {
    setCurrentQuizIndex(index);
    setUserAnswers({});
    setShowResults(false);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Main layout - first row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left section - Video player (60%) */}
        <div className="lg:w-3/5 space-y-6">
          <section className="bg-white/80 rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-blue-600">Video Player</h2>

            {/* Video source controls */}
            <div className="bg-gray-50 rounded-lg p-4 border border-blue-200">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleFileUpload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Upload to Drive
                </button>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste YouTube URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <button
                    onClick={handleVideoSubmit}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Play
                  </button>
                </div>
              </div>
            </div>

            {/* YouTube video player */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {isVideoPlaying && videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <p>Paste a YouTube URL to play video</p>
                </div>
              )}
            </div>

            {/* Timestamp buttons */}
            <div className="flex gap-2">
              {timestamps.map((timestamp, index) => (
                <button
                  key={index}
                  onClick={() => seekToTimestamp(timestamp)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {`${Math.floor(timestamp / 60)}:${timestamp % 60}`}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right section - Summary (40%) */}
        <div className="lg:w-2/5">
          <section className="bg-white/80 rounded-lg shadow-lg p-6 space-y-4 h-full relative">
            <h2 className="text-2xl font-bold text-blue-600">
              {showTranscript ? "Video Transcript" : "Video Summary"}
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-blue-200 h-96 overflow-y-auto">
              {showTranscript ? (
                <div className="whitespace-pre-line font-mono text-sm">
                  {transcript || "No transcript available"}
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                      <p className="text-gray-500">
                        Analyzing video content...
                      </p>
                    </div>
                  ) : summary ? (
                    <div className="prose prose-blue max-w-none">
                      {summary.split("\n").map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      AI-generated summary will appear here when a video is
                      playing...
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Transcript toggle link */}
            {transcript && (
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="absolute bottom-2 left-6 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {showTranscript ? "View Summary" : "View Transcript"}
              </button>
            )}
          </section>
        </div>
      </div>

      {/* Quiz section */}
      <section className="bg-white/80 rounded-lg shadow-lg p-6 space-y-4 mt-6">
        <h2 className="text-2xl font-bold text-blue-600">Quiz</h2>
        <div className="bg-gray-50 rounded-lg p-4 border border-blue-200 h-96 overflow-y-auto">
          {quizQuestions.length > 0 ? (
            quizQuestions
              .slice(currentQuizIndex * 5, (currentQuizIndex + 1) * 5)
              .map((question, index) => (
                <div key={index} className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleAnswerSelect(index, option)}
                      >
                        <div
                          className={`w-4 h-4 border-2 border-blue-500 rounded-full flex items-center justify-center ${
                            userAnswers[index] === option
                              ? "bg-blue-500"
                              : "bg-transparent"
                          }`}
                        >
                          {userAnswers[index] === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                  {showResults && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Correct answer:</span>{" "}
                      {question.correctAnswer}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-500 italic">
              No quiz questions available. Click "Load Quiz" to start.
            </p>
          )}
        </div>
        <button
          onClick={loadQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
          disabled={isQuizLoading}
        >
          {isQuizLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Loading Quiz...
            </div>
          ) : (
            "Load Quiz"
          )}
        </button>
        {quizQuestions.length > 0 && (
          <button
            onClick={handleSubmitQuiz}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full mt-4"
            disabled={showResults}
          >
            {showResults ? `Your Score: ${calculateScore()} / 5` : "Submit Quiz"}
          </button>
        )}

        {/* Quiz navigation buttons */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              onClick={loadQuiz}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex-1"
            >
              Quiz {index + 1}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}