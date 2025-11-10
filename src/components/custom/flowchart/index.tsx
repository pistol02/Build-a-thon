"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeText } from "@/lib/gemini";

// Dynamically import components that use browser APIs
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div>Loading graph...</div>,
});

const FlowchartEditor = dynamic(() => import("./FlowchartEditor"), {
  ssr: false,
  loading: () => <div>Loading flowchart editor...</div>,
});

export default function TextMindMapGenerator() {
  const [inputText, setInputText] = useState("");
  const [mindMap, setMindMap] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const graphRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 }); // Increased height for better spacing

  // Track container dimensions for responsive graph sizing
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width, height: 600 }); // Increased height
      };

      // Initial measurement
      updateDimensions();

      // Set up resize observer
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);

      // Clean up
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, [graphData.nodes.length]);

  // Function to handle zoom-to-fit
  const handleZoomToFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(600, 100); // 600ms duration, 100px padding
    }
  };

  // Convert mind map text to graph data structure
  const convertMindMapToGraph = (mindMapText) => {
    if (!mindMapText) return { nodes: [], links: [] };

    const nodes = new Map();
    const links = [];

    // Central node (root)
    const rootId = "root";
    nodes.set(rootId, {
      id: rootId,
      name: "Main Concept",
      val: 12,
      depth: 0,
    });

    // Calculate importance based on connection count
    const connectionCount = new Map();

    // First pass - count mentions
    mindMapText.split("\n").forEach((line) => {
      if (!line.trim()) return;

      const parts = line.split("->").map((part) => part.trim());
      parts.forEach((part) => {
        if (!part) return;
        const count = connectionCount.get(part) || 0;
        connectionCount.set(part, count + 1);
      });
    });

    // Process each line of the mind map
    mindMapText.split("\n").forEach((line) => {
      // Skip empty lines
      if (!line.trim()) return;

      // Parse relationships (A -> B -> C)
      const parts = line.split("->").map((part) => part.trim());

      if (parts.length > 0) {
        let parentId = rootId;

        // Process each part in the relationship chain
        parts.forEach((part, index) => {
          // Skip empty parts
          if (!part) return;

          // Create a unique ID for the node
          const nodeId = `${part.replace(/\s+/g, "_")}_${index}`;

          // Calculate importance based on connection count and depth
          const importance = connectionCount.get(part) || 1;
          const sizeValue = Math.max(5, 10 - index * 1.5 + importance * 0.5);

          // Add node if it doesn't exist
          if (!nodes.has(nodeId)) {
            nodes.set(nodeId, {
              id: nodeId,
              name: part,
              val: sizeValue,
              depth: index + 1,
              connections: importance,
            });
          }

          // Add link to parent
          if (parentId !== nodeId) {
            links.push({
              source: parentId,
              target: nodeId,
              value: 1,
            });
          }

          // Current node becomes parent for next iteration
          parentId = nodeId;
        });
      }
    });

    return {
      nodes: Array.from(nodes.values()),
      links: links,
    };
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create a prompt that specifically asks for a mind map format
      const prompt = `
        Analyze the following text and create a textual mind map flow chart.
        Identify key topics, concepts, and their relationships.
        You are a csr company expert with amazing mathematical skills.
        You know how much money to be distribuyted where.
        Format the output as a textual mind map using arrows (->), with clear hierarchies and relationships.
        Create at least 10-15 nodes with relationships.
        Example format: Main Topic -> Subtopic 1 -> Detail A
                        Main Topic -> Subtopic 2 -> Detail B
        
        Text to analyze: ${inputText}
      `;

      const result = await analyzeText(prompt);
      setMindMap(result);

      // Convert the textual mind map to graph data
      const graphData = convertMindMapToGraph(result);
      setGraphData(graphData);
    } catch (error) {
      console.error("Error generating mind map:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-white/80 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600">
        Text to Mind Map Generator
      </h1>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-blue-700">
          Input Text
        </label>
        <Textarea
          className="w-full p-4 border border-blue-200 rounded-lg min-h-[200px]"
          placeholder="Enter your text here to generate a mind map flow chart..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Generate Mind Map"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {mindMap && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-medium text-blue-700 mb-2">
            Mind Map Flow Chart
          </h2>
          <div className="bg-white p-4 rounded border border-gray-200 prose max-w-none whitespace-pre-line font-mono">
            {mindMap}
          </div>
        </div>
      )}

      {graphData.nodes.length > 0 && (
        <>
          <div
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-blue-200"
            ref={containerRef}
          >
            <h2 className="text-lg font-medium text-blue-700 mb-2">
              Interactive Graph Visualization
            </h2>
            <div className="bg-black rounded-lg border border-gray-200 overflow-hidden relative">
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                width={dimensions.width - 32} // Account for padding
                height={dimensions.height}
                backgroundColor="#1a1a1a"
                nodeColor={() => "#9e88ff"} // Keep the original purple color
                nodeLabel={(node) =>
                  `${node.name} (Connections: ${node.connections || 1})`
                }
                linkColor={() => "rgba(100, 100, 255, 0.6)"}
                nodeRelSize={6} // Base size for nodes
                linkDirectionalParticles={2} // Add particles to show directionality
                linkDirectionalParticleSpeed={0.005} // Control particle speed
                linkWidth={1.5} // Slightly thicker links
                d3AlphaDecay={0.008} // Slower layout settling for better spacing
                d3VelocityDecay={0.08} // Less friction for more spreading
                // Significantly increase node separation force
                d3Force={(d3, nodes, links) => {
                  d3.forceLink(links)
                    .id((node) => node.id)
                    .distance(() => 200) // Dramatically increased distance between nodes
                    .strength(0.7); // Slightly reduced strength for more natural layout

                  d3.forceManyBody().strength(-300); // Much stronger repulsion between nodes

                  d3.forceCenter(dimensions.width / 2, dimensions.height / 2);

                  // Add collision force to prevent overlap
                  d3.forceCollide()
                    .radius(
                      (node) =>
                        // Add extra padding around nodes based on text length
                        (node.val || 5) +
                        (node.name ? node.name.length * 2 : 20)
                    )
                    .strength(1);
                }}
                // Implement fixed-size nodes that don't scale with zoom
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const isHovered = hoveredNode === node.id;

                  // Calculate fixed size for node that doesn't change with zoom
                  const nodeSize = node.val;

                  // Draw node circle with a size unaffected by zoom
                  ctx.beginPath();
                  ctx.arc(
                    node.x,
                    node.y,
                    nodeSize / globalScale,
                    0,
                    2 * Math.PI
                  );
                  ctx.fillStyle = isHovered ? "#b4a2ff" : "#9e88ff";
                  ctx.fill();

                  // Add highlight effect for hovered nodes
                  if (isHovered) {
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 2 / globalScale; // Scale line width inversely
                    ctx.stroke();

                    // Add glow effect
                    ctx.shadowColor = "#9e88ff";
                    ctx.shadowBlur = 15 / globalScale; // Scale blur inversely
                  } else {
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 0.5 / globalScale; // Scale line width inversely
                    ctx.stroke();
                  }

                  // Clear shadow settings
                  ctx.shadowBlur = 0;

                  // Draw node label with background
                  const label = node.name;
                  const fontSize = Math.max(12, nodeSize * 0.8) / globalScale; // Scale font inversely
                  ctx.font = `${fontSize}px Sans-Serif`;
                  const textWidth = ctx.measureText(label).width;
                  const backgroundDimensions = [textWidth, fontSize].map(
                    (n) => n + 12 / globalScale // Scale padding inversely
                  );

                  // Position text farther from node for better readability
                  const textYOffset = (nodeSize + 8) / globalScale; // Scale offset inversely

                  // Draw text background - more opaque for better readability
                  ctx.fillStyle = isHovered
                    ? "rgba(30, 30, 30, 0.95)"
                    : "rgba(30, 30, 30, 0.8)";
                  ctx.fillRect(
                    node.x - backgroundDimensions[0] / 2,
                    node.y - backgroundDimensions[1] / 2 + textYOffset,
                    backgroundDimensions[0],
                    backgroundDimensions[1]
                  );

                  // Draw text with enhanced styling
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  ctx.fillStyle = isHovered ? "#FFFFFF" : "#EEEEEE";
                  ctx.fillText(
                    label,
                    node.x,
                    node.y + textYOffset + fontSize / 2
                  );
                }}
                // Scale link particle size inversely with zoom
                linkDirectionalParticleWidth={(link) =>
                  4 / (graphRef.current?.zoom() || 1)
                }
                onNodeHover={(node) => {
                  setHoveredNode(node ? node.id : null);
                  document.body.style.cursor = node ? "pointer" : "default";
                }}
                onNodeClick={(node) => {
                  // Focus on clicked node
                  if (graphRef.current) {
                    graphRef.current.centerAt(node.x, node.y, 1000);
                    graphRef.current.zoom(1.5, 1000);
                  }
                }}
                cooldownTicks={100}
                onEngineStop={() => {
                  if (graphRef.current) {
                    graphRef.current.zoomToFit(600, 100); // More padding around graph
                  }
                }}
              />
              {/* Fit Graph Button in bottom left corner */}
              <button
                onClick={handleZoomToFit}
                className="absolute bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm shadow-md opacity-80 hover:opacity-100 transition-opacity"
                style={{ zIndex: 10 }}
              >
                Fit Graph
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Click and drag nodes to move them. Click on a node to focus.
                Hover for details. Scroll to zoom in/out. Use the 'Fit Graph'
                button to reset the view.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-medium text-blue-700 mb-2">
              Editable Flowchart
            </h2>
            <FlowchartEditor graphData={graphData} />
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Drag nodes to reposition them. Double-click node text to edit.
                Drag between node handles to create connections. Use the
                controls to zoom and pan.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}