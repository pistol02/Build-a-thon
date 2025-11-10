"use client";

import { useState, useCallback } from "react";
import { CardContent, Card } from "@/components/ui/card";
import { TerminalIcon } from "lucide-react";
import ChipTabs from "./chips";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { Editor } from "@monaco-editor/react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface OutputChipsProps {
  code: string;
  inputSchema: object;
  outputSchema: object;
  lang: string;
}

export function OutputChips({ code, inputSchema, outputSchema }: OutputChipsProps) {
  const [activeTab, setActiveTab] = useState<"Video Summary" | "Key Notes">("Video Summary");
  const [keyNotes, setKeyNotes] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleVideoSummary = useCallback(async () => {
    setGenerating(true);
    toast.loading("Generating Video Summary...");

    try {
      const response = await axios.get("/api/video-summary?videoUrl=https://www.youtube.com/watch?v=ntLJmHOJ0ME&list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q", {
        params: {
          videoUrl: "https://www.youtube.com/watch?v=ntLJmHOJ0ME&list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q",
        },
      });
      setVideoSummary(response.data.videoSummary || "No summary available.");
      toast.success("Video Summary Generated!");
    } catch (error) {
      console.error("Error generating video summary:", error);
      toast.error("Failed to generate video summary.");
    } finally {
      setGenerating(false);
      toast.dismiss();
    }
  }, []);

  const generateKeyNotes = useCallback(async () => {
    setLoading(true);
    toast.loading("Generating Key Notes...");

    try {
      const response = await axios.get("/api/explain", {
        params: {
          code: encodeURIComponent(code),
          inputSchema: JSON.stringify(inputSchema),
          outputSchema: JSON.stringify(outputSchema),
        },
      });
      setKeyNotes(response.data.explanation || "No key notes available.");
      toast.success("Key Notes Generated!");
    } catch (error) {
      console.error("Error generating key notes:", error);
      toast.error("Failed to generate key notes.");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  }, [code, inputSchema, outputSchema]);

  return (
    <div className="bg-white p-4 h-full overflow-y-auto">
      <div className="flex items-center space-x-4 mb-4">
        <TerminalIcon className="text-black" />
        <span className="text-lg font-semibold">{activeTab}</span>
      </div>

      <ChipTabs setSelectedTab={setActiveTab} />

      <Card className="rounded-lg">
        <CardContent className="flex flex-col items-center space-y-4">
          {activeTab === "Video Summary" ? (
            <>
              <label className="text-sm font-medium">Video Summary:</label>
              <Editor
                className="min-h-[25vh] border-2"
                value={videoSummary}
                options={{ readOnly: true }}
              />
              <Button
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded"
                onClick={handleVideoSummary}
                disabled={generating}
              >
                {generating ? "Generating..." : "Generate Summary"}
              </Button>
            </>
          ) : (
            <>
              <label className="text-sm font-medium">Key Notes:</label>
              <div className="border-gray-300 border p-2 w-full min-h-[20vh]">
                <ReactMarkdown>{keyNotes || "*No notes generated yet.*"}</ReactMarkdown>
              </div>
              <Button
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded"
                onClick={generateKeyNotes}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Notes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}