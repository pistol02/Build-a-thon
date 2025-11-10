import { GoogleGenerativeAI } from '@google/generative-ai';

interface RoadmapActivity {
  type: string;
  detail: string;
  isCompleted: boolean;
  progress: number;
  bulletPoints: string[];
  methodology: string;
  videoUrl?: string;
  videoTitle?: string;
}

interface RoadmapMilestone {
  title: string;
  description: string;
  targetDate: Date;
  isCompleted: boolean;
  reward?: string;
}

interface RoadmapTopic {
  name: string;
  steps: RoadmapActivity[];
  milestones: RoadmapMilestone[];
}

interface RoadmapItem {
  date: string;
  topics: RoadmapTopic[];
  completionPercentage: number;
  timeSaved: string;
}

interface RoadmapData {
  title: string;
  description: string;
  items: RoadmapItem[];
  totalCompletionPercentage: number;
  estimatedCompletionDate: string;
  hoursPerDay: number;
  timeSaved: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skillName: string;
  userEngagement: {
    currentStreak: number;
    totalPoints: number;
    level: number;
    badges: string[];
  };
  currentMilestone: {
    title: string;
    progress: number;
    nextMilestone: string;
  };
  projectMilestones: RoadmapMilestone[];
}

// Add these sample YouTube URLs to your tasks
const sampleVideoUrls = {
  'React Setup & JSX': {
    url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    title: 'Complete React Course'
  },
  'Components & Props': {
    url: 'https://www.youtube.com/watch?v=Rh3tobg7hEo',
    title: 'React Components & Props'
  },
  // Add default fallback
  'default': {
    url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    title: 'React Crash Course'
  }
};

const calculateTimeSaved = (topicComplexity: string): string => {
  const baseTime = {
    'basic': [15, 30],
    'intermediate': [30, 60],
    'advanced': [45, 90]
  };
  
  const complexity = topicComplexity.toLowerCase().includes('advanced') ? 'advanced' 
    : topicComplexity.toLowerCase().includes('basic') ? 'basic' 
    : 'intermediate';
    
  const [min, max] = baseTime[complexity];
  const savedMinutes = Math.floor(Math.random() * (max - min + 1)) + min;
  
  return savedMinutes >= 60 
    ? `${Math.floor(savedMinutes/60)} hour ${savedMinutes%60 ? `${savedMinutes%60} mins` : ''}`
    : `${savedMinutes} mins`;
};

// Add learning resources based on style
const learningResources = {
  visual: {
    'React Setup & JSX': {
      videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      diagramUrl: 'https://react.dev/learn/thinking-in-react',
    },
    'default': {
      videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
      diagramUrl: 'https://react.dev/learn'
    }
  },
  reading: {
    'React Setup & JSX': {
      documentation: 'https://react.dev/learn',
      article: 'https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f',
      research: 'https://arxiv.org/abs/2204.13914'
    },
    'default': {
      documentation: 'https://react.dev/docs/getting-started',
      article: 'https://dev.to/tags/react',
      research: 'https://paperswithcode.com/search?q=react'
    }
  },
  auditory: {
    'React Setup & JSX': {
      podcast: 'https://reactpodcast.com/',
      audioTutorial: 'https://www.youtube.com/watch?v=4UZrsTqkcW4'
    },
    'default': {
      podcast: 'https://changelog.com/reactpodcast',
      audioTutorial: 'https://www.youtube.com/watch?v=4UZrsTqkcW4'
    }
  },
  kinesthetic: {
    'React Setup & JSX': {
      tutorial: 'https://react.dev/learn/tutorial-tic-tac-toe',
      sandbox: 'https://codesandbox.io/s/new',
      workshop: 'https://github.com/reactjs/react-tutorial'
    },
    'default': {
      tutorial: 'https://react.dev/learn',
      sandbox: 'https://codesandbox.io/s/new',
      workshop: 'https://github.com/reactjs/react-tutorial'
    }
  }
};

const learningStylePrompts = {
  visual: {
    resourceType: 'video tutorials link',
    format: 'Visual demonstrations and video content link from youtube',
    prompt: 'Provide video tutorials link that directs to youtube and visual learning materials. Include timestamps for key concepts.When you click on Watch tutorial it actually redirects you to youtube video that is mention in roadmap',
    resourcePrompt: 'Find top-rated YouTube tutorials video link that directs to youtube and visual guides for each topic.'
  },
  reading: {
    resourceType: 'documentation and articles',
    format: 'Written explanations and research materials',
    prompt: 'Provide comprehensive documentation, research papers, and technical articles.',
    resourcePrompt: 'Find authoritative documentation, research papers, and in-depth articles from sources like arXiv, dev.to, and official docs.'
  },
  auditory: {
    resourceType: 'podcasts and audio content',
    format: 'Audio-based learning materials',
    prompt: 'Provide podcast episodes and audio tutorials for learning.',
    resourcePrompt: 'Find relevant podcast episodes, audio courses, and discussion-based content.'
  },
  kinesthetic: {
    resourceType: 'hands-on tutorials',
    format: 'Interactive coding exercises',
    prompt: 'Provide step-by-step practical tutorials and coding exercises.',
    resourcePrompt: 'Find interactive tutorials, coding challenges, and hands-on projects from platforms like GitHub and CodePen.'
  }
};

const documentationLinks = {
  'React': {
    docs: 'https://react.dev/learn',
    wiki: 'https://en.wikipedia.org/wiki/React_(software)',
    articles: [
      'https://www.freecodecamp.org/news/the-react-handbook-b71c27b0a795/',
      'https://dev.to/visual/best-react-practices-5b8d'
    ]
  },
  'Machine Learning': {
    docs: 'https://scikit-learn.org/stable/user_guide.html',
    wiki: 'https://en.wikipedia.org/wiki/Machine_learning',
    articles: [
      'https://www.ibm.com/topics/machine-learning',
      'https://www.nature.com/articles/nature14539'
    ]
  },
  'default': {
    docs: 'https://developer.mozilla.org/en-US/',
    wiki: 'https://en.wikipedia.org/wiki/Computer_programming',
    articles: [
      'https://dev.to/',
      'https://medium.com/topic/programming'
    ]
  }
};

// Add specific topic-based video URLs
const topicVideoUrls = {
  'React': {
    'Introduction': 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
    'Components': 'https://www.youtube.com/watch?v=Rh3tobg7hEo',
    'State': 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
    'default': 'https://www.youtube.com/watch?v=bMknfKXIFA8'
  },
  'Python': {
    'Basics': 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    'Functions': 'https://www.youtube.com/watch?v=9Os0o3wzS_I',
    'default': 'https://www.youtube.com/watch?v=rfscVS0vtbw'
  },
  // Add more topics as needed
  'default': {
    'default': 'https://www.youtube.com/results?search_query='
  }
};

export async function generateRoadmapData(
  skills: string,
  displayMode: "day" | "week" | "month",
  deadline: Date,
  learningStyle: string
): Promise<RoadmapData> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not found");
    throw new Error("API key not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const totalDays = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const displayUnit = displayMode === "day" ? "Day" : displayMode === "week" ? "Week" : "Month";
  
  const styleGuide = learningStylePrompts[learningStyle];
  
  // First, get learning resources for the topic
  const resourcePrompt = `Find learning resources for ${skills} specifically for ${learningStyle} learners.
    Requirements:
    - ${styleGuide.resourcePrompt}
    - Return only high-quality, relevant resources
    - Format as JSON array with title, url, and description
    - Focus on ${styleGuide.resourceType}
    Return ONLY the JSON array.`;

  try {
    // Get resources first
    const resourceResult = await model.generateContent(resourcePrompt);
    let resourceText = resourceResult.response.text();
    
    // Clean the resource response text
    resourceText = resourceText
      .replace(/```json\s*|\s*```/g, '')  // Remove code blocks
      .replace(/\n/g, '')                  // Remove newlines
      .replace(/\s+/g, ' ')               // Normalize spaces
      .trim();                            // Trim whitespace

    // Extract JSON array if wrapped in other text
    const arrayStart = resourceText.indexOf('[');
    const arrayEnd = resourceText.lastIndexOf(']') + 1;
    if (arrayStart !== -1 && arrayEnd !== -1) {
      resourceText = resourceText.slice(arrayStart, arrayEnd);
    }

    // Parse the cleaned JSON
    let resourcesJson;
    try {
      resourcesJson = JSON.parse(resourceText);
    } catch (parseError) {
      console.error("Failed to parse resources:", resourceText);
      resourcesJson = []; // Fallback to empty array if parsing fails
    }

    // Main roadmap generation prompt
    const roadmapPrompt = `Create a learning roadmap for ${skills} optimized for ${learningStyle} learning style.
    
    Learning Style Requirements:
    - Format content as ${styleGuide.format}
    - Focus on ${styleGuide.resourceType}
    - ${styleGuide.prompt}

    Daily Task Structure:
    - ${learningStyle === 'visual' ? 'Include specific video segments and timestamps' : ''}
    - ${learningStyle === 'reading' ? 'Link to specific documentation sections and papers' : ''}
    - ${learningStyle === 'auditory' ? 'Reference specific podcast episodes and audio segments' : ''}
    - ${learningStyle === 'kinesthetic' ? 'Provide detailed step-by-step coding instructions' : ''}

    1. Break down the learning journey into ${totalDays} days worth of tasks
    2. Each day should have specific goals and measurable outcomes
    3. Include regular milestones and achievements
    4. Adapt content difficulty progressively
    5. Return the response as a single JSON object with this exact structure:

{
  "title": "${skills} Learning Journey",
  "description": "A ${totalDays}-day roadmap to master ${skills}",
  "items": [
    {
      "date": "Day X (1 to ${totalDays})",
      "topics": [{
        "name": "Topic Name",
        "steps": [{
          "type": "Activity Type (Learning/Practice/Review)",
          "detail": "Detailed description of the task",
          "isCompleted": false,
          "progress": 0,
          "bulletPoints": [
            "Specific sub-tasks or learning points",
            "Expected outcomes",
            "Practice exercises"
          ],
          "methodology": "How to approach this task effectively"
        }],
        "milestones": []
      }],
      "completionPercentage: 0,
      "timeSaved": "X hours"
    }
  ],
  "totalCompletionPercentage": 0,
  "estimatedCompletionDate": "${deadline.toDateString()}",
  "hoursPerDay": 2,
  "timeSaved": "0 hours",
  "difficulty": "Beginner",
  "skillName": "${skills}",
  "userEngagement": {
    "currentStreak": 0,
    "totalPoints: 0,
    "level": 1,
    "badges": [
      {
        "name": "Badge Name",
        "description": "Achievement description",
        "icon": "🏆",
        "unlockedAt": "Day X"
      }
    ]
  },
  "currentMilestone": {
    "title": "Current goal",
    "progress": 0,
    "nextMilestone": "Next achievement to unlock"
  },
  "projectMilestones": [
    {
      "dayIndex": 1,
      "title": "Milestone title",
      "description": "What you'll achieve",
      "badge": {
        "icon": "🎯",
        "name": "Achievement name",
        "description": "What this means"
      }
    }
  ]
}

Important:
1. Create exactly ${totalDays} daily items
2. Space out milestones evenly
3. Increase task complexity gradually
4. Add achievement badges at key learning points
5. Include practical exercises and projects
6. Make sure each day builds upon previous learning
7. Break complex topics into manageable daily tasks
8. Return ONLY the JSON object, no other text`;

    const result = await model.generateContent(roadmapPrompt);
    const response = result.response;
    let textContent = response.text();
    
    // Clean the response text
    textContent = textContent
      .replace(/```json\s*|\s*```/g, '')
      .replace(/\n/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract the JSON object
    const jsonStart = textContent.indexOf('{');
    const jsonEnd = textContent.lastIndexOf('}') + 1;
    textContent = textContent.slice(jsonStart, jsonEnd);

    try {
      const roadmapData = JSON.parse(textContent) as RoadmapData;
      
      // Validate and transform the data
      const roadmapWithResources = {
        ...roadmapData,
        items: roadmapData.items.map((item, index) => ({
          ...item,
          date: displayMode === "day" 
            ? `Day ${index + 1}` 
            : displayMode === "week"
            ? `Week ${Math.floor(index / 7) + 1}`
            : `Month ${Math.floor(index / 30) + 1}`,
          completionPercentage: 0,
          timeSaved: calculateTimeSaved(item.topics[0]?.steps[0]?.type || 'basic'),
          topics: item.topics.map(topic => ({
            ...topic,
            steps: topic.steps.map(step => {
              let videoUrl = sampleVideoUrls[topic.name]?.url || sampleVideoUrls.default.url;
              let videoTitle = sampleVideoUrls[topic.name]?.title || `Learn ${topic.name}`;

              // Enforce YouTube link for visual learning style
              if (learningStyle === 'visual' && !videoUrl.includes('youtube.com')) {
                videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.name + ' ' + step.detail)}`;
                videoTitle = `YouTube Search: ${topic.name} - ${step.detail}`;
              }

              return {
                ...step,
                isCompleted: false,
                progress: 0,
                videoUrl: videoUrl,
                videoTitle: videoTitle,
                methodology: `${styleGuide.format} - ${step.methodology}`,
                bulletPoints: [...step.bulletPoints, ...styleGuide.prompt.split(', ')]
              };
            }),
            learningResources: resourcesJson.filter(r => 
              r.title.toLowerCase().includes(topic.name.toLowerCase())
            ),
            steps: topic.steps.map(step => ({
              ...step,
              resources: getStyleSpecificResources(step, topic, learningStyle, resourcesJson)
            }))
          }))
        })),
        userEngagement: {
          currentStreak: 0,
          totalPoints: 0,
          level: 1,
          badges: [],
          ...roadmapData.userEngagement
        },
        currentMilestone: {
          title: "Getting Started",
          progress: 0,
          nextMilestone: roadmapData.projectMilestones[0]?.title || "First Milestone",
          ...roadmapData.currentMilestone
        }
      };

      return roadmapWithResources;
    } catch (parseError) {
      console.error("Failed to parse JSON response:", textContent);
      throw new Error("Invalid JSON response from API");
    }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}

function getStyleSpecificResources(step, topic, learningStyle, resources) {
  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(topic.name.toLowerCase())
  );

  switch (learningStyle) {
    case 'visual':
      // Get the topic category (React, Python, etc.)
      const topicCategory = Object.keys(topicVideoUrls).find(cat => 
        topic.name.toLowerCase().includes(cat.toLowerCase())
      ) || 'default';
      
      // Get the specific subtopic video or default to category default
      const videoUrl = topicVideoUrls[topicCategory][topic.name] || 
                      topicVideoUrls[topicCategory].default || 
                      `${topicVideoUrls.default.default}${encodeURIComponent(topic.name + ' tutorial')}`;
      
      return {
        videoUrl,
        videoTitle: `${topic.name} Tutorial`,
        timestamp: step.timestamp || '0:00' // Optional timestamp for specific sections
      };

    case 'auditory':
      return {
        audioUrl: filteredResources.find(r => r.type === 'audio')?.url ||
                 `https://www.audible.com/search?keywords=${encodeURIComponent(topic.name)}`,
        alternativeUrl: `https://ttsreader.com/share/?text=${encodeURIComponent(step.detail)}`
      };

    case 'kinesthetic':
      return {
        practiceSteps: step.bulletPoints,
        sandbox: filteredResources.find(r => r.type === 'interactive')?.url ||
                `https://codesandbox.io/s/new?file=/src/App.js`,
        guide: step.detail
      };

    case 'reading':
      // Keep existing reading resources implementation
      return {
        documentation: filteredResources.find(r => r.type === 'documentation')?.url || 
                      documentationLinks[topic.name]?.docs ||
                      documentationLinks.default.docs,
        articles: [
          ...filteredResources
            .filter(r => r.type === 'article')
            .map(r => ({
              title: r.title,
              url: r.url
            })),
          {
            title: `${topic.name} Documentation`,
            url: documentationLinks[topic.name]?.docs || documentationLinks.default.docs
          }
        ].slice(0, 3),
        wiki: documentationLinks[topic.name]?.wiki || documentationLinks.default.wiki
      };

    default:
      return {};
  }
}