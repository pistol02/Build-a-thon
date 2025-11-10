"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeProps,
  Handle,
  Position,
} from "reactflow";
import * as dagre from "@dagrejs/dagre";
import "reactflow/dist/style.css";

// Add custom styles for the flow node
const flowNodeStyles = {
  background: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "2px solid #93c5fd",
  minWidth: "180px",
  fontSize: "14px",
  fontFamily: "Inter, system-ui, sans-serif",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  color: "#1e40af",
  transition: "all 0.2s ease",
};

// Custom node component with editable text
const FlowNode = ({ data, id }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onChange(id, text);
  };

  return (
    <div
      style={flowNodeStyles}
      className="group hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-400 !w-3 !h-3 hover:!bg-blue-600"
      />
      {isEditing ? (
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="nodrag text-center font-medium"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="text-center font-medium cursor-pointer"
        >
          {text}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-400 !w-3 !h-3 hover:!bg-blue-600"
      />
    </div>
  );
};

const nodeTypes = {
  flowNode: FlowNode,
};

interface FlowchartEditorProps {
  graphData: { nodes: any[]; links: any[] };
}

// Update layout utility function with correct dagre initialization
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction });
  g.setDefaultEdgeLabel(() => ({}));

  // Set nodes
  nodes.forEach((node) => {
    g.setNode(node.id, { width: 180, height: 50 });
  });

  // Set edges
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Apply layout
  dagre.layout(g);

  // Get layout results
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 25,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

function FlowchartEditorContent({ graphData }: FlowchartEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const updateNodeText = useCallback((nodeId: string, newText: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newText,
              onChange: updateNodeText,
            },
          };
        }
        return node;
      })
    );
  }, []);

  useEffect(() => {
    const initialNodes: Node[] = graphData.nodes.map((node) => ({
      id: node.id,
      type: "flowNode",
      position: { x: 0, y: 0 }, // Position will be calculated by dagre
      data: {
        label: node.name,
        onChange: updateNodeText,
      },
    }));

    const initialEdges: Edge[] = graphData.links.map((link, index) => ({
      id: `e${index}`,
      source: link.source,
      target: link.target,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#93c5fd", strokeWidth: 2 },
    }));

    // Apply automatic layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [graphData, updateNodeText]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNewNode = useCallback(() => {
    const newId = `node_${nodes.length + 1}`;
    const newNode: Node = {
      id: newId,
      type: "flowNode",
      position: { x: 100, y: 100 },
      data: {
        label: "New Node",
        onChange: updateNodeText,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, updateNodeText]);

  return (
    <div className="h-[600px] w-full border rounded-lg overflow-hidden bg-blue-50/50">
      <div className="h-[50px] bg-white border-b border-blue-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={addNewNode}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Node
          </Button>
          <span className="text-sm text-blue-600 font-medium">
            Double-click node text to edit
          </span>
        </div>
      </div>
      <div className="h-[550px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-blue-50/50"
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { stroke: "#93c5fd", strokeWidth: 2 },
          }}
        >
          <Background color="#93c5fd" gap={16} size={1} />
          <Controls className="bg-white border-2 border-blue-200 rounded-lg" />
        </ReactFlow>
      </div>
    </div>
  );
}

// Create a wrapped version of the component for SSR compatibility
const FlowchartEditor = dynamic(() => Promise.resolve(FlowchartEditorContent), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full border rounded-lg overflow-hidden bg-blue-50/50 flex items-center justify-center">
      <div className="text-blue-600">Loading flowchart editor...</div>
    </div>
  ),
});

export default FlowchartEditor;