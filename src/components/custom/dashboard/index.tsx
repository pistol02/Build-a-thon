"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const bronzeLeague = "/assets/bronze_leage.jpeg";
const silverLeague = "/assets/silver_league.jpeg";
const goldLeague = "/assets/gold_league.jpeg";
const crystalLeague = "/assets/crystal_league.jpeg";
const diamondLeague = "/assets/diamond_league.jpeg";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Clock, Info, Lightbulb, Zap } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Image from "next/image";
import jsPDF from "jspdf";

const learnerData = {
  name: "Saniyaa B Shetty",
  role: "Computer Science Student",
  coursesCompleted: 12,
  studyHours: 220,
  skills: ["React", "Next.js", "Python", "Data Structures"],
  badges: ["Top Student", "Course Champion", "Homework Hero"],
};

const courses = [
  { title: "Advanced Web Development", status: "In Progress", deadline: "Feb 28, 2025" },
  { title: "Introduction to AI", status: "Completed", deadline: "Jan 15, 2025" },
  { title: "Database Management", status: "Enrolled", deadline: "Mar 10, 2025" },
  { title: "Full-Stack JavaScript", status: "Enrolled", deadline: "Apr 15, 2025" },
  { title: "Machine Learning Basics", status: "In Progress", deadline: "Feb 28, 2025" },
  { title: "DevOps and CI/CD", status: "Enrolled", deadline: "Mar 25, 2025" },
];

const assignments = [
  { title: "React Component Project", grade: "A", feedback: "Excellent UI design" },
  { title: "Python Data Analysis", grade: "A-", feedback: "Great visualization" },
  { title: "Algorithm Implementation", grade: "B+", feedback: "Efficient solution" },
];

const tasks = [
  { title: "Complete Chapter 5 exercises", dueDate: "Feb 20, 2025" },
  { title: "Submit term paper draft", dueDate: "Feb 22, 2025" },
];

const generateActivityData = (year: number, month: number, counts: number[]) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const activityData = [];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    activityData.push({ date, count: counts[day - 1] || 0 });
  }

  return { month: monthNames[month - 1], data: activityData };
};

const hoursSpent = 220;
const hoursSaved = Math.floor(hoursSpent * (25 / 60));

const timeManagementPieData = [
  { name: "Hours Spent", value: hoursSpent },
  { name: "Hours Saved", value: hoursSaved },
];

const COLORS = ["#0088FE", "#00C49F"];

// Updated Trophy System
const getLeagueAndTrophies = (trophies: number) => {
  if (trophies >= 51) return { league: "Diamond", trophies: `${trophies}`, image: diamondLeague, description: "Master of all skills! Diamond league represents the pinnacle of achievement." };
  if (trophies >= 41) return { league: "Platinum", trophies: `${trophies}`, image: crystalLeague, description: "Exceptional performance! You're in the top tier of learners." };
  if (trophies >= 31) return { league: "Gold", trophies: `${trophies}`, image: goldLeague, description: "Great job! Gold league signifies advanced skills and dedication." };
  if (trophies >= 21) return { league: "Silver", trophies: `${trophies}`, image: silverLeague, description: "Well done! Silver league shows consistent effort and improvement." };
  return { league: "Bronze", trophies: `${trophies}`, image: bronzeLeague, description: "Welcome to the journey! Bronze league is the first step toward mastery." };
};

// Updated League Requirements
const leagueRequirements = [
  { league: "Bronze", trophies: "0-20", image: bronzeLeague, description: "Welcome to the journey! Bronze league is the first step toward mastery." },
  { league: "Silver", trophies: "21-30", image: silverLeague, description: "Well done! Silver league shows consistent effort and improvement." },
  { league: "Gold", trophies: "31-40", image: goldLeague, description: "Great job! Gold league signifies advanced skills and dedication." },
  { league: "Platinum", trophies: "41-50", image: crystalLeague, description: "Exceptional performance! You're in the top tier of learners." },
  { league: "Diamond", trophies: "51+", image: diamondLeague, description: "Master of all skills! Diamond league represents the pinnacle of achievement." },
];

export default function LearningDashboard() {
  const [progressValues, setProgressValues] = useState<number[]>([]);
  const [activityData, setActivityData] = useState<Array<any>>([]);
  const [isLeaguePopupOpen, setIsLeaguePopupOpen] = useState(false);

  useEffect(() => {
    const januaryCounts = [4, 6, 6, 5, 6, 4, 0, 4, 1, 2, 0, 6, 6, 3, 0, 4, 3, 4, 0, 6, 0, 4, 5, 1, 5, 6, 4, 6, 5, 5, 0];
    const februaryCounts = [4, 2, 3, 2, 0, 4, 0, 2, 3, 5, 5, 5, 5, 1, 1, 5, 3, 6, 4, 6, 6, 0, 5, 0, 3, 2, 4, 6];
    const marchCounts = [2, 3, 5, 0, 4, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const data = [
      generateActivityData(2025, 1, januaryCounts),
      generateActivityData(2025, 2, februaryCounts),
      generateActivityData(2025, 3, marchCounts)
    ];

    setActivityData(data);
    setProgressValues(learnerData.skills.map(() => Math.random() * 100));
  }, []);

  // Example trophy count for the learner
  const trophies = 31;
  const { league, trophies: trophyCount, image, description } = getLeagueAndTrophies(trophies);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Candidate Profile Report", 10, 20);
    doc.setFontSize(12);
    
    // Add table headers
    doc.text("Skill", 10, 30);
    doc.text("Score", 70, 30);
    doc.text("Weight", 130, 30);
    
    // Add table rows
    const skills = [
      { skill: "Technical Knowledge", score: 100, weight: 0.3 },
      { skill: "Problem Solving", score: 45, weight: 0.2 },
      { skill: "Communication", score: 66, weight: 0.15 },
      { skill: "Leadership", score: 32, weight: 0.15 },
      { skill: "Creativity", score: 32, weight: 0.1 },
      { skill: "Adaptability", score: 32, weight: 0.1 },
    ];
    
    let yPosition = 40;
    skills.forEach((skill) => {
      doc.text(skill.skill, 10, yPosition);
      doc.text(skill.score.toString(), 70, yPosition);
      doc.text(skill.weight.toString(), 130, yPosition);
      yPosition += 10;
    });

    // Add overall score
    doc.setFontSize(14);
    doc.text("Overall Profile Score: 60.10%", 10, yPosition + 10);
    
    doc.save("Candidate_Profile_Report.pdf");
  };


  return (
    <div className="flex min-h-screen w-full flex-col mt-3 p-4 sm:p-6">
      {/* Profile Section */}
      <Card className="w-full my-6 p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-1">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
              <Image
                src="/SaniyaaBShetty.png"
                alt="Profile Picture"
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{learnerData.name}</h1>
              <span className="rounded-full flex items-center space-x-1">
                <Image src={image} alt="star" className="w-6 h-6" width={24} height={24} />
              </span>
            </div>
            <p className="text-gray-600">{learnerData.role}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {learnerData.badges.map((badge, idx) => (
                <Badge key={idx}>{badge}</Badge>
              ))}
            </div>
            {/* Added Download Button */}
            <Button 
              onClick={handleDownloadReport}
              className="mt-4"
              variant="default"
            >
              Download Profile Report (PDF)
            </Button>
          </div>

          {/* Current League and Trophies */}
          <div className="flex flex-row items-center space-x-8">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">Current League:</span>
                <Badge
                  variant="outline"
                  className="text-lg font-bold text-yellow-600 cursor-pointer"
                  onClick={() => setIsLeaguePopupOpen(true)}
                >
                  {league}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">Trophies Held:</span>
                <Badge variant="outline" className="text-lg font-bold text-purple-600">
                  {trophyCount}
                </Badge>
              </div>
            </div>

            {/* League Image */}
            <div className="cursor-pointer" onClick={() => setIsLeaguePopupOpen(true)}>
              <Image src={image} alt={`${league} League`} width={100} height={100} />
            </div>
          </div>
        </div>
      </Card>

      {/* League Popup */}
      {isLeaguePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="absolute inset-0"
            onClick={() => setIsLeaguePopupOpen(false)}
          ></div>
          <div className="bg-white rounded shadow-lg p-6 relative z-10 max-w-lg w-full">
            <button
              onClick={() => setIsLeaguePopupOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">League Requirements</h2>
            <div className="space-y-4">
              {leagueRequirements.map((req, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Image
                    src={req.image}
                    alt={`${req.league} League`}
                    className="w-10 h-10"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-semibold">{req.league} League</p>
                    <p className="text-sm text-gray-600">Trophies: {req.trophies}</p>
                    <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rest of the code remains unchanged */}
      {/* Activity Tracker, Main Content, etc. */}
      {/* ... (rest of the code) ... */}

      <Card className="w-full my-4 p-3 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <CardHeader className="p-2">
              <CardTitle className="text-lg">Activity Tracker</CardTitle>
              <CardDescription className="text-sm">Track your daily learning activity</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              {activityData.length > 0 && (
                <div className="flex space-x-1">
                  {activityData.map((monthData, monthIndex) => (
                    <div key={monthIndex} className="flex-1">
                      <h3 className="text-md font-semibold mb-1">{monthData.month}</h3>
                      <div className="grid grid-cols-7 gap-0.5">
                        {monthData.data.map((activity, index) => (
                          <div
                            key={index}
                            className={`h-5 w-5 rounded ${activity.count === 0
                              ? "bg-gray-200"
                              : activity.count <= 3
                                ? "bg-green-300"
                                : "bg-green-500"
                              }`}
                            title={`${activity.date}: ${activity.count} activities`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                <Badge className="text-xs">Current Streak: 3 days</Badge>
                <Badge className="ml-1 text-xs">Longest Streak: 8 days</Badge>
              </div>
            </CardContent>
          </div>

          <div className="flex-1">
            <CardHeader className="p-2">
              <CardTitle className="text-lg flex items-center gap-2">
                Time Management
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <h4 className="font-semibold">Time Tracking Breakdown</h4>
                    <Separator className="my-2" />
                    <p className="text-sm">
                      Track how you're allocating your study time between active learning
                      sessions and time saved through efficient planning.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
              <CardDescription>Optimize your study efficiency</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hours Spent Card */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">Hours Spent</p>
                        <p className="text-2xl font-bold">{hoursSpent}</p>
                      </div>
                      {/* Progress Bar */}
                      <div className="relative pt-2">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="w-full">
                            <div className="h-2 bg-muted rounded-full">
                              <div
                                className="h-2 bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${(hoursSpent / 300) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-muted-foreground">
                            {300 - hoursSpent}h remaining to goal
                          </span>
                        </div>
                      </div>
                      {/* Weekly Sparkline */}
                      <div className="h-16 -mb-4 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { day: 'Mon', hours: 4 },
                              { day: 'Tue', hours: 6 },
                              { day: 'Wed', hours: 5 },
                              { day: 'Thu', hours: 3 },
                              { day: 'Fri', hours: 7 },
                              { day: 'Sat', hours: 4 },
                              { day: 'Sun', hours: 2 },
                            ]}
                          >
                            <defs>
                              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="hours"
                              stroke="#0088FE"
                              fillOpacity={1}
                              fill="url(#colorUv)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hours Saved Card */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-emerald-500/10 p-2 rounded-full">
                      <Zap className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hours Saved</p>
                      <p className="text-2xl font-bold">{hoursSaved}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pie Chart Card */}
                <Card className="md:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex-1 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={timeManagementPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {timeManagementPieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                                className="hover:opacity-80 transition-opacity"
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      {timeManagementPieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {entry.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4 sm:p-6 shadow-lg">
          <CardHeader>
            <CardTitle>Current & Upcoming Courses</CardTitle>
            <CardDescription>Track your enrolled and in-progress courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          course.status === "In Progress"
                            ? "bg-yellow-500"
                            : course.status === "Completed"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.deadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6 shadow-lg">
          <CardHeader>
            <CardTitle>Learning Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              Courses Completed: {learnerData.coursesCompleted}
            </p>
            <p className="text-sm text-gray-600">
              Total Study Hours: {learnerData.studyHours}
            </p>
            <h4 className="mt-4 font-semibold">Skills Proficiency</h4>
            {learnerData.skills.map((skill, idx) => (
              <div key={idx} className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill}</span>
                  <span>{Math.round(progressValues[idx] || 0)}%</span>
                </div>
                <Progress value={progressValues[idx] || 0} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-4 sm:p-6 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.map((item, index) => (
              <div key={index} className="border-b py-3">
                <div className="flex justify-between">
                  <h4 className="text-md font-semibold">{item.title}</h4>
                  <Badge
                    className={
                      item.grade.startsWith("A")
                        ? "bg-green-500"
                        : item.grade.startsWith("B")
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }
                  >
                    {item.grade}
                  </Badge>
                </div>
                <p className="text-gray-600">Feedback: {item.feedback}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6 shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.map((task, index) => (
              <div key={index} className="border-b py-3 flex justify-between">
                <div>
                  <h4 className="text-md font-semibold">{task.title}</h4>
                  <p className="text-gray-600">Due: {task.dueDate}</p>
                </div>
                <Button variant="outline">Start</Button>
              </div>
            ))}
            <div className="mt-4">
              <Button className="w-full">View All Assignments</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}