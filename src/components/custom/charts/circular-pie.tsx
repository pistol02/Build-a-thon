"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart showing student skill progress";

const chartData = [
  { skill: "Technical Skills", progress: 75, fill: "var(--color-chrome)" },
  { skill: "Soft Skills", progress: 50, fill: "var(--color-safari)" },
  { skill: "Leadership Skills", progress: 60, fill: "var(--color-firefox)" },
  { skill: "Communication Skills", progress: 80, fill: "var(--color-edge)" },
  { skill: "Problem-Solving Skills", progress: 55, fill: "var(--color-other)" },
];

const chartConfig = {
  progress: {
    label: "Progress",
  },
  chrome: {
    label: "Technical Skills",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Soft Skills",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Leadership Skills",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Communication Skills",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Problem-Solving Skills",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function CircularPieChart() {
  const totalProgress = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.progress, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="progress"
              nameKey="skill"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProgress.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Progress
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}