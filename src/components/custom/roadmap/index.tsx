"use client";

import { useState, useEffect, useCallback, memo } from "react";
import {
  Calendar,
  Clock,
  Gauge,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Flame,
  Sparkles,
  Trophy,
  Eye,
  BookOpen,
  Headphones,
  HandHelping,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import { generateRoadmapData } from "@/lib/gemini1";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface RoadmapActivity {
  type: string;
  detail: string;
  isCompleted: boolean;
  progress: number;
  startDate?: Date;
  endDate?: Date;
  bulletPoints: string[];
  methodology: string;
  videoUrl?: string;
  videoTitle?: string;
}

interface RoadmapTopic {
  name: string;
  steps: RoadmapActivity[];
  milestones: Milestone[];
}

interface Milestone {
  title: string;
  description: string;
  targetDate: Date;
  isCompleted: boolean;
  reward?: string;
}

interface RoadmapItem {
  date: string;
  topics: RoadmapTopic[];
  completionPercentage?: number;
  timeSaved?: string;
}

interface RoadmapData {
  title: string;
  description: string;
  items: RoadmapItem[];
  totalCompletionPercentage: number;
  estimatedCompletionDate: string;
  hoursPerDay: number;
  timeSaved: string;
  userEngagement: {
    currentStreak: number;
    totalPoints: number;
    level: number;
    badges: string[];
    nextMilestone?: Milestone;
  };
  skillName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  currentMilestone: {
    title: string;
    progress: number;
    nextMilestone: string;
  };
  previousRoadmaps: {
    id: string;
    title: string;
    completionDate?: string;
    progress: number;
    badge?: {
      icon: string;
      name: string;
      description: string;
    };
  }[];
  projectMilestones: {
    dayIndex: number;
    title: string;
    description: string;
    badge: {
      icon: string;
      name: string;
      description: string;
    };
  }[];
}

type LearningStyle = "visual" | "reading" | "auditory" | "kinesthetic" | null;

const RoadmapComponent = () => {
  const [inputText, setInputText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [displayMode, setDisplayMode] = useState<"day" | "week" | "month">("day");
  const [streak, setStreak] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [timelineScale, setTimelineScale] = useState(100);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [dailyStreak, setDailyStreak] = useState(0);

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const YOUTUBE_API_KEY = 'AIzaSyDD8SMeYD5ezqqEHSVZfPwEWEK11f1Sw0M'; // Replace with your actual API key

  const fetchYouTubeVideos = async (query: string, type: "video" | "podcast" = "video") => {
    if (!query.trim()) return [];

    setVideoLoading(true);
    setVideoError("");

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
          query + (type === "podcast" ? " podcast" : " tutorial")
        )}&type=video&key=${YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to fetch videos');
      }

      setVideos(data.items);
      return data.items;
    } catch (err) {
      console.error('YouTube API Error:', err);
      setVideoError('Error fetching YouTube content. Please try again later.');
      return [];
    } finally {
      setVideoLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim()) {
      setTags([...tags, inputText.trim()]);
      setInputText("");
    }
    if (e.key === "Backspace" && !inputText && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles loaded", container);
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!tags.length || !deadline || !learningStyle) return;

    setIsLoading(true);
    try {
      const data = await generateRoadmapData(
        tags.join(", "),
        displayMode,
        deadline,
        learningStyle
      );

      const enhancedItems = await Promise.all(data.items.map(async (item) => {
        const enhancedTopics = await Promise.all(item.topics.map(async (topic) => {
          const enhancedSteps = await Promise.all(topic.steps.map(async (step) => {
            if (learningStyle === "visual" || learningStyle === "auditory") {
              const videos = await fetchYouTubeVideos(
                `${topic.name} ${step.detail}`,
                learningStyle === "auditory" ? "podcast" : "video"
              );
              if (videos.length > 0) {
                return {
                  ...step,
                  videoUrl: `https://www.youtube.com/watch?v=${videos[0].id.videoId}`,
                  videoTitle: videos[0].snippet.title
                };
              }
            }
            return step;
          }));
          return { ...topic, steps: enhancedSteps };
        }));
        return { ...item, topics: enhancedTopics };
      }));

      if (displayMode === "week") {
        data.items = mergeIntoWeeks(enhancedItems);
      } else if (displayMode === "month") {
        data.items = mergeIntoMonths(enhancedItems);
      }

      setRoadmapData({ ...data, items: enhancedItems });
    } catch (error) {
      console.error("Error generating roadmap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeIntoWeeks = (dailyItems: RoadmapItem[]): RoadmapItem[] => {
    const weeklyItems: RoadmapItem[] = [];
    let currentWeek: RoadmapItem[] = [];

    dailyItems.forEach((item, index) => {
      currentWeek.push(item);
      if ((index + 1) % 7 === 0 || index === dailyItems.length - 1) {
        weeklyItems.push({
          date: `Week ${Math.floor(index / 7) + 1}`,
          topics: mergeTopics(currentWeek),
          completionPercentage: averageCompletion(currentWeek),
          timeSaved: sumTimeSaved(currentWeek),
        });
        currentWeek = [];
      }
    });
    return weeklyItems;
  };

  const mergeIntoMonths = (dailyItems: RoadmapItem[]): RoadmapItem[] => {
    const monthlyItems: RoadmapItem[] = [];
    let currentMonth: RoadmapItem[] = [];

    dailyItems.forEach((item, index) => {
      currentMonth.push(item);
      if ((index + 1) % 30 === 0 || index === dailyItems.length - 1) {
        monthlyItems.push({
          date: `Month ${Math.floor(index / 30) + 1}`,
          topics: mergeTopics(currentMonth),
          completionPercentage: averageCompletion(currentMonth),
          timeSaved: sumTimeSaved(currentMonth),
        });
        currentMonth = [];
      }
    });
    return monthlyItems;
  };

  const mergeTopics = (items: RoadmapItem[]): RoadmapTopic[] => {
    const mergedTopics: { [key: string]: RoadmapTopic } = {};
    items.forEach((item) => {
      item.topics.forEach((topic) => {
        if (!mergedTopics[topic.name]) {
          mergedTopics[topic.name] = { name: topic.name, steps: [], milestones: [] };
        }
        mergedTopics[topic.name].steps.push(...topic.steps);
        mergedTopics[topic.name].milestones.push(...topic.milestones);
      });
    });
    return Object.values(mergedTopics);
  };

  const averageCompletion = (items: RoadmapItem[]): number => {
    const totalCompletion = items.reduce(
      (acc, item) => acc + (item.completionPercentage || 0),
      0
    );
    return totalCompletion / items.length;
  };

  const sumTimeSaved = (items: RoadmapItem[]): string => {
    const totalTimeSaved = items.reduce(
      (acc, item) => acc + (parseInt(item.timeSaved || "0") || 0),
      0
    );
    return `${totalTimeSaved} hours`;
  };

  const toggleTopicExpansion = (dayIndex: number, topicIndex: number) => {
    const key = `${dayIndex}-${topicIndex}`;
    setExpandedTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateTaskProgress = (
    dayIndex: number,
    topicIndex: number,
    stepIndex: number,
    progress: number
  ) => {
    if (!roadmapData) return;

    const updatedItems = [...roadmapData.items];
    const step = updatedItems[dayIndex].topics[topicIndex].steps[stepIndex];
    step.progress = Math.min(100, Math.max(0, progress));
    step.isCompleted = step.progress === 100;

    if (step.isCompleted) {
      setUserPoints((prev) => prev + 10);
      checkLevelUp();
      checkMilestones(dayIndex, topicIndex);
    }

    setRoadmapData({ ...roadmapData, items: updatedItems });
  };

  const checkLevelUp = () => {
    const newLevel = Math.floor(userPoints / 100) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      setBadges((prev) => [...prev, `Level ${newLevel} Achievement`]);
    }
  };

  const checkMilestones = (dayIndex: number, topicIndex: number) => {
    if (!roadmapData) return;

    const topic = roadmapData.items[dayIndex].topics[topicIndex];
    const completedSteps = topic.steps.filter((step) => step.isCompleted).length;
    const totalSteps = topic.steps.length;

    if (completedSteps === totalSteps) {
      setSelectedMilestone({
        title: `${topic.name} Mastery`,
        description: `Completed all tasks in ${topic.name}`,
        targetDate: new Date(),
        isCompleted: true,
        reward: "50 bonus points",
      });
      setShowMilestoneModal(true);
    }
  };

  const handleTimelineChange = (newScale: number) => {
    if (!roadmapData) return;
    setTimelineScale(newScale);

    const updatedItems = roadmapData.items.map((item) => ({
      ...item,
      topics: item.topics.map((topic) => ({
        ...topic,
        steps: topic.steps.map((step) => ({
          ...step,
          intensity: Math.round((100 / newScale) * 100) / 100,
        })),
      })),
    }));

    setRoadmapData({
      ...roadmapData,
      items: updatedItems,
      estimatedCompletionDate: calculateNewCompletionDate(newScale),
    });
  };

  const calculateNewCompletionDate = (scale: number) => {
    if (!deadline) return "";
    const originalDays = Math.ceil(
      (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const newDays = Math.ceil(originalDays * (scale / 100));
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + newDays);
    return newDate.toLocaleDateString();
  };

  const calculateProgressiveCompletion = (dayIndex: number) => {
    if (!roadmapData) return 0;
    const totalDays = roadmapData.items.length;
    const baseProgress = 5;
    const progressIncrement = (100 - baseProgress) / totalDays;
    return Math.min(100, baseProgress + progressIncrement * dayIndex);
  };

  const memoizedProgressiveCompletion = useCallback(
    (dayIndex: number) => calculateProgressiveCompletion(dayIndex),
    [roadmapData]
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-500";
      case "Intermediate": return "text-yellow-500";
      case "Advanced": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const renderTimelineControls = () => (
    <div className="flex items-center justify-between mb-6">
      {renderLearningStyleButtons()}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(["day", "week", "month"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setDisplayMode(mode)}
            className={`px-4 py-2 rounded-md transition-colors ${
              displayMode === mode
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderLearningStyleButtons = () => (
    <div className="flex flex-col items-start">
      <label className="text-sm text-gray-600 mb-2">Select Your Learning Style:</label>
      <div className="grid grid-cols-2 gap-2 w-64">
        {[
          { style: "visual", icon: Eye, label: "Visual", desc: "YouTube Videos" },
          { style: "reading", icon: BookOpen, label: "Reading", desc: "Articles & Docs" },
          { style: "auditory", icon: Headphones, label: "Audio", desc: "YouTube Podcasts" },
          { style: "kinesthetic", icon: HandHelping, label: "Hands-on", desc: "Practical Activities" },
        ].map(({ style, icon: Icon, label, desc }) => (
          <button
            key={style}
            onClick={() => setLearningStyle(style as LearningStyle)}
            className={`p-2 rounded-lg border transition-all flex flex-col items-center ${
              learningStyle === style
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <Icon
              className={`w-5 h-5 mb-1 ${
                learningStyle === style ? "text-blue-500" : "text-gray-500"
              }`}
            />
            <span className="text-xs font-medium">{label}</span>
            <span className="text-[10px] text-gray-500">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStepDetails = (step: RoadmapActivity, topic: RoadmapTopic) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
    >
      <div className="space-y-3">
        {step.bulletPoints.map((point, idx) => (
          <div key={idx} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
              <span className="text-sm font-medium text-blue-600">{idx + 1}</span>
            </div>
            <p className="text-sm text-gray-700 flex-1 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      {step.videoUrl && (learningStyle === "visual" || learningStyle === "auditory") && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <a
            href={step.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="text-red-500 text-xl">▶</span>
            <span className="text-sm font-medium underline underline-offset-2">
              {step.videoTitle || (learningStyle === "visual" ? "Watch Tutorial Video" : "Listen to Podcast")}
            </span>
          </a>
        </div>
      )}

      {videoLoading && <p className="text-gray-500 text-sm">Loading resources...</p>}
      {videoError && <p className="text-red-500 text-sm">{videoError}</p>}

      {step.methodology && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <h5 className="text-sm font-medium text-green-900 mb-1">Learning Approach</h5>
          <p className="text-sm text-green-700 leading-relaxed">{step.methodology}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Today's Learning Path</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Start with the introductory material</li>
          <li>Complete the practice exercises</li>
          <li>Review and test your understanding</li>
          <li>Apply concepts in mini-project</li>
        </ol>
      </div>

      {renderLearningResources(step, topic)}
      {renderGameElements(step.progress / 100)}
    </motion.div>
  );

  const renderLearningResources = (step: RoadmapActivity, topic: RoadmapTopic) => {
    switch (learningStyle) {
      case "visual":
        return (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Visual Learning Resources</h5>
            <div className="space-y-2">
              {step.videoUrl ? (
                <a
                  href={step.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Watch YouTube Video: {step.videoTitle}
                </a>
              ) : (
                <button
                  onClick={() => fetchYouTubeVideos(`${topic.name} ${step.detail}`, "video")}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Find YouTube Video Tutorial
                </button>
              )}
            </div>
          </div>
        );
      case "reading":
        return (
          <div className="mt-4 bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">Reading Resources</h5>
            <div className="space-y-2">
              <a
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(topic.name.replace(/\s+/g, '_'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Wikipedia Article: {topic.name}
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(topic.name + " documentation")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Official Documentation
              </a>
            </div>
          </div>
        );
      case "auditory":
        return (
          <div className="mt-4 bg-purple-50 p-4 rounded-lg">
            <h5 className="font-medium text-purple-900 mb-2">Audio Resources</h5>
            <div className="space-y-2">
              {step.videoUrl ? (
                <a
                  href={step.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Listen to YouTube Podcast: {step.videoTitle}
                </a>
              ) : (
                <button
                  onClick={() => fetchYouTubeVideos(`${topic.name} ${step.detail}`, "podcast")}
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Find YouTube Podcast
                </button>
              )}
            </div>
          </div>
        );
      case "kinesthetic":
        return (
          <div className="mt-4 bg-orange-50 p-4 rounded-lg">
            <h5 className="font-medium text-orange-900 mb-2">Hands-on Resources</h5>
            <div className="space-y-2">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(topic.name + " practical exercises")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-orange-600 hover:text-orange-700"
              >
                <HandHelping className="w-4 h-4 mr-2" />
                Practical Exercise: {topic.name}
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(topic.name + " experiments")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-orange-600 hover:text-orange-700"
              >
                <HandHelping className="w-4 h-4 mr-2" />
                Experiment: Build {topic.name}
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderGameElements = (dayProgress: number) => (
    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-purple-900">Daily XP Progress</span>
        <span className="text-sm font-medium text-purple-600">
          +{Math.round(dayProgress * 100)} XP
        </span>
      </div>
      <div className="w-full h-2 bg-purple-200 rounded-full">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${dayProgress * 100}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-purple-600">
        <span>Level {level}</span>
        <span>{dailyStreak} Day Streak! 🔥</span>
      </div>
    </div>
  );

  const isMilestoneDay = (dayIndex: number) => {
    if (!roadmapData?.projectMilestones) return false;
    return roadmapData.projectMilestones.some((m) => m.dayIndex === dayIndex);
  };

  const renderMilestone = (milestone: any, dayIndex: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 shadow-sm"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900">{milestone.title}</h4>
          <p className="text-sm text-amber-700">{milestone.description}</p>
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    if (tags.length && deadline && roadmapData) {
      handleGenerateRoadmap();
    }
  }, [displayMode, deadline]);

  const [sidebarData] = useState({
    previousRoadmaps: [
      {
        id: "1",
        title: "React Development",
        completionDate: "2024-01-15",
        progress: 100,
        badge: { icon: "⚛️", name: "React Master", description: "Completed React fundamentals" },
      },
      {
        id: "2",
        title: "Machine Learning Basics",
        completionDate: "2023-12-20",
        progress: 85,
        badge: { icon: "🤖", name: "ML Explorer", description: "Completed ML fundamentals" },
      },
    ],
    earnedBadges: [
      { icon: "⚛️", name: "React Master", description: "Completed React fundamentals" },
      { icon: "🤖", name: "ML Explorer", description: "Completed ML fundamentals" },
    ],
  });

  const StaticSidebar = memo(() => (
    <div className="w-80 shrink-0">
      <div className="fixed w-80 h-[calc(100vh-3rem)] top-6 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-lg">Previous Roadmaps</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
            {sidebarData.previousRoadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="group border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <h4 className="font-medium text-gray-800 mb-3">{roadmap.title}</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{roadmap.progress}%</span>
                </div>
                {roadmap.badge && (
                  <div className="flex items-center mt-3 text-yellow-600">
                    <span className="text-xl mr-2">{roadmap.badge.icon}</span>
                    <span className="text-sm">{roadmap.badge.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 border-t border-gray-100 p-6 bg-gradient-to-t from-white to-transparent backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Earned Badges</h3>
            <div className="grid grid-cols-3 gap-3">
              {sidebarData.earnedBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-sm transition-all duration-300"
                  title={badge.description}
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <span className="text-xs text-gray-600 text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  const VirtualizedDayList = memo(({ items }: { items: RoadmapItem[] }) => (
    <div className="flex overflow-x-auto gap-6 pb-6">
      {items.map((day, dayIndex) => (
        <motion.div
          key={dayIndex}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(dayIndex * 0.05, 1) }}
          className={`${
            isMilestoneDay(dayIndex)
              ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              : "bg-white"
          } rounded-xl shadow-lg overflow-hidden min-w-[300px] relative flex flex-col`}
        >
          {streak > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center text-sm">
              <Flame size={16} className="mr-1" />
              {streak} day streak
            </div>
          )}

          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">
                  {displayMode === "day"
                    ? `Day ${dayIndex + 1}`
                    : displayMode === "week"
                    ? `Week ${dayIndex + 1}`
                    : `Month ${dayIndex + 1}`}
                </h3>
                <span className="text-sm text-blue-600 font-medium">
                  {Math.round(memoizedProgressiveCompletion(dayIndex))}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${memoizedProgressiveCompletion(dayIndex)}%` }}
                  transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-500">{day.date}</p>
            </div>
          </div>

          {isMilestoneDay(dayIndex) && (
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-medium">
              <div className="flex items-center justify-between">
                <span className="flex items-center">🏆 Project Milestone</span>
                <span className="text-yellow-100 text-xs">Achievement Unlocked</span>
              </div>
            </div>
          )}

          <div className="p-4">
            {day.topics.map((topic, topicIndex) => (
              <div key={topicIndex} className="mb-4">
                <button
                  onClick={() => toggleTopicExpansion(dayIndex, topicIndex)}
                  className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg text-left mb-2 hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{topic.name}</span>
                  {expandedTopics[`${dayIndex}-${topicIndex}`] ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {expandedTopics[`${dayIndex}-${topicIndex}`] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      layout="position"
                      className="border border-gray-200 rounded-lg p-2"
                    >
                      {topic.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="p-4 border-b last:border-b-0 border-gray-100"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-3 ${
                                  step.isCompleted ? "bg-green-500" : "bg-blue-500"
                                }`}
                              />
                              <h4 className="font-medium text-gray-800">{step.type}</h4>
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                step.progress === 100 ? "text-green-500" : "text-blue-500"
                              }`}
                            >
                              {step.progress}%
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{step.detail}</p>

                          {timelineScale < 100 && (
                            <div className="mb-3 flex items-center text-orange-500 text-sm">
                              <span className="font-medium mr-1">Intensity:</span>
                              <span>{step.intensity}x</span>
                            </div>
                          )}

                          {renderStepDetails(step, topic)}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center text-green-600">
            <Sparkles size={16} className="mr-2" />
            <span className="text-sm">{day.timeSaved}</span>
          </div>
        </motion.div>
      ))}
    </div>
  ));

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-32 w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 75, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="flex gap-6 max-w-[1600px] mx-auto relative" style={{ zIndex: 1 }}>
        <div className="flex-1 min-w-0 max-w-[calc(100%-320px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Create Your Learning Roadmap
              </h1>

              <div className="mb-8">
                <label className="block text-gray-700 mb-2 font-medium">
                  What skills do you want to learn?
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="E.g., GATE Preparation, Machine Learning, React Development"
                    className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleGenerateRoadmap}
                    disabled={isLoading || !tags.length || !deadline}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-blue-300"
                  >
                    {isLoading ? "Generating..." : "Generate Roadmap"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(index)}
                        className="ml-2 text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 mb-2 font-medium">Deadline</label>
                <DatePicker
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                  minDate={new Date()}
                  className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select deadline"
                />
              </div>

              {renderTimelineControls()}
            </div>

            {isLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Crafting your personalized learning journey...
                </p>
              </div>
            ) : roadmapData ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Your{" "}
                      {displayMode === "day"
                        ? roadmapData.items.length + "-Day"
                        : displayMode === "week"
                        ? Math.ceil(roadmapData.items.length / 7) + "-Week"
                        : Math.ceil(roadmapData.items.length / 30) + "-Month"}{" "}
                      {roadmapData.skillName} Plan
                    </h2>

                    <div className="w-48">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Timeline</span>
                        <span className="text-sm font-medium text-blue-600">
                          {timelineScale}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={timelineScale}
                        onChange={(e) => handleTimelineChange(Number(e.target.value))}
                        className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <Calendar className="text-blue-500 mr-2" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Completion</p>
                        <p className="font-semibold">{roadmapData.estimatedCompletionDate}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <Gauge className="text-blue-500 mr-2" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${roadmapData.totalCompletionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Difficulty:</span>
                        <span className={`font-medium ${getDifficultyColor(roadmapData.difficulty)}`}>
                          {roadmapData.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Current Milestone</p>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {roadmapData?.currentMilestone?.title || "Getting Started"}
                        </span>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${roadmapData?.currentMilestone?.progress ?? 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {roadmapData?.currentMilestone?.progress ?? 0}%
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          Next: {roadmapData?.currentMilestone?.nextMilestone || "Loading..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <VirtualizedDayList items={roadmapData.items} />
              </motion.div>
            ) : null}
          </motion.div>
        </div>

        <StaticSidebar />
      </div>
    </div>
  );
};

export default RoadmapComponent;