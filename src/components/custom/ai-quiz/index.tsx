"use client";
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaClock, FaBook, FaQuestionCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Initialize Google Generative AI with environment variable
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Type Definitions
type Exam = {
  id: string;
  name: string;
  courses: Course[];
};

type Course = {
  id: string;
  name: string;
  subjects: Subject[];
};

type Subject = {
  id: string;
  name: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  competency?: string;
};

type QuizResult = {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
  competencyScores?: { [key: string]: number };
};

type RoleFitAnalysis = {
  role: string;
  fitScore: number;
  recommendation: string;
};

type TestHistory = {
  id: number;
  mode: "exam" | "competency";
  examName: string;
  courses: string[];
  subjects: string[];
  questions: QuizQuestion[];
  userAnswers: number[];
  result: QuizResult;
  timestamp: string;
};

// Constants
const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
const questionCounts = [5, 10, 15, 20, 25];
const timeLimits = [5, 10, 15, 30, 45, 60];

// Initial history data provided by the user
const initialHistory: TestHistory[] = [
  {
    id: 1,
    mode: "exam",
    examName: "GATE",
    courses: ["Computer Science"],
    subjects: ["Algorithms"],
    questions: [
      {
        question: "What is the time complexity of finding the kth smallest element in an unsorted array using quickselect algorithm in the worst case?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
        correctAnswer: 2,
      },
      {
        question: "Which of the following algorithms is NOT a greedy algorithm?",
        options: ["Kruskal's algorithm", "Prim's algorithm", "Bellman-Ford algorithm", "Dijkstra's algorithm"],
        correctAnswer: 2,
      },
      {
        question: "A graph is represented using an adjacency matrix. What is the time complexity of finding all neighbors of a given vertex?",
        options: ["O(1)", "O(V)", "O(V^2)", "O(E)"],
        correctAnswer: 1,
      },
      {
        question: "Which data structure is most suitable for implementing a priority queue?",
        options: ["Array", "Linked List", "Binary Search Tree", "Heap"],
        correctAnswer: 3,
      },
      {
        question: "Given a directed acyclic graph (DAG), which algorithm can be used to find the shortest path from a single source vertex to all other vertices?",
        options: ["Floyd-Warshall algorithm", "Dijkstra's algorithm", "Topological sort followed by a single-source shortest path algorithm", "Bellman-Ford algorithm"],
        correctAnswer: 2,
      },
    ],
    userAnswers: [1, 2, 1, 2, 0],
    result: {
      totalQuestions: 5,
      correctAnswers: 2,
      score: 40.0,
      timeTaken: 0, // Time taken not provided, default to 0
    },
    timestamp: "2025-03-09T08:14:28Z",
  },
  {
    id: 2,
    mode: "competency",
    examName: "Leadership Assessment",
    courses: ["Strategic Leadership"],
    subjects: ["Vision & Strategy"],
    questions: [
      {
        question: "Your team is developing a new software feature. A competing product launches a similar feature with superior performance. How do you adapt your team's strategy to maintain a competitive edge?",
        options: [
          "Ignore the competitor and continue as planned",
          "Analyze the competitor's feature, identify areas for improvement in your own design, and adjust your development roadmap accordingly",
          "Rush your feature to market regardless of quality",
          "Copy the competitor's feature exactly",
        ],
        correctAnswer: 1,
        competency: "Vision & Strategy",
      },
      {
        question: "You've identified a significant technological shift that could impact your team's long-term projects. How should you communicate this to your team and stakeholders?",
        options: [
          "Keep it to yourself until the impact is clear",
          "Present a comprehensive analysis of the technological shift, its potential impacts, and propose potential mitigation strategies",
          "Send a brief email with no details",
          "Wait for someone else to bring it up",
        ],
        correctAnswer: 1,
        competency: "Vision & Strategy",
      },
      {
        question: "Your team is struggling to meet a tight deadline for a critical software update. How do you effectively manage the situation and ensure project success?",
        options: [
          "Push the team harder without changing anything",
          "Re-evaluate priorities, identify bottlenecks, and delegate tasks accordingly. Seek additional resources if needed",
          "Miss the deadline and apologize later",
          "Blame the team for the delay",
        ],
        correctAnswer: 1,
        competency: "Vision & Strategy",
      },
      {
        question: "A new open-source library emerges that could significantly improve the efficiency of your team's code. How do you assess its suitability for integration into your projects?",
        options: [
          "Integrate it immediately without review",
          "Evaluate the library's documentation, performance benchmarks, community support, and security aspects before deciding on integration",
          "Ignore it because it’s open-source",
          "Ask a junior developer to decide",
        ],
        correctAnswer: 1,
        competency: "Vision & Strategy",
      },
      {
        question: "You need to define a clear vision for your team's next major software release. Which approach is most effective?",
        options: [
          "Define it alone without team input",
          "Collaboratively define the vision with your team, incorporating their input and expertise, and aligning it with the overall company strategy",
          "Copy a competitor’s vision",
          "Leave it vague and figure it out later",
        ],
        correctAnswer: 1,
        competency: "Vision & Strategy",
      },
    ],
    userAnswers: [1, 1, 1, 1, 1],
    result: {
      totalQuestions: 5,
      correctAnswers: 5,
      score: 100.0,
      timeTaken: 0, // Time taken not provided, default to 0
      competencyScores: { "Vision & Strategy": 100.0 },
    },
    timestamp: "2025-03-09T08:15:09Z",
  },
];

const MockTestGenerator: React.FC = () => {
  const [mode, setMode] = useState<"exam" | "competency">("exam");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingExams, setLoadingExams] = useState<boolean>(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [competencies, setCompetencies] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(15);
  const [difficultyLevel, setDifficultyLevel] = useState<string>("Medium");
  const [customRole, setCustomRole] = useState<string>("");
  const [quizState, setQuizState] = useState<"setup" | "taking" | "results">("setup");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [roleFitAnalysis, setRoleFitAnalysis] = useState<RoleFitAnalysis[]>([]);
  const [testHistory, setTestHistory] = useState<TestHistory[]>(initialHistory);

  // Fetch initial data and load history on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingExams(true);

        const examPrompt = `
          Generate a JSON object containing educational exam types, their courses, and subjects.
          Include 5 popular exam types (like GRE, GATE, GMAT, SAT, etc.), with 3-5 courses each, and 3-5 subjects per course.
          Format the response as a valid JSON array containing objects with this structure:
          [
            {
              "id": "unique-id",
              "name": "Exam Name",
              "courses": [
                {
                  "id": "course-id",
                  "name": "Course Name",
                  "subjects": [
                    {
                      "id": "subject-id",
                      "name": "Subject Name"
                    }
                  ]
                }
              ]
            }
          ]
          Only provide the JSON without any explanation.
        `;
        const examResult = await model.generateContent(examPrompt);
        const examResponse = await examResult.response;
        const examText = examResponse.text();
        const examJsonMatch = examText.match(/\[[\s\S]*\]/);
        if (examJsonMatch) {
          setExams(JSON.parse(examJsonMatch[0]) as Exam[]);
        }

        const competencyPrompt = `
          Generate a JSON object containing competency-based exam types for HR evaluations, their courses, and subjects.
          Include 5 exam types (e.g., Leadership Assessment, Technical Skills, Soft Skills, etc.), with 3-5 courses each, and 3-5 subjects per course.
          Format the response as a valid JSON array containing objects with this structure:
          [
            {
              "id": "unique-id",
              "name": "Exam Name",
              "courses": [
                {
                  "id": "course-id",
                  "name": "Course Name",
                  "subjects": [
                    {
                      "id": "subject-id",
                      "name": "Subject Name"
                    }
                  ]
                }
              ]
            }
          ]
          Only provide the JSON without any explanation.
        `;
        const competencyResult = await model.generateContent(competencyPrompt);
        const competencyResponse = await competencyResult.response;
        const competencyText = competencyResponse.text();
        const competencyJsonMatch = competencyText.match(/\[[\s\S]*\]/);
        if (competencyJsonMatch) {
          setCompetencies(JSON.parse(competencyJsonMatch[0]) as Exam[]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setExams([]);
        setCompetencies([]);
      } finally {
        setLoadingExams(false);
      }
    }
    fetchData();

    const loadHistoryFromDB = async () => {
      try {
        const response = await fetch("/api/quiz");
        if (response.ok) {
          const data = await response.json();
          // Merge initial history with fetched data, avoiding duplicates
          setTestHistory((prev) => {
            const combined = [...prev, ...data.filter((item: TestHistory) => !prev.some((p) => p.id === item.id))];
            return combined.sort((a, b) => a.id - b.id);
          });
        }
      } catch (error) {
        console.error("Error loading history:", error);
      }
    };
    loadHistoryFromDB();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizState === "taking" && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState, remainingTime]);

  const currentData = mode === "exam" ? exams : competencies;
  const availableCourses = currentData.find((exam) => exam.id === selectedExam)?.courses || [];
  const availableSubjects = availableCourses
    .filter((course) => selectedCourses.includes(course.id))
    .flatMap((course) => course.subjects);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExam(e.target.value);
    setSelectedCourses([]);
    setSelectedSubjects([]);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        const newCourses = prev.filter((id) => id !== courseId);
        const courseSubjectIds = availableCourses
          .find((course) => course.id === courseId)
          ?.subjects.map((subject) => subject.id) || [];
        setSelectedSubjects((prevSubjects) =>
          prevSubjects.filter((id) => !courseSubjectIds.includes(id))
        );
        return newCourses;
      }
      return [...prev, courseId];
    });
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  const generateQuiz = async () => {
    if (!selectedExam || selectedCourses.length === 0 || selectedSubjects.length === 0) {
      alert("Please select an exam/competency, at least one course, and at least one subject");
      return;
    }

    setLoading(true);
    try {
      const selectedExamName = currentData.find((exam) => exam.id === selectedExam)?.name;
      const selectedCourseNames = availableCourses
        .filter((course) => selectedCourses.includes(course.id))
        .map((course) => course.name);
      const selectedSubjectNames = availableSubjects
        .filter((subject) => selectedSubjects.includes(subject.id))
        .map((subject) => subject.name);

      const prompt = mode === "exam"
        ? `
          Generate a mock test for ${selectedExamName} exam.
          Courses: ${selectedCourseNames.join(", ")}
          Subjects: ${selectedSubjectNames.join(", ")}
          Number of questions: ${numberOfQuestions}
          Difficulty level: ${difficultyLevel}
          Format the response as a valid JSON array of questions with this structure:
          [
            {
              "question": "Question text here?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 0
            }
          ]
          Only provide the JSON without any explanation.
        `
        : `
          Generate a competency-based assessment for ${selectedExamName}.
          Courses: ${selectedCourseNames.join(", ")}
          Subjects: ${selectedSubjectNames.join(", ")}
          Number of questions: ${numberOfQuestions}
          Difficulty level: ${difficultyLevel}
          ${customRole ? `Customize for role: ${customRole}` : ""}
          Format the response as a valid JSON array of questions with this structure:
          [
            {
              "question": "Question text here?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 0,
              "competency": "Subject Name or Competency Area"
            }
          ]
          Only provide the JSON without any explanation.
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]) as QuizQuestion[];
        setQuizQuestions(quizData);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(quizData.length).fill(-1));
        setRemainingTime(timeLimit * 60);
        setQuizState("taking");
      } else {
        throw new Error("Failed to parse quiz data");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Error generating quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = async () => {
    const correctAnswers = userAnswers.reduce((count, answer, index) => {
      return count + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    const score = (correctAnswers / quizQuestions.length) * 100;
    const timeTaken = timeLimit * 60 - remainingTime;

    let newResult: QuizResult;
    if (mode === "competency") {
      const competencyScores: { [key: string]: { correct: number; total: number } } = {};
      quizQuestions.forEach((q, i) => {
        const competency = q.competency || "General";
        if (!competencyScores[competency]) {
          competencyScores[competency] = { correct: 0, total: 0 };
        }
        competencyScores[competency].total += 1;
        if (userAnswers[i] === q.correctAnswer) {
          competencyScores[competency].correct += 1;
        }
      });
      const formattedCompetencyScores = Object.fromEntries(
        Object.entries(competencyScores).map(([key, value]) => [
          key,
          (value.correct / value.total) * 100,
        ])
      );

      newResult = {
        totalQuestions: quizQuestions.length,
        correctAnswers,
        score,
        timeTaken,
        competencyScores: formattedCompetencyScores,
      };

      const roles = customRole
        ? [customRole, "General Role 1", "General Role 2"]
        : ["Team Lead", "Software Engineer", "Project Manager"];
      const roleFit = roles.map((role) => ({
        role,
        fitScore: Math.min(100, score + Math.floor(Math.random() * 20) - 10),
        recommendation:
          score > 75
            ? "Strong fit for this role."
            : score > 50
            ? "Moderate fit; may require training."
            : "Not recommended without significant improvement.",
      }));
      setRoleFitAnalysis(roleFit);
    } else {
      newResult = {
        totalQuestions: quizQuestions.length,
        correctAnswers,
        score,
        timeTaken,
      };
      setRoleFitAnalysis([]);
    }

    setQuizResult(newResult);

    const selectedExamName = currentData.find((exam) => exam.id === selectedExam)?.name || "Unknown";
    const selectedCourseNames = availableCourses
      .filter((course) => selectedCourses.includes(course.id))
      .map((course) => course.name);
    const selectedSubjectNames = availableSubjects
      .filter((subject) => selectedSubjects.includes(subject.id))
      .map((subject) => subject.name);

    const newHistoryEntry: TestHistory = {
      id: testHistory.length + 1,
      mode,
      examName: selectedExamName,
      courses: selectedCourseNames,
      subjects: selectedSubjectNames,
      questions: quizQuestions,
      userAnswers,
      result: newResult,
      timestamp: new Date().toISOString(),
    };

    setTestHistory((prev) => [...prev, newHistoryEntry]);

    // Save to server-side API (which will append to history.json)
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHistoryEntry),
      });
      if (!response.ok) throw new Error("Failed to save history");
    } catch (error) {
      console.error("Error saving to DB:", error);
    }

    setQuizState("results");
  };

  const resetQuiz = () => {
    setQuizState("setup");
    setQuizQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizResult(null);
    setRoleFitAnalysis([]);
    setCustomRole("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const generateDummyScores = (userScore: number, count: number) => {
    const indianNames = [
      "Aarav",
      "Priya",
      "Rohan",
      "Sneha",
      "Arjun",
      "Vikram",
      "Ananya",
      "Rahul",
      "Meera",
    ];
    const scores = [];
    for (let i = 0; i < count; i++) {
      const variation = Math.floor(Math.random() * 41) - 20;
      const score = Math.max(0, Math.min(100, userScore + variation));
      scores.push({ username: indianNames[i % indianNames.length], score });
    }
    return scores;
  };

  const renderSetup = () => (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setMode("exam")}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors duration-200 ${
              mode === "exam"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Exam Mode
          </button>
          <button
            onClick={() => setMode("competency")}
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors duration-200 ${
              mode === "competency"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Competency Mode
          </button>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        {mode === "exam" ? "Mock Test Generator" : "Competency Diagnostic Tool"}
      </h2>
      {loadingExams ? (
        <div className="text-center text-gray-600">Loading data...</div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {mode === "exam" ? "Exam" : "Assessment Type"}
            </label>
            <select
              value={selectedExam}
              onChange={handleExamChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select an option --</option>
              {currentData.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
          {selectedExam && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {mode === "exam" ? "Courses" : "Competency Areas"}
              </label>
              <div className="space-y-2">
                {availableCourses.map((course) => (
                  <div key={course.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`course-${course.id}`}
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleCourseChange(course.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`course-${course.id}`}
                      className="ml-2 text-sm text-gray-700 hover:text-indigo-600"
                    >
                      {course.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedCourses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {mode === "exam" ? "Subjects" : "Specific Skills"}
              </label>
              <div className="space-y-2">
                {availableSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`subject-${subject.id}`}
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => handleSubjectChange(subject.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`subject-${subject.id}`}
                      className="ml-2 text-sm text-gray-700 hover:text-indigo-600"
                    >
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mode === "competency" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customize for Role (Optional)
              </label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g., Software Developer"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Number of Questions
              </label>
              <select
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="mt-1 block w-full p-3 border border-blue-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {questionCounts.map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Time Limit (minutes)
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="mt-1 block w-full p-3 border border-blue-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {timeLimits.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="mt-1 block w-full p-3 border border-blue-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={generateQuiz}
              disabled={
                loading ||
                !selectedExam ||
                selectedCourses.length === 0 ||
                selectedSubjects.length === 0
              }
              className={`px-8 py-3 rounded-md text-white font-medium transition-colors duration-200 ${
                loading ||
                !selectedExam ||
                selectedCourses.length === 0 ||
                selectedSubjects.length === 0
                  ? "bg-green-100 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-500"
              }`}
            >
              {loading ? "Generating..." : mode === "exam" ? "Generate Quiz" : "Start Assessment"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderQuiz = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold text-gray-800">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>
          <div className="text-xl font-semibold text-red-600">
            Time: {formatTime(remainingTime)}
          </div>
        </div>
        <div className="border-b pb-4 mb-4">
          <h3 className="text-2xl font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 rounded-lg cursor-pointer border transition-colors duration-200 ${
                  userAnswers[currentQuestionIndex] === index
                    ? "bg-indigo-100 border-indigo-500 border-2"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start">
                  <span className="h-6 w-6 text-center inline-flex items-center justify-center rounded-full border border-gray-400 mr-3 font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Previous
          </button>
          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={finishQuiz}
              className="px-6 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200"
            >
              Finish {mode === "exam" ? "Quiz" : "Assessment"}
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!quizResult) return null;

    const selectedExamName = currentData.find((exam) => exam.id === selectedExam)?.name || "Unknown";
    const dummyScores = generateDummyScores(quizResult.score, 9);
    const leaderboard = [
      ...dummyScores,
      { username: "You", score: quizResult.score },
    ].sort((a, b) => b.score - a.score);
    const userRank = leaderboard.findIndex((entry) => entry.username === "You") + 1;

    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
          {mode === "exam" ? "Quiz Results" : "Competency Profile Report"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-green-600">
              {quizResult.correctAnswers}/{quizResult.totalQuestions}
            </div>
            <div className="text-sm text-gray-600 mt-2">Correct Answers</div>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-indigo-600">
              {quizResult.score.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">Overall Score</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-gray-600">
              {Math.floor(quizResult.timeTaken / 60)}:
              {(quizResult.timeTaken % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-gray-600 mt-2">Time Taken</div>
          </div>
        </div>

        {mode === "competency" && quizResult.competencyScores && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Competency Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(quizResult.competencyScores).map(([competency, score]) => (
                <div key={competency} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{competency}</span>
                    <span className="text-indigo-600 font-bold">{score.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "competency" && roleFitAnalysis.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Role-Fit Analysis</h3>
            <div className="space-y-4">
              {roleFitAnalysis.map((role) => (
                <div
                  key={role.role}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{role.role}</span>
                    <span className="text-indigo-600 font-bold">{role.fitScore}%</span>
                  </div>
                  <p className="text-gray-600 mt-2">{role.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {mode === "exam" ? "Leaderboard" : "Industry Benchmarking"} ({selectedExamName})
          </h3>
          <table className="min-w-full divide-y divide-gray-300 bg-white rounded-xl shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <tr
                  key={index}
                  className={`${
                    entry.username === "You" ? "bg-blue-100 font-bold text-blue-800" : index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{entry.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {entry.score.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-gray-600">
            Your rank: <span className="font-bold text-indigo-600">#{userRank}</span> out of{" "}
            {leaderboard.length}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetQuiz}
            className="px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200"
          >
            Create New {mode === "exam" ? "Quiz" : "Assessment"}
          </button>
        </div>
      </div>
    );
  };

  const renderHistoryPanel = () => (
    <div className="w-1/3 p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-screen border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FaBook className="mr-2 text-indigo-600" /> Test History
      </h3>
      {testHistory.length === 0 ? (
        <p className="text-gray-500 italic text-center">No test history available yet.</p>
      ) : (
        <div className="space-y-4">
          {testHistory.map((entry) => (
            <div
              key={entry.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-indigo-700 truncate">{entry.examName}</h4>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    entry.result.score >= 75
                      ? "bg-green-100 text-green-700"
                      : entry.result.score >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {entry.result.score.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <FaClock className="mr-1" /> {new Date(entry.timestamp).toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Mode:</span>{" "}
                  <span className="capitalize">{entry.mode}</span>
                </p>
                <p>
                  <span className="font-medium">Courses:</span> {entry.courses.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Subjects:</span> {entry.subjects.join(", ")}
                </p>
              </div>
              <details className="mt-3">
                <summary className="text-sm text-indigo-600 font-medium cursor-pointer flex items-center hover:text-indigo-800 transition-colors duration-200">
                  <FaQuestionCircle className="mr-1" /> View Questions & Answers
                </summary>
                <div className="mt-3 space-y-3 text-sm transition-all duration-300 ease-in-out">
                  {entry.questions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <p className="flex items-center mt-1">
                        <span className="font-medium text-gray-600">Your Answer:</span>{" "}
                        <span className="ml-1">
                          {q.options[entry.userAnswers[i]] || "Not answered"}
                        </span>
                        {entry.userAnswers[i] === q.correctAnswer ? (
                          <FaCheckCircle className="ml-2 text-green-500" />
                        ) : (
                          <FaTimesCircle className="ml-2 text-red-500" />
                        )}
                      </p>
                      <p className="mt-1 text-gray-600">
                        <span className="font-medium">Correct Answer:</span>{" "}
                        {q.options[q.correctAnswer]}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex space-x-6">
        <div className="w-2/3">
          {quizState === "setup" && renderSetup()}
          {quizState === "taking" && renderQuiz()}
          {quizState === "results" && renderResults()}
        </div>
        {renderHistoryPanel()}
      </div>
    </div>
  );
};

export default MockTestGenerator;