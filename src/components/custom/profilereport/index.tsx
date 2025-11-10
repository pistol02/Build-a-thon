"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Technical Skill Weights
const SKILLS = [
  { name: "System Architecture", weight: 0.3 },
  { name: "Algorithm Efficiency", weight: 0.25 },
  { name: "Code Quality & Maintainability", weight: 0.2 },
  { name: "Security & Compliance", weight: 0.15 },
  { name: "DevOps & Automation", weight: 0.1 },
];

export default function CandidateProfileScore() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an API (Replace this with a real API call)
    fetch("/api/technical-score") // Change this to the actual backend API route
      .then((res) => res.json())
      .then((data) => {
        const formattedScores = SKILLS.reduce(
          (acc, skill) => ({
            ...acc,
            [skill.name]: data[skill.name] || 0,
          }),
          {}
        );
        setScores(formattedScores);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Calculate Weighted Profile Score
  const totalScore = SKILLS.reduce(
    (sum, skill) => sum + (scores[skill.name] || 0) * skill.weight,
    0
  );

  // Generate PDF Report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Technical Candidate Profile Report", 15, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Skill", "Score (%)", "Weight"]],
      body: SKILLS.map((skill) => [
        skill.name,
        scores[skill.name]?.toFixed(2) || "N/A",
        skill.weight,
      ]),
    });

    const finalY = (doc as any).autoTable.previous.finalY || 40;
    doc.text(`Overall Technical Score: ${totalScore.toFixed(2)}%`, 15, finalY + 10);

    doc.save("Technical_Profile_Report.pdf");
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Technical Profile Score Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500">Fetching data...</p>
        ) : (
          <>
            {SKILLS.map((skill) => (
              <div key={skill.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {skill.name}
                </label>
                <p className="text-lg font-semibold text-gray-800">{scores[skill.name] || "N/A"}%</p>
              </div>
            ))}

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Overall Technical Score</h3>
              <Progress value={totalScore} className="mt-2 h-4 bg-green-500" />
              <p className="text-center mt-2 text-lg font-bold text-gray-800">
                {totalScore.toFixed(2)}%
              </p>
            </div>

            <Button
              onClick={generateReport}
              className="mt-4 w-full bg-green-600 text-white hover:bg-green-700"
            >
              Download Report (PDF)
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
