"use client";

// import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "An area chart showing student skill progress over time in blue tones";

const chartData = [
  { month: "January", "2024": 50, "2023": 35 }, // Skill progress for January
  { month: "February", "2024": 65, "2023": 45 },
  { month: "March", "2024": 80, "2023": 55 },
  { month: "April", "2024": 70, "2023": 60 },
  { month: "May", "2024": 85, "2023": 70 },
  { month: "June", "2024": 90, "2023": 75 },
];

const chartConfig = {
  skillProgress2024: {
    label: "Progress in 2024",
    color: "hsl(210, 100%, 50%)", // Blue color for 2024
  },
  skillProgress2023: {
    label: "Progress in 2023",
    color: "hsl(210, 100%, 60%)", // Lighter blue for 2023
  },
} satisfies ChartConfig;

export function GradientAreaChart() {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            className=" min-h-[200px]"
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Displaying short month name
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              {/* Gradient for 2024 with blue tones */}
              <linearGradient id="fill2024" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(210, 100%, 50%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(210, 100%, 60%)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              {/* Gradient for 2023 with lighter blue tones */}
              <linearGradient id="fill2023" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(210, 100%, 60%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(210, 100%, 70%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="2024"
              type="natural"
              fill="url(#fill2024)"
              fillOpacity={0.4}
              stroke="hsl(210, 100%, 50%)" // Blue stroke for 2024
              stackId="a"
            />
            <Area
              dataKey="2023"
              type="natural"
              fill="url(#fill2023)"
              fillOpacity={0.4}
              stroke="hsl(210, 100%, 60%)" // Lighter blue stroke for 2023
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}