"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaArrowLeft, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import TextEditor from "./TextEditor";
import GeneratedContent from "./GeneratedContent";
import { useForumStore } from "@/store/forumStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  timestamp: Date;
  isExpanded?: boolean;
  lastModified: Date;
  tags: string[];
  emoji?: string;
}

interface GeneratedNote {
  type: string;
  content: string;
  timestamp: Date;
}

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "system",
      content: "Ambitious but Lazy: Simple Steps to Start Doing What Matters",
    },
    {
      role: "assistant",
      content:
        'The YouTube video "Rise With Odn" addresses the common feeling of ambition hindered by perceived laziness. It argues that overwhelming tasks are the root cause and offers practical strategies to overcome this inertia. The core advice involves breaking down goals into smaller, manageable steps to make them less daunting. The video promotes creating simple routines to bypass reliance on willpower and employing the "2-minute rule" to initiate action. It emphasizes that consistency and small, regular efforts ultimately lead to significant progress, despite inevitable setbacks.',
    },
  ]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [expandedNote, setExpandedNote] = useState<Note | null>(null);
  const [rightPanelContent, setRightPanelContent] = useState<string>("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<
    Record<string, GeneratedNote>
  >({});
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [availableForums, setAvailableForums] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
    }>
  >([]);
  const { forums, addForum, addNoteToForum } = useForumStore();

  const suggestedTags = [
    "Productivity",
    "Study",
    "Time Management",
    "Goals",
    "Career",
    "Personal Growth",
    "Learning",
    "Motivation",
  ];

  const sources = [
    { id: "1", title: "If you're ambitious but lazy, please watch this..." },
    { id: "2", title: "If you're ambitious but lazy, please watch this..." },
  ];

  useEffect(() => {
    // Initialize with sample notes
    setNotes([
      {
        id: "1",
        title: "📚 Advanced Study Techniques & Memory Optimization",
        content: `
          <div class="study-guide">
            <h1 class="text-3xl font-bold text-blue-800 mb-6">Advanced Study Techniques & Memory Optimization</h1>
            
            <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Active Recall Methods</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li>Feynman Technique Implementation
                <ul class="list-circle pl-4 mt-2">
                  <li>Explain concepts in simple language</li>
                  <li>Identify knowledge gaps</li>
                  <li>Refine explanation</li>
                  <li>Simplify technical terms</li>
                </ul>
              </li>
              <li>Spaced Repetition Schedule
                <ul class="list-circle pl-4 mt-2">
                  <li>Day 1: Initial learning</li>
                  <li>Day 3: First review</li>
                  <li>Day 7: Second review</li>
                  <li>Day 21: Final review</li>
                </ul>
              </li>
            </ul>

            <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Task Management</h2>
            <div class="space-y-2">
              <div class="flex items-center">
                <input type="checkbox" checked class="form-checkbox text-blue-600 h-4 w-4 mr-2">
                <span class="line-through">Set up study schedule template</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" checked class="form-checkbox text-blue-600 h-4 w-4 mr-2">
                <span class="line-through">Create Anki flashcard deck</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="form-checkbox text-blue-600 h-4 w-4 mr-2">
                <span>Review week 3 materials</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="form-checkbox text-blue-600 h-4 w-4 mr-2">
                <span>Practice problems set B</span>
              </div>
            </div>

            <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">Quick Reference Guide</h3>
            <div class="bg-blue-50 p-4 rounded-lg">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="text-left">Technique</th>
                    <th class="text-left">Use Case</th>
                    <th class="text-left">Effectiveness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mind Mapping</td>
                    <td>Complex Topics</td>
                    <td>High</td>
                  </tr>
                  <tr>
                    <td>Pomodoro</td>
                    <td>Focus Sessions</td>
                    <td>Very High</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `,
        type: "Study Guide",
        timestamp: new Date("2024-03-10"),
        lastModified: new Date("2024-03-10"),
        tags: ["Study", "Productivity", "Learning"],
        emoji: "📚",
      },
      {
        id: "2",
        title: "🎯 2024 Goal Setting Framework",
        content: `
          <div class="goal-framework">
            <h1 class="text-3xl font-bold text-green-800 mb-6">Personal Development Framework 2024</h1>
            
            <div class="bg-green-50 p-4 rounded-lg mb-6">
              <blockquote class="text-lg text-gray-700 italic">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
                <footer class="text-sm mt-2">- Winston Churchill</footer>
              </blockquote>
            </div>

            <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">Quarter 1 Objectives</h2>
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="checkbox" checked class="form-checkbox text-green-600 h-4 w-4 mr-2">
                <span class="line-through">Complete AWS Certification</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="form-checkbox text-green-600 h-4 w-4 mr-2">
                <span>Launch personal portfolio website</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="form-checkbox text-green-600 h-4 w-4 mr-2">
                <span>Read 6 technical books</span>
              </div>
            </div>

            <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">Skill Development Plan</h3>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Technical Skills
                <ul class="list-disc pl-6 mt-2">
                  <li>Next.js Advanced Features</li>
                  <li>TypeScript Best Practices</li>
                  <li>System Design Principles</li>
                </ul>
              </li>
              <li>Soft Skills
                <ul class="list-disc pl-6 mt-2">
                  <li>Public Speaking</li>
                  <li>Technical Writing</li>
                  <li>Team Leadership</li>
                </ul>
              </li>
            </ol>

            <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">Progress Tracking</h3>
            <div class="bg-white p-4 rounded-lg border border-green-200">
              <div class="space-y-2">
                <div class="flex items-center">
                  <div class="w-32">AWS Progress:</div>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 rounded-full h-2" style="width: 75%"></div>
                  </div>
                  <div class="ml-2">75%</div>
                </div>
                <div class="flex items-center">
                  <div class="w-32">Books Read:</div>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 rounded-full h-2" style="width: 33%"></div>
                  </div>
                  <div class="ml-2">2/6</div>
                </div>
              </div>
            </div>
          </div>
        `,
        type: "Goals",
        timestamp: new Date("2024-03-08"),
        lastModified: new Date("2024-03-09"),
        tags: ["Goals", "Career", "Personal Growth"],
        emoji: "🎯",
      },
      {
        id: "3",
        title: "💡 Project Architecture Notes",
        content: `
          <div class="architecture-notes">
            <h1 class="text-3xl font-bold text-purple-800 mb-6">System Architecture: E-Commerce Platform</h1>

            <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">Architecture Overview</h2>
            <div class="bg-purple-50 p-4 rounded-lg mb-6">
              <pre class="text-sm">
├── Frontend (Next.js)
│   ├── pages/
│   ├── components/
│   └── public/
├── Backend (Node.js)
│   ├── services/
│   ├── controllers/
│   └── models/
└── Database (PostgreSQL)
              </pre>
            </div>

            <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">Key Components</h3>
            <ul class="list-disc pl-6 space-y-2">
              <li>Authentication Service
                <ul class="list-circle pl-4 mt-2">
                  <li>JWT implementation</li>
                  <li>OAuth integration</li>
                  <li>Role-based access control</li>
                </ul>
              </li>
              <li>Payment Processing
                <ul class="list-circle pl-4 mt-2">
                  <li>Stripe integration</li>
                  <li>Payment webhook handling</li>
                  <li>Refund processing</li>
                </ul>
              </li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">API Endpoints</h3>
            <div class="bg-white p-4 rounded-lg border border-purple-200">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="text-left">Endpoint</th>
                    <th class="text-left">Method</th>
                    <th class="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>/api/auth/login</code></td>
                    <td>POST</td>
                    <td>User authentication</td>
                  </tr>
                  <tr>
                    <td><code>/api/products</code></td>
                    <td>GET</td>
                    <td>Product listing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">Implementation Notes</h3>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="space-y-2">
                <p>⚠️ <strong>Important:</strong> Ensure proper error handling in payment processing</p>
                <p>📌 <strong>TODO:</strong> Implement rate limiting on API endpoints</p>
                <p>💡 <strong>Optimization:</strong> Add Redis caching for product catalog</p>
              </div>
            </div>
          </div>
        `,
        type: "Technical",
        timestamp: new Date("2024-03-07"),
        lastModified: new Date("2024-03-07"),
        tags: ["Architecture", "Development", "Technical"],
        emoji: "💡",
      },
    ]);
  }, []);

  useEffect(() => {
    const checkForTranscript = async () => {
      try {
        const response = await fetch("/api/gemini-notes/latest");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch transcript");
        }

        if (!data.transcript || !data.videoInfo) {
          return;
        }

        const analysisResponse = await fetch("/api/gemini-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript: data.transcript }),
        });

        const analysisData = await analysisResponse.json();

        if (!analysisData.success) {
          console.error("Analysis details:", analysisData.details);
          throw new Error(analysisData.error || "Analysis failed");
        }

        const newNote: Note = {
          id: Date.now().toString(),
          title: `Video Analysis - ${new Date().toLocaleDateString()}`,
          content: `
            <div class="video-analysis">
              <h2 class="text-2xl font-bold mb-4">Video Analysis</h2>
              <p class="mb-4"><strong>Source:</strong> <a href="${data.videoInfo.videoUrl}" target="_blank" class="text-blue-600 hover:underline">${data.videoInfo.videoUrl}</a></p>
              <div class="analysis prose prose-blue">
                ${analysisData.content}
              </div>
            </div>
          `,
          type: "Video Analysis",
          timestamp: new Date(),
          lastModified: new Date(),
          tags: ["Video", "Analysis"],
          emoji: "🎥",
        };

        setNotes((prev) => [...prev, newNote]);
        setSelectedNote(newNote);
      } catch (error) {
        console.error("Error processing transcript:", error);
        alert(
          `Failed to process transcript: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };

    checkForTranscript();
  }, []);

  useEffect(() => {
    // In a real app, fetch forums from API
    setAvailableForums([
      {
        id: "1",
        name: "Web Development",
        description:
          "Discuss modern web development practices and technologies",
      },
      {
        id: "2",
        name: "Machine Learning",
        description: "Share ML/AI knowledge and resources",
      },
      {
        id: "3",
        name: "Study Techniques",
        description: "Exchange effective learning and study methods",
      },
    ]);
  }, []);

  const handleAddSource = () => {
    // This would typically open a modal or form to add a new source
    alert("Add source functionality would be implemented here");
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    // In a real application, this would fetch notes related to this source
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) {
      alert("Please enter a title for your note");
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: "",
      type: "Custom",
      timestamp: new Date(),
      lastModified: new Date(),
      tags: [],
      emoji: "📝",
    };

    setNotes([...notes, newNote]);
    setNewNoteTitle("");
    setSelectedNote(newNote);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsFullScreen(true);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: chatInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
    }
  };

  const generateSpecializedNote = async (type: string) => {
    const prompts: Record<string, string> = {
      "Study Guide":
        "Create a comprehensive study guide about overcoming laziness while being ambitious",
      FAQ: "Generate frequently asked questions about motivation for ambitious but lazy people",
      Timeline:
        "Create a timeline of steps to overcome inertia and achieve goals",
      "Briefing Doc":
        "Create a briefing document summarizing key strategies for converting ambition into action",
    };

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompts[type] }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const newNote: Note = {
        id: Date.now().toString(),
        title: `${type} - ${new Date().toLocaleDateString()}`,
        content: data.response,
        type,
        timestamp: new Date(),
        lastModified: new Date(),
        tags: [],
      };

      setNotes([...notes, newNote]);
      setSelectedNote(newNote);
      setIsFullScreen(true);
    } catch (error) {
      console.error("Error generating specialized note:", error);
      alert("Failed to generate note. Please try again.");
    }
  };

  const handleGenerateNote = async (type: string) => {
    if (!selectedNote) {
      alert("Please select a note first");
      return;
    }

    setIsGeneratingNote(true);
    try {
      const response = await fetch("/api/gemini-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content: selectedNote.content.replace(/<[^>]+>/g, ""), // Strip HTML tags
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedNotes((prev) => ({
          ...prev,
          [type]: {
            type,
            content: data.response,
            timestamp: new Date(),
          },
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate note. Please try again.");
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      type: "Custom",
      timestamp: new Date(),
      lastModified: new Date(),
      tags: [],
      emoji: "📝",
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setIsCreatingNote(true);
    setSelectedTags([]);
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id
          ? { ...selectedNote, lastModified: new Date() }
          : note
      );
      setNotes(updatedNotes);
      setIsCreatingNote(false);
      // Show success toast or feedback
    }
  };

  const handleContentChange = (newContent: string) => {
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, content: newContent });
    }
  };

  const handleSaveGeneratedNote = (type: string) => {
    if (generatedNotes[type]) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: `${type} - ${new Date().toLocaleDateString()}`,
        content: generatedNotes[type],
        type,
        timestamp: new Date(),
        lastModified: new Date(),
        tags: ["Generated", type],
        emoji:
          type === "Study Guide"
            ? "📚"
            : type === "FAQ"
            ? "❓"
            : type === "Timeline"
            ? "⏱️"
            : "📋",
      };

      setNotes([...notes, newNote]);
      alert(`${type} saved to your notes!`);
    }
  };

  const renderNoteTitleSection = () => (
    <div className="p-6 border-b border-gray-100 space-y-4">
      <input
        type="text"
        value={selectedNote?.title || ""}
        onChange={(e) =>
          setSelectedNote({ ...selectedNote!, title: e.target.value })
        }
        className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800"
        placeholder="Note Title"
      />
      <div className="flex flex-wrap gap-2">
        {selectedNote?.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => {
                const updatedTags = selectedNote.tags.filter((t) => t !== tag);
                setSelectedNote({ ...selectedNote, tags: updatedTags });
              }}
              className="hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
        <div className="relative">
          <select
            onChange={(e) => {
              if (
                e.target.value &&
                !selectedNote?.tags.includes(e.target.value)
              ) {
                setSelectedNote({
                  ...selectedNote!,
                  tags: [...selectedNote!.tags, e.target.value],
                });
              }
              e.target.value = "";
            }}
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm cursor-pointer hover:border-blue-300 transition-colors"
          >
            <option value="">+ Add Tag</option>
            {suggestedTags
              .filter((tag) => !selectedNote?.tags.includes(tag))
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );

  // New function to render generated content preview cards
  const renderGeneratedContentCard = (type: string) => {
    if (!generatedNotes[type]) return null;

    // Extract title and first paragraph from the markdown
    const lines = generatedNotes[type].split("\n");
    const title = lines[0].replace(/^#\s+/, "");

    // Get the first non-empty paragraph after the title
    let preview = "";
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].startsWith("#")) {
        preview = lines[i].trim();
        break;
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 
                 rounded-xl cursor-pointer hover:shadow-md transition-all 
                 border border-blue-100 hover:border-blue-300"
        onClick={() =>
          setExpandedNote({
            id: `generated-${type}`,
            title: title,
            content: generatedNotes[type],
            type: type,
            timestamp: new Date(),
            lastModified: new Date(),
            tags: [type],
          })
        }
      >
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{preview}</p>
        <p className="text-blue-600 text-xs mt-2 font-medium">
          Click to expand
        </p>
      </motion.div>
    );
  };

  const renderGenerateButtons = () => (
    <div className="flex flex-col gap-3">
      {["Study Guide", "FAQ", "Timeline", "Summary"].map((type) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleGenerateNote(type)}
          disabled={isGeneratingNote}
          className={`py-2 px-4 rounded-full font-medium shadow-sm 
                   transition-all bg-gradient-to-r 
                   ${
                     isGeneratingNote
                       ? "from-gray-100 to-gray-200 text-gray-400"
                       : "from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 text-blue-800 hover:shadow-md"
                   }
                   flex items-center justify-center text-sm`}
        >
          {isGeneratingNote ? "Generating..." : type}
        </motion.button>
      ))}
    </div>
  );

  const handleGenerateContent = async (type: string) => {
    try {
      const response = await fetch(
        `/api/gemini-${type.toLowerCase().replace(" ", "")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: chatMessages[1]?.content || "Default content",
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setGeneratedNotes((prev) => ({
          ...prev,
          [type]: {
            type,
            content: data.response,
            timestamp: new Date(),
          },
        }));
      }
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  const renderGeneratedContentPreview = (type: string) => {
    const note = generatedNotes[type];
    if (!note) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => setExpandedType(type)}
      >
        <h3 className="font-medium text-gray-800 mb-2">{type}</h3>
        <div className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
          {note.content}
        </div>
        <span className="text-blue-600 text-xs mt-2 inline-block">
          Click to expand
        </span>
      </motion.div>
    );
  };

  const renderRightPanel = () => (
    <>
      <h2 className="text-xl font-semibold mb-6 text-blue-600">
        Generate Notes
      </h2>
      <div className="flex flex-col gap-3">
        {["Summary", "Study Guide", "Timeline", "FAQ"].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerateNote(type)}
            disabled={isGeneratingNote}
            className={`py-2 px-4 rounded-full text-sm font-medium
                     transition-all bg-gradient-to-r 
                     ${
                       isGeneratingNote
                         ? "from-gray-100 to-gray-200 text-gray-400"
                         : "from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                     }
                     border border-blue-100 hover:border-blue-200
                     text-blue-800`}
          >
            {isGeneratingNote ? "Generating..." : type}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
        {Object.keys(generatedNotes).map((type) =>
          renderGeneratedContentPreview(type)
        )}
      </div>
    </>
  );

  // Add this state for the publish modal
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishTarget, setPublishTarget] = useState<{
    forumId?: string;
    createNew?: boolean;
  }>({});

  // Add this function to handle publishing
  const handlePublishNote = async (forumId?: string) => {
    if (!selectedNote) return;

    try {
      // If creating new forum
      if (publishTarget.createNew) {
        const newForumId = Date.now().toString();
        addForum({
          name: publishTarget.forumName || "New Forum",
          description: publishTarget.forumDescription || "No description",
          tags: publishTarget.forumTags || [],
        });
        forumId = newForumId;
      }

      if (!forumId) {
        throw new Error("No forum selected");
      }

      // Add note to forum
      addNoteToForum(forumId, {
        title: selectedNote.title,
        content: selectedNote.content,
        author: "Current User", // Replace with actual user
      });

      alert("Note published successfully!");
      setIsPublishing(false);
      setPublishTarget({});
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish note");
    }
  };

  const handlePdfDownload = async () => {
    if (!selectedNote) return;

    try {
      const element = document.querySelector(".note-content");
      if (!element) return;

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${selectedNote.title}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Modify the render section for the center panel to include the publish button
  return (
    <div className="grid grid-cols-12 h-screen max-h-screen bg-gray-100 p-4 gap-4">
      {/* Left Panel - Note Titles (3 columns now) */}
      <div className="col-span-3">
        <div className="bg-white rounded-2xl shadow-lg h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-blue-600">My Notes</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNewNote}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              title="Create New Note"
            >
              <FaPlus />
            </motion.button>
          </div>

          <div
            className="space-y-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            {notes.map((note) => (
              <motion.div
                key={note.id}
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => setSelectedNote(note)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedNote?.id === note.id
                    ? "bg-blue-50 border-2 border-blue-200"
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <h3 className="font-medium text-gray-800 truncate">
                  {note.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-full">
                    {note.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Panel - Note Content (7 columns) */}
      <div className="col-span-7 relative">
        {" "}
        {/* Added relative positioning */}
        <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
          {selectedNote ? (
            <>
              {renderNoteTitleSection()}
              <div className="flex-1 overflow-hidden note-content">
                <TextEditor
                  content={selectedNote.content}
                  onChange={handleContentChange}
                />
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPublishing(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Publish to Community
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePdfDownload}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Download PDF
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save Changes
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg">Select a note to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Note Generation (2 columns now) */}
      <div className="col-span-2">
        <div className="bg-white rounded-2xl shadow-lg h-full p-6">
          {expandedNote ? (
            <div className="h-full relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpandedNote(null)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-all"
                >
                  <FaArrowLeft />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveGeneratedNote(expandedNote.type)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  Save to Notes
                </motion.button>
              </div>

              <div className="overflow-y-auto flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {expandedNote.title}
                </h2>
                <div className="prose prose-blue max-w-none">
                  {/* Simple markdown display, in a real app you'd use a markdown renderer */}
                  <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                    {expandedNote.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6 text-blue-600">
                Generate Notes
              </h2>

              {renderGenerateButtons()}

              <div className="mt-6 space-y-4">
                {["Study Guide", "FAQ", "Timeline", "Summary"].map((type) =>
                  renderGeneratedContentCard(type)
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Publish Modal */}
      {isPublishing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              Publish Note to Community
            </h2>
            <p className="text-gray-600 mb-4">
              Choose a forum to publish your note:
            </p>

            <div className="space-y-3 mb-4">
              {availableForums.map((forum) => (
                <button
                  key={forum.id}
                  onClick={() => handlePublishNote(forum.id)}
                  className="w-full p-4 text-left rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold">{forum.name}</h3>
                  <p className="text-sm text-gray-600">{forum.description}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setPublishTarget({ createNew: true })}
                className="text-blue-600 hover:text-blue-800"
              >
                Create New Forum
              </button>
              <button
                onClick={() => setIsPublishing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesApp;