"use client";

import React, { useEffect, useState } from "react";

const AICreator = () => {
  const [creators, setCreators] = useState([]);
  const [script, setScript] = useState("");
  const [selectedCreator, setSelectedCreator] = useState("Kate");
  const [status, setStatus] = useState("");

  // Fetch creators list
  useEffect(() => {
    const fetchCreators = async () => {
      setStatus("Loading creators...");

      try {
        const response = await fetch("/api/fetchCreators", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch creators (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Creators fetched:", data);
        setCreators(data.supportedCreators || []);
        setStatus("");
      } catch (error) {
        console.error("Error fetching creators:", error);
        setStatus("Error fetching creators. Check API Key and network.");
      }
    };

    fetchCreators();
  }, []);

  // Submit script to generate video
  const handleSubmit = async () => {
    if (!script.trim()) {
      alert("Script cannot be empty");
      return;
    }

    setStatus("Submitting video request...");

    try {
      const response = await fetch("https://api.captions.ai/api/creator/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_CAPTIONS_API_KEY, // API key is only safe if used server-side
        },
        body: JSON.stringify({
          creatorName: selectedCreator,
          script,
          resolution: "fhd",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Submission failed: ${errorData.detail}`);
      }

      const result = await response.json();
      console.log("Video submitted:", result);
      setStatus(`Video submitted! Operation ID: ${result.operationId}`);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("Error submitting video request. Check API key & script.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">AI Creator Video Generator</h2>

      <label className="block mb-2 font-semibold">Select AI Creator:</label>
      <select
        className="border p-2 mb-4 w-full"
        value={selectedCreator}
        onChange={(e) => setSelectedCreator(e.target.value)}
      >
        {creators.length > 0 ? (
          creators.map((creator) => (
            <option key={creator} value={creator}>
              {creator}
            </option>
          ))
        ) : (
          <option>Loading...</option>
        )}
      </select>

      <label className="block mb-2 font-semibold">Enter Script:</label>
      <textarea
        className="border p-2 w-full mb-4"
        rows={3}
        maxLength={800}
        placeholder="Enter your script (max 800 characters)"
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Generate Video
      </button>

      {status && <p className="mt-4 text-red-600">{status}</p>}
    </div>
  );
};

export default AICreator;
