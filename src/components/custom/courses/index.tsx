"use client";

import { useState, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Play, FileText, Upload } from "lucide-react";
import { div } from "framer-motion/client";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const documentationData = [
  {
    title: "Kotlin Starter Template",
    description: "Get started by cloning the template",
    docsUrl: "https://kotlinlang.org/docs/home.html",
    githubUrl: "https://github.com/Kotlin/kotlin",
  },
  {
    title: "NextJS Example",
    description: "Clone the template and get going",
    docsUrl: "https://nextjs.org/docs",
    githubUrl: "https://github.com/vercel/next.js",
  },
  {
    title: "Nuxt.js Example",
    description: "Crowdsourced Nuxt.js example",
    docsUrl: "https://nuxtjs.org/docs",
    githubUrl: "https://github.com/nuxt/nuxt.js",
  },
  {
    title: "Vue Starter Template",
    description: "Quick start with Vue.js template",
    docsUrl: "https://vuejs.org/v2/guide/",
    githubUrl: "https://github.com/vuejs/vue",
  },
  {
    title: "React Starter Template",
    description: "Start a project with React template",
    docsUrl: "https://reactjs.org/docs/getting-started.html",
    githubUrl: "https://github.com/facebook/react",
  },
  {
    title: "Angular Starter Template",
    description: "Clone the Angular template and start coding",
    docsUrl: "https://angular.io/docs",
    githubUrl: "https://github.com/angular/angular",
  },
  {
    title: "Express.js Starter Template",
    description: "Start your server-side project with Express",
    docsUrl: "https://expressjs.com/en/starter/installing.html",
    githubUrl: "https://github.com/expressjs/express",
  },
  {
    title: "Python Flask Starter Template",
    description: "Quick start with Flask for Python",
    docsUrl: "https://flask.palletsprojects.com/en/2.0.x/",
    githubUrl: "https://github.com/pallets/flask",
  },
  {
    title: "Ruby on Rails Starter Template",
    description: "Start building with Rails",
    docsUrl: "https://guides.rubyonrails.org/getting_started.html",
    githubUrl: "https://github.com/rails/rails",
  },
];

const coursesData = [
  {
    title: "Modern React with Redux",
    description: "Master React and Redux with practical projects",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    url: "https://www.udemy.com/course/react-redux/",
  },
  {
    title: "Complete Python Bootcamp",
    description: "Learn Python from basics to advanced",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=2074&auto=format&fit=crop",
    url: "https://www.udemy.com/course/complete-python-bootcamp/",
  },
  {
    title: "Web Development Bootcamp",
    description: "Full stack web development course",
    image:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop",
    url: "https://www.udemy.com/course/the-web-developer-bootcamp/",
  },
  {
    title: "JavaScript Mastery",
    description: "Advanced JavaScript concepts and patterns",
    image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop",
    url: "https://www.udemy.com/course/javascript-mastery/",
  },
  {
    title: "Machine Learning A-Z",
    description: "Complete machine learning and AI course",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    url: "https://www.udemy.com/course/machinelearning/",
  },
  {
    title: "iOS Development",
    description: "Build iOS apps with Swift",
    image:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2069&auto=format&fit=crop",
    url: "https://www.udemy.com/course/ios-development/",
  },
];

const youtubeData = [
  {
    title: "React Crash Course 2024",
    description: "Learn React fundamentals in this comprehensive crash course",
    thumbnail: "https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
  },
  {
    title: "TypeScript Full Course",
    description: "Master TypeScript from scratch with practical examples",
    thumbnail: "https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
  },
  {
    title: "Next.js Tutorial for Beginners",
    description: "Build modern web applications with Next.js",
    thumbnail: "https://img.youtube.com/vi/mTz0GXj8NN0/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=mTz0GXj8NN0",
  },
  {
    title: "Full Stack Development Guide",
    description: "Complete guide to becoming a full stack developer",
    thumbnail: "https://img.youtube.com/vi/7k7ETzqOxn8/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=7k7ETzqOxn8",
  },
];

// Update aiAssistantData with correct public path
const aiAssistantData = {
  videoPath: "/ai.mp4", // Replace with your video file
};

const genAI = new GoogleGenerativeAI("AIzaSyD9VAzUs_dXG_vaDSzy_cF89U8oN1yKVIc");

export function Skillmanagement() {
  const [selectedTab, setSelectedTab] = useState("ai-assistant");
  const [userMessage, setUserMessage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const speechSynthesis =
    typeof window !== "undefined" ? window.speechSynthesis : null;
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGeminiRequest = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!message.trim()) {
        throw new Error("Please enter a message");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Please provide a short and concise response in a friendly, conversational tone. Keep it brief and easy to understand.

Question: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("No response from AI");
      }

      setAiResponse(text);
      return text;
    } catch (error: any) {
      const errorMessage = error.message || "Something went wrong";
      setError(errorMessage);
      setAiResponse("");
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSpeak = async () => {
    if (!speechSynthesis || !userMessage.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Get response from Gemini
    const response = await handleGeminiRequest(userMessage);

    // Configure speech settings
    const utterance = new SpeechSynthesisUtterance(response);

    // Get available voices and select a male voice
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(
      (voice) => voice.gender === "male" || voice.name.includes("Male")
    );

    // Configure voice settings
    utterance.voice = maleVoice || voices[0]; // Fallback to default if no male voice
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    // Start speaking
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (videoRef.current) {
        videoRef.current.play();
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    speechSynthesis.speak(utterance);
  };

  // Simplified renderAIAssistantContent
  const renderAIAssistantContent = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center w-full"
    >
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-6">
        <div className="relative h-[60vh] w-full">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <p>Unable to load animation. Please check the file path.</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-gray-800"
              loop
              muted
              playsInline
              onError={() => setImageError(true)}
            >
              <source src={aiAssistantData.videoPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="relative p-6">
          <motion.div className="w-full max-w-2xl mx-auto space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-500 mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}
            {aiResponse && !error && (
              <div className="bg-gray-800 p-4 rounded-lg text-white mb-4">
                <p className="text-sm">{aiResponse}</p>
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask your AI assistant..."
                className="w-full px-6 py-4 bg-gray-800 text-white rounded-full border-2 border-sky-500 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSpeak();
                  }
                }}
              />
              <Button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 py-2 transition-all duration-300"
                onClick={handleSpeak}
                disabled={isLoading || isSpeaking}
              >
                {isLoading
                  ? "Processing..."
                  : isSpeaking
                  ? "Speaking..."
                  : "Send"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderDocumentationContent = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {documentationData.map((doc, index) => (
        <motion.div key={index} variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => window.open(doc.docsUrl, "_blank")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Docs
              </Button>
              <Button
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => window.open(doc.githubUrl, "_blank")}
              >
                <Book className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderCoursesContent = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {coursesData.map((course, index) => (
        <motion.div key={index} variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
              <motion.img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {course.title}
              </CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => window.open(course.url, "_blank")}
              >
                Start Course
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderYoutubeContent = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {youtubeData.map((video, index) => (
        <motion.div key={index} variants={item}>
          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative w-full sm:w-48 h-42 overflow-hidden">
                <motion.img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover p-2"
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold mb-1 hover:text-red-600 transition-colors duration-200">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {video.description}
                </p>
                <Button
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => window.open(video.url, "_blank")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-white dark:bg-gray-900 min-h-screen relative">
      {" "}
      {/* Added relative for positioning */}
      <div className="absolute top-4 right-4">
        <Link href="/resume-builder" passHref legacyBehavior>
          <a>
            {" "}
            {/* Wrap Button in an <a> tag */}
            <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm hover:shadow-md transition-all duration-200">
              Resume Builder
            </Button>
          </a>
        </Link>
      </div>
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-extrabold mb-8 text-sky-700 dark:text-sky-300"
      >
        Skill Management
      </motion.h1>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 h-9 mb-7">
            <TabsTrigger
              value="ai-assistant"
              className="h-9 hover:bg-sky-100 data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 6V18M6 12H18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                AI Assistant
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="h-9 hover:bg-sky-100 data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-colors duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="h-9 hover:bg-sky-100 data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-colors duration-200"
            >
              <Book className="w-4 h-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="youtube"
              className="h-9 hover:bg-sky-100 data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-colors duration-200"
            >
              <Play className="w-4 h-4 mr-2" />
              YouTube
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab === "ai-assistant" && renderAIAssistantContent()}
              {selectedTab === "documentation" && renderDocumentationContent()}
              {selectedTab === "courses" && renderCoursesContent()}
              {selectedTab === "youtube" && renderYoutubeContent()}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default Skillmanagement;