"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  BookOpen,
  Target,
  Briefcase,
  User,
  Award,
  CheckCircle,
  School,
  Building,
  Code,
  BarChart,
  Palette,
  Search,
  Cloud,
  Shield,
  BrainCircuit,
  Search as SearchIcon,
  Plus,
  Smartphone,
  Settings,
  Gamepad,
  Link,
} from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    education: "",
    experience: "",
    interests: [],
    learningStyle: "",
    timeCommitment: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [showAddTopic, setShowAddTopic] = useState(false);

  const totalSteps = 5;

  // Update progress bar when step changes
  useEffect(() => {
    setProgress((step / totalSteps) * 100);
  }, [step, totalSteps]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted data:", userData);
    window.location.href = "/dashboard";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectOption = (field, value) => {
    // Reset dependent fields when certain options change
    if (field === "education") {
      // Reset experience if education changes
      setUserData((prev) => ({
        ...prev,
        [field]: value,
        experience: "",
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const toggleInterest = (interest) => {
    setUserData((prev) => {
      const currentInterests = [...prev.interests];
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter((item) => item !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest],
        };
      }
    });
  };

  // Check if current step is complete to enable Next button
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return (
          userData.firstName.trim() !== "" && userData.lastName.trim() !== ""
        );
      case 2:
        return userData.education !== "";
      case 3:
        return userData.experience !== "";
      case 4:
        return userData.interests.length > 0;
      case 5:
        return userData.learningStyle !== "" && userData.timeCommitment !== "";
      default:
        return false;
    }
  };

  // Array of interests options
  const interestOptions = [
    { name: "Programming", icon: <Code /> },
    { name: "Data Science", icon: <BarChart /> },
    { name: "Design", icon: <Palette /> },
    { name: "Marketing", icon: <Search /> },
    { name: "Business", icon: <Briefcase /> },
    { name: "Cloud", icon: <Cloud /> },
    { name: "Cybersecurity", icon: <Shield /> },
    { name: "AI", icon: <BrainCircuit /> },
    { name: "Machine Learning", icon: <BrainCircuit /> },
    // { name: "Mobile Development", icon: <Smartphone /> },
    { name: "DevOps", icon: <Settings /> },
    { name: "Game Development", icon: <Gamepad /> },
    { name: "Blockchain", icon: <Link /> },
  ];

  const addCustomTopic = () => {
    if (customTopic.trim()) {
      toggleInterest(customTopic.trim());
      setCustomTopic("");
      setShowAddTopic(false);
    }
  };

  const filteredInterests = interestOptions.filter((interest) =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Learning style options
  const learningStyles = [
    { name: "Visual", description: "Learn best with images and diagrams" },
    { name: "Auditory", description: "Learn best by listening and discussing" },
    {
      name: "Reading/Writing",
      description: "Learn best through text-based materials",
    },
    {
      name: "Kinesthetic",
      description: "Learn best through practice and experimentation",
    },
  ];

  // Time commitment options
  const timeCommitments = [
    "1-2 hours/week",
    "3-5 hours/week",
    "6-10 hours/week",
    "10+ hours/week",
  ];

  // Get experience options based on education selection
  const getExperienceOptions = () => {
    if (userData.education === "High School") {
      return [
        {
          id: "Student",
          name: "Student",
          icon: <User />,
          description: "Currently studying",
        },
        {
          id: "Entry",
          name: "Entry Level",
          icon: <Target />,
          description: "Starting your career journey",
        },
      ];
    } else if (userData.education === "College") {
      return [
        {
          id: "Student",
          name: "Student",
          icon: <User />,
          description: "Currently studying",
        },
        {
          id: "Entry",
          name: "Entry Level",
          icon: <Target />,
          description: "Starting your career journey",
        },
        {
          id: "Early Career",
          name: "Early Career",
          icon: <Briefcase />,
          description: "0-3 years of experience",
        },
      ];
    } else if (userData.education === "Graduate") {
      return [
        {
          id: "Student",
          name: "Student",
          icon: <User />,
          description: "Currently studying",
        },
        {
          id: "Early Career",
          name: "Early Career",
          icon: <Target />,
          description: "0-3 years of experience",
        },
        {
          id: "Mid Career",
          name: "Mid Career",
          icon: <Building />,
          description: "4-10 years of experience",
        },
        {
          id: "Senior",
          name: "Senior",
          icon: <Award />,
          description: "10+ years of experience",
        },
      ];
    } else {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Moving background ribbons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ribbon ribbon-1"></div>
        <div className="ribbon ribbon-2"></div>
        <div className="ribbon ribbon-3"></div>
      </div>

      {/* Logo in top left */}
      <div className="absolute top-6 left-6 flex items-center space-x-2 z-20">
        <div className="rounded-full bg-blue-600 p-2">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-blue-600">LearnByte</h2>
      </div>

      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden relative z-10 transition-all duration-300 transform hover:shadow-2xl mt-12">
        {/* Content */}
        <div className="px-8 py-10">
          {/* Step 1: Name Input */}
          {step === 1 && (
            <div className="space-y-6 transition-all duration-300 ease-in-out">
              <div className="text-center mb-8">
                <User className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Welcome to LearnByte!
                </h3>
                <p className="mt-2 text-gray-600 text-lg">
                  Let's get to know you better
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-5 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
                    required
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-5 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education Level */}
          {step === 2 && (
            <div className="space-y-6 transition-all duration-300 ease-in-out">
              <div className="text-center mb-8">
                <School className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Education Level
                </h3>
                <p className="mt-2 text-gray-600 text-lg">
                  Select your highest level of education
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => selectOption("education", "High School")}
                  className={`flex flex-col items-center p-8 border-2 rounded-xl transition-all duration-200 ${
                    userData.education === "High School"
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <School
                    className={`h-16 w-16 mb-4 ${
                      userData.education === "High School"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-medium text-xl ${
                      userData.education === "High School"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    High School
                  </span>
                </button>

                <button
                  onClick={() => selectOption("education", "College")}
                  className={`flex flex-col items-center p-8 border-2 rounded-xl transition-all duration-200 ${
                    userData.education === "College"
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <BookOpen
                    className={`h-16 w-16 mb-4 ${
                      userData.education === "College"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-medium text-xl ${
                      userData.education === "College"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    College
                  </span>
                </button>

                <button
                  onClick={() => selectOption("education", "Graduate")}
                  className={`flex flex-col items-center p-8 border-2 rounded-xl transition-all duration-200 ${
                    userData.education === "Graduate"
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <Award
                    className={`h-16 w-16 mb-4 ${
                      userData.education === "Graduate"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-medium text-xl ${
                      userData.education === "Graduate"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Graduate
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Experience Level - Changes based on education */}
          {step === 3 && (
            <div className="space-y-6 transition-all duration-300 ease-in-out">
              <div className="text-center mb-8">
                <Briefcase className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Experience Level
                </h3>
                <p className="mt-2 text-gray-600 text-lg">
                  Where are you in your career journey?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getExperienceOptions().map((option) => (
                  <button
                    key={option.id}
                    onClick={() => selectOption("experience", option.id)}
                    className={`flex flex-col items-center p-8 border-2 rounded-xl transition-all duration-200 ${
                      userData.experience === option.id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={
                        userData.experience === option.id
                          ? "text-blue-600"
                          : "text-gray-500"
                      }
                    >
                      {option.icon &&
                        React.cloneElement(option.icon, {
                          className: "h-16 w-16 mb-4",
                        })}
                    </div>
                    <span
                      className={`font-medium text-xl ${
                        userData.experience === option.id
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.name}
                    </span>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div className="space-y-6 transition-all duration-300 ease-in-out">
              <div className="text-center mb-8">
                <Target className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Your Interests
                </h3>
                <p className="mt-2 text-gray-600 text-lg">
                  Search or select topics you'd like to learn
                </p>
              </div>

              {/* Search and Add Custom Topic */}
              <div className="space-y-4">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                {/* Selected Topics */}
                {userData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-xl">
                    {userData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {interest}
                        <button
                          onClick={() => toggleInterest(interest)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Interest Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredInterests.map((interest) => (
                    <button
                      key={interest.name}
                      onClick={() => toggleInterest(interest.name)}
                      className={`flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-200 ${
                        userData.interests.includes(interest.name)
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-full ${
                          userData.interests.includes(interest.name)
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        } mb-3`}
                      >
                        <div
                          className={
                            userData.interests.includes(interest.name)
                              ? "text-blue-600"
                              : "text-gray-500"
                          }
                        >
                          {React.cloneElement(interest.icon, {
                            className: "h-8 w-8",
                          })}
                        </div>
                      </div>
                      <span
                        className={`font-medium text-lg ${
                          userData.interests.includes(interest.name)
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {interest.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Add Custom Topic */}
                {!showAddTopic ? (
                  <button
                    onClick={() => setShowAddTopic(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Custom Topic
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter custom topic"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={addCustomTopic}
                      disabled={!customTopic.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTopic(false);
                        setCustomTopic("");
                      }}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {searchTerm &&
                  filteredInterests.length === 0 &&
                  !showAddTopic && (
                    <p className="text-center text-gray-600 py-4">
                      No matching topics found. Would you like to add a custom
                      topic?
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Step 5: Learning Preferences */}
          {step === 5 && (
            <div className="space-y-6 transition-all duration-300 ease-in-out">
              <div className="text-center mb-8">
                <BookOpen className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Learning Preferences
                </h3>
                <p className="mt-2 text-gray-600 text-lg">
                  How do you prefer to learn?
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-lg font-medium text-gray-700">
                    Learning Style
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningStyles.map((style) => (
                      <button
                        key={style.name}
                        onClick={() =>
                          selectOption("learningStyle", style.name)
                        }
                        className={`flex items-center p-5 border-2 rounded-xl transition-all duration-200 ${
                          userData.learningStyle === style.name
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full mr-3 ${
                            userData.learningStyle === style.name
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="text-left">
                          <p
                            className={`font-medium text-lg ${
                              userData.learningStyle === style.name
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {style.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {style.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-lg font-medium text-gray-700">
                    Weekly Time Commitment
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeCommitments.map((time) => (
                      <button
                        key={time}
                        onClick={() => selectOption("timeCommitment", time)}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                          userData.timeCommitment === time
                            ? "border-blue-600 bg-blue-50 shadow-md text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final confirmation section */}
              {userData.learningStyle && userData.timeCommitment && (
                <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2 text-lg">
                    Almost there!
                  </h4>
                  <p className="text-blue-700 mb-4">
                    Based on your preferences, we'll create a personalized
                    learning path that fits your schedule and goals.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 pt-5 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`px-8 py-4 border-2 rounded-xl font-medium text-lg transition-all duration-200 ${
                step === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              Back
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
                  isStepComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                <span className="flex items-center">
                  Next
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepComplete()}
                className={`px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
                  isStepComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                <span className="flex items-center">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS for the moving ribbons */}
      <style jsx>{`
        .ribbon {
          position: absolute;
          height: 200px;
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.2) 0%,
            rgba(96, 165, 250, 0.4) 100%
          );
          border-radius: 100%;
          animation-duration: 15s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        .ribbon-1 {
          width: 800px;
          bottom: -100px;
          left: -200px;
          animation-name: float1;
          transform-origin: center center;
        }

        .ribbon-2 {
          width: 600px;
          top: -80px;
          right: -150px;
          animation-name: float2;
          animation-delay: 1s;
        }

        .ribbon-3 {
          width: 500px;
          top: 40%;
          left: 60%;
          animation-name: float3;
          animation-delay: 2s;
          opacity: 0.5;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(50px) rotate(5deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(-40px) rotate(7deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;