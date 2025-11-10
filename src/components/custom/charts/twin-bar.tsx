"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", demand: 186, supply: 80 },
  { month: "February", demand: 305, supply: 200 },
  { month: "March", demand: 237, supply: 120 },
  { month: "April", demand: 73, supply: 190 },
  { month: "May", demand: 209, supply: 130 },
  { month: "June", demand: 214, supply: 140 },
];

const chartConfig = {
  demand: {
    label: "Demand",
    color: "hsl(var(--chart-1))",
  },
  supply: {
    label: "Supply",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SupplyDemandGraph() {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Progress-Week Analytics</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="demand" fill="var(--color-demand)" radius={4} />
            <Bar dataKey="supply" fill="var(--color-supply)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter> */}
    </Card>
  );
}
