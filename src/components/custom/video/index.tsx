"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <p className="text-gray-500">Loading graph visualization...</p>
    </div>
  ),
});

export default function VideoSection() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string; hasTimestamps?: boolean }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Graph state and refs
  const [graphData, setGraphData] = useState({ nodes: [] as any[], links: [] as any[] });
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const graphRef = useRef<any>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 380 });

  useEffect(() => {
    const currentContainer = graphContainerRef.current;
    if (!currentContainer) return;
  
    const updateDimensions = () => {
      const { width } = currentContainer.getBoundingClientRect();
      setDimensions({ width, height: 380 });
    };
  
    // Initial measurement
    updateDimensions();
  
    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(currentContainer);
  
    // Clean up
    return () => {
      resizeObserver.unobserve(currentContainer);
      resizeObserver.disconnect();
    };
  }, [graphData.nodes.length, graphContainerRef.current]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleZoomToFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(600, 50);
    }
  };

  const convertSummaryToGraph = (summaryText: string) => {
    if (!summaryText) return { nodes: [], links: [] };

    const sentences = summaryText.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const nodes = new Map();
    const relationships = [];
    const rootId = "root";

    nodes.set(rootId, {
      id: rootId,
      name: "Video Summary",
      val: 12,
      depth: 0,
      connections: sentences.length
    });

    sentences.forEach((sentence, index) => {
      if (sentence.trim().length < 10) return;
      
      const topic = sentence.trim().substring(0, 30);
      const nodeId = `topic_${index}`;
      
      nodes.set(nodeId, {
        id: nodeId,
        name: topic,
        val: 8 - Math.min(index * 0.3, 4),
        depth: 1,
        connections: 1
      });
      
      relationships.push({ source: rootId, target: nodeId, value: 1 });
      
      if (index > 0 && index % 2 === 0) {
        relationships.push({ source: `topic_${index - 2}`, target: nodeId, value: 1 });
      }
    });

    return {
      nodes: Array.from(nodes.values()),
      links: relationships
    };
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleTranscriptGeneration = async (transcriptData: string) => {
    try {
      const response = await fetch("/api/gemini-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptData,
          videoId: videoId,
          videoUrl: videoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process transcript");
      }

      window.open("/notes", "_blank");
    } catch (error: any) {
      console.error("Error processing transcript:", error);
    }
  };

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
    setGraphData({ nodes: [], links: [] });

    try {
      const transcriptResponse = await fetch(
        `/api/youtube-transcript?videoId=${extractedVideoId}`
      );
      if (!transcriptResponse.ok) throw new Error("Could not fetch transcript");
      
      const transcriptData = await transcriptResponse.json();
      if (!transcriptData.transcript?.length) throw new Error("No captions available");

      const formattedTranscript = formatTranscriptBySecond(transcriptData.transcript);
      setTranscript(formattedTranscript);

      await handleTranscriptGeneration(formattedTranscript);

      const summaryResponse = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: formattedTranscript }),
      });
      const summaryData = await summaryResponse.json();
      if (!summaryData.success) throw new Error(summaryData.error || "Failed to generate summary");

      setSummary(summaryData.summary);
      setGraphData(convertSummaryToGraph(summaryData.summary));
      setChatHistory([{
        role: "assistant",
        content: "I'm ready to help. What would you like to know about this video?",
      }]);
    } catch (error: any) {
      console.error("Error processing video:", error);
      setSummary(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTranscriptBySecond = (transcriptData: any[]) => {
    const lastEntry = transcriptData[transcriptData.length - 1];
    const maxDuration = Math.ceil(lastEntry.start + lastEntry.duration);
    const secondBySecond = Array(maxDuration + 1).fill("");

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
          .toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
        return `${timestamp} - ${text}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const seekToTimestamp = (timestamp: string) => {
    if (!videoId || !timestamp) return;
    const timeArray = timestamp.split(":");
    let seconds = 0;

    if (timeArray.length === 3) {
      seconds = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]);
    } else if (timeArray.length === 2) {
      seconds = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    }

    const iframe = document.querySelector("iframe");
    if (iframe) {
      const currentSrc = new URL(iframe.src);
      currentSrc.searchParams.set("autoplay", "1");
      currentSrc.searchParams.set("start", seconds.toString());
      iframe.src = currentSrc.toString();
    }
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    setIsChatLoading(true);
    const userMessage = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: { transcript, summary, videoId },
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }

      let aiResponse = data.response;
      const timestampRegex = /(\d{2}:\d{2}:\d{2})/g;
      const timestamps = aiResponse.match(timestampRegex) || [];

      timestamps.forEach((timestamp: string) => {
        aiResponse = aiResponse.replace(
          new RegExp(`\\b${timestamp}\\b`, "g"),
          `<span class="timestamp-link cursor-pointer text-blue-600 underline" data-time="${timestamp}">${timestamp}</span>`
        );
      });

      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: aiResponse, hasTimestamps: timestamps.length > 0 }
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}. Please try again.` }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTimestampClick = (timestamp: string) => {
    seekToTimestamp(timestamp);
  };

  return (
    <div className="h-screen w-full bg-slate-50 p-6 flex">
      <ResizablePanelGroup direction="vertical" className="gap-4 w-full">
        {/* Top Section */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <ResizablePanelGroup direction="horizontal" className="gap-4 h-full">
            {/* Video Column */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Video Analysis</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => alert("Google Drive upload coming soon")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <span className="text-slate-700 text-sm">Upload to Drive</span>
                    </button>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="YouTube URL..."
                        className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <button
                        onClick={handleVideoSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-sm">{isLoading ? "Processing..." : "Play"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 relative m-4 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  {isVideoPlaying && videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      className="w-full h-full"
                      title="YouTube video player"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <div className="text-center space-y-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        <p className="text-sm font-medium">Enter YouTube URL to begin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-100 w-1 rounded-full hover:bg-blue-200 transition-colors" />

            {/* Summary Column */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {showTranscript ? "Transcript" : "Summary"}
                    </h2>
                    {transcript && (
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
                      >
                        <span>{showTranscript ? "View Summary" : "View Transcript"}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="h-[calc(100%-3rem)] bg-slate-50 rounded-lg p-4 border border-slate-200 overflow-y-auto">
                    {showTranscript ? (
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {transcript}
                      </p>
                    ) : (
                      <>
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                            <p className="text-gray-500">Analyzing video content...</p>
                          </div>
                        ) : (
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {summary || "Video summary will appear here..."}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-slate-100 h-1 rounded-full hover:bg-blue-200 transition-colors" />

        {/* Bottom Section */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <ResizablePanelGroup direction="horizontal" className="gap-4 h-full">
            {/* Chat Column */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">AI Assistant</h2>
                  <div
                    ref={chatContainerRef}
                    className="h-[calc(100%-4rem)] space-y-3 overflow-y-auto pr-2"
                  >
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg ${
                            message.role === "user" 
                              ? "bg-blue-600 text-white" 
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {message.hasTimestamps ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: message.content }}
                              onClick={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.classList.contains("timestamp-link")) {
                                  handleTimestampClick(target.dataset.time!);
                                }
                              }}
                            />
                          ) : (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex items-center gap-2 text-slate-500 pl-2">
                        <div className="animate-bounce h-2 w-2 bg-blue-600 rounded-full"></div>
                        <div className="animate-bounce h-2 w-2 bg-blue-600 rounded-full delay-100"></div>
                        <div className="animate-bounce h-2 w-2 bg-blue-600 rounded-full delay-200"></div>
                      </div>
                    )}
                  </div>
                </div>
                <form onSubmit={handleChatSubmit} className="mt-auto p-4 pt-2 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={videoId ? "Ask about the video..." : "Load a video first to chat"}
                      className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      disabled={isChatLoading || !videoId}
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !videoId}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-100 w-1 rounded-full hover:bg-blue-200 transition-colors" />

            {/* Graph Column */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Knowledge Graph</h2>
                  <div 
                    ref={graphContainerRef}
                    className="h-[calc(100%-3rem)] rounded-lg overflow-hidden border border-slate-200"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        <p className="text-gray-500">Analyzing video content...</p>
                      </div>
                    ) : graphData.nodes.length > 0 ? (
                      <div className="relative h-full">
                        <ForceGraph2D
                          ref={graphRef}
                          graphData={graphData}
                          width={dimensions.width}
                          height={dimensions.height}
                          backgroundColor="#f8fafc"
                          nodeColor={() => "#3b82f6"}
                          nodeLabel="name"
                          linkColor={() => "rgba(59, 130, 246, 0.6)"}
                          nodeRelSize={6}
                          linkDirectionalParticles={2}
                          linkDirectionalParticleSpeed={0.005}
                          linkWidth={1.5}
                          d3AlphaDecay={0.008}
                          d3VelocityDecay={0.08}
                          nodeCanvasObject={(node, ctx, globalScale) => {
                            const isHovered = hoveredNode === node.id;
                            const nodeSize = node.val;

                            ctx.beginPath();
                            ctx.arc(node.x, node.y, nodeSize / globalScale, 0, 2 * Math.PI);
                            ctx.fillStyle = isHovered ? "#2563eb" : "#3b82f6";
                            ctx.fill();

                            if (isHovered) {
                              ctx.strokeStyle = "#ffffff";
                              ctx.lineWidth = 2 / globalScale;
                              ctx.stroke();
                            }

                            const label = node.name;
                            const fontSize = Math.max(12, nodeSize * 0.8) / globalScale;
                            ctx.font = `${fontSize}px Inter`;
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = isHovered ? "#ffffff" : "#1e293b";
                            ctx.fillText(label, node.x, node.y + (nodeSize + 8) / globalScale);
                          }}
                          onNodeHover={(node) => {
                            setHoveredNode(node ? node.id : null);
                            document.body.style.cursor = node ? "pointer" : "default";
                          }}
                          onNodeClick={(node) => {
                            if (graphRef.current) {
                              graphRef.current.centerAt(node.x, node.y, 1000);
                              graphRef.current.zoom(1.5, 1000);
                            }
                          }}
                        />
                        <button
                          onClick={handleZoomToFit}
                          className="absolute bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm shadow-md opacity-80 hover:opacity-100 transition-opacity"
                        >
                          Fit Graph
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 italic">
                          Graph visualization will appear after analysis...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}