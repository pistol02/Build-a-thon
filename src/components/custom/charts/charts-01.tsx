"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { SupplyDemandGraph } from "./twin-bar";

const RecommendationCard = () => (
  <Card className="p-4 w-full h-fit bg-white shadow-lg">
    <CardHeader>
      <CardTitle>Recommendation</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc ml-4">
        <li>Deep Learning Specialization – Andrew Ng (Coursera).</li>
        <li>Natural Language Processing (NLP) – Hugging Face Courses.</li>
        <li>Multi-Modal AI (Text, Audio, Video) – Meta’s MMF, Google’s Video Intelligence API.</li>
      </ul>
    </CardContent>
  </Card>
);

export default function Charts() {
  return (
    <div className="chart-wrapper mx-auto flex max-w-full flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card
          x-chunk="A bar chart showing the number of deliveries you have done in the past 7 days."
          className="lg:max-w-lg"
        >
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              12,584{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                learning minutes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                deliveries: {
                  label: "deliveries",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    deliveries: 2000,
                  },
                  {
                    date: "2024-01-02",
                    deliveries: 2100,
                  },
                  {
                    date: "2024-01-03",
                    deliveries: 2200,
                  },
                  {
                    date: "2024-01-04",
                    deliveries: 1300,
                  },
                  {
                    date: "2024-01-05",
                    deliveries: 1400,
                  },
                  {
                    date: "2024-01-06",
                    deliveries: 2500,
                  },
                  {
                    date: "2024-01-07",
                    deliveries: 1600,
                  },
                ]}
              >
                <Bar
                  dataKey="deliveries"
                  fill="var(--color-deliveries)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={1200}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Average deliveries"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                  <Label
                    position="insideTopLeft"
                    value="12,343"
                    className="text-lg"
                    fill="hsl(var(--foreground))"
                    offset={10}
                    startOffset={100}
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Over the past 7 days, you delivered{" "}
              <span className="font-medium text-foreground">53,305</span>{" "}
              orders.
            </CardDescription>
            <CardDescription>
              You need{" "}
              <span className="font-medium text-foreground">12,584</span> more
              deliveries to reach your goal.
            </CardDescription>
          </CardFooter>
        </Card>
        <Card
          x-chunk="A line chart showing the profit heart rate for the past 7 days."
          className="flex flex-col lg:max-w-md"
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
            <div>
              <CardDescription>Revenue</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                62
                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                  k
                </span>
              </CardTitle>
            </div>
            <div>
              <CardDescription>Variability</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                11
                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                  k
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ChartContainer
              config={{
                profit: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full"
            >
              <LineChart
                accessibilityLayer
                margin={{
                  left: 14,
                  right: 14,
                  top: 10,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    profit: 62,
                  },
                  {
                    date: "2024-01-02",
                    profit: 72,
                  },
                  {
                    date: "2024-01-03",
                    profit: 35,
                  },
                  {
                    date: "2024-01-04",
                    profit: 62,
                  },
                  {
                    date: "2024-01-05",
                    profit: 52,
                  },
                  {
                    date: "2024-01-06",
                    profit: 62,
                  },
                  {
                    date: "2024-01-07",
                    profit: 70,
                  },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                  }}
                />
                <Line
                  dataKey="profit"
                  type="natural"
                  fill="var(--color-profit)"
                  stroke="var(--color-profit)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    fill: "var(--color-profit)",
                    stroke: "var(--color-profit)",
                    r: 4,
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
        <Card
          x-chunk="Two horizontal bar charts showing total deliveries taken during the current year and last year."
          className="max-w-xs"
        >
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              You&apos;re average more deliveries a day this year than last
              year.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                12,453
                <span className="text-sm font-normal text-muted-foreground">
                  hours/day
                </span>
              </div>
              <ChartContainer
                config={{
                  deliveries: {
                    label: "deliveries",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="aspect-auto h-[32px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      date: "2024",
                      deliveries: 12435,
                    },
                  ]}
                >
                  <Bar
                    dataKey="deliveries"
                    fill="var(--color-deliveries)"
                    radius={4}
                    barSize={32}
                  >
                    <LabelList
                      position="insideLeft"
                      dataKey="date"
                      offset={8}
                      fontSize={12}
                      fill="white"
                    />
                  </Bar>
                  <YAxis dataKey="date" type="category" tickCount={1} hide />
                  <XAxis dataKey="deliveries" type="number" hide />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                10,103
                <span className="text-sm font-normal text-muted-foreground">
                  hours/day
                </span>
              </div>
              <ChartContainer
                config={{
                  deliveries: {
                    label: "deliveries",
                    color: "hsl(var(--muted))",
                  },
                }}
                className="aspect-auto h-[32px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      date: "2023",
                      deliveries: 10103,
                    },
                  ]}
                >
                  <Bar
                    dataKey="deliveries"
                    fill="var(--color-deliveries)"
                    radius={4}
                    barSize={32}
                  >
                    <LabelList
                      position="insideLeft"
                      dataKey="date"
                      offset={8}
                      fontSize={12}
                      fill="hsl(var(--muted-foreground))"
                    />
                  </Bar>
                  <YAxis dataKey="date" type="category" tickCount={1} hide />
                  <XAxis dataKey="deliveries" type="number" hide />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card
          x-chunk="A bar chart showing the profit for the past 7 days."
          className="max-w-xs"
        >
          <CardHeader className="p-4 pb-0">
            <CardTitle>Profit</CardTitle>
            <CardDescription>
              Over the last 7 days, your revenue was 12.5 k per day.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              12.5
              <span className="text-sm font-normal text-muted-foreground">
                k
              </span>
            </div>
            <ChartContainer
              config={{
                deliveries: {
                  label: "deliveries",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[72px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    deliveries: 2000,
                  },
                  {
                    date: "2024-01-02",
                    deliveries: 2100,
                  },
                  {
                    date: "2024-01-03",
                    deliveries: 2200,
                  },
                  {
                    date: "2024-01-04",
                    deliveries: 1300,
                  },
                  {
                    date: "2024-01-05",
                    deliveries: 1400,
                  },
                  {
                    date: "2024-01-06",
                    deliveries: 2500,
                  },
                  {
                    date: "2024-01-07",
                    deliveries: 1600,
                  },
                ]}
              >
                <Bar
                  dataKey="deliveries"
                  fill="var(--color-deliveries)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          x-chunk="A bar chart showing Watched, stand by, and delay progress."
          className="max-w-xs"
        >
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                Watched: {
                  label: "Watched",
                  color: "hsl(var(--chart-1))",
                },
                delay: {
                  label: "Delay",
                  color: "hsl(var(--chart-2))",
                },
                delay_by: {
                  label: "Stand by",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[140px] w-full"
            >
              <BarChart
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 10,
                }}
                data={[
                  {
                    activity: "delay",
                    value: (8 / 12) * 100,
                    label: "8/12 hr",
                    fill: "var(--color-delay)",
                  },
                  {
                    activity: "stand by",
                    value: (46 / 60) * 100,
                    label: "46/60 orders",
                    fill: "var(--color-stand_by)",
                  },
                  {
                    activity: "Watched",
                    value: (245 / 360) * 100,
                    label: "245/360 orders",
                    fill: "var(--color-Watched)",
                  },
                ]}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="activity"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-row border-t p-4">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Watched</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  562
                  <span className="text-sm font-normal text-muted-foreground">
                    orders
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Stand by</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  73
                  <span className="text-sm font-normal text-muted-foreground">
                    orders
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Delay</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  14
                  <span className="text-sm font-normal text-muted-foreground">
                    hr
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6">
        <Card
          x-chunk="A radial bar chart showing the percentage of time spent moving, exercising, and delaying."
          className="max-w-xs"
        >
          <CardContent className="flex gap-4 p-4">
            <div className="grid items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Watched</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  562/600
                  <span className="text-sm font-normal text-muted-foreground">
                    practice
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Stand by</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  73/120
                  <span className="text-sm font-normal text-muted-foreground">
                    practice
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">practice</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  8/12
                  <span className="text-sm font-normal text-muted-foreground">
                    hr
                  </span>
                </div>
              </div>
            </div>
            <ChartContainer
              config={{
                Watched: {
                  label: "Watched",
                  color: "hsl(var(--chart-1))",
                },
                delay_by: {
                  label: "Stand by",
                  color: "hsl(var(--chart-2))",
                },
                delay: {
                  label: "Delay",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <RadialBarChart
                margin={{
                  left: -10,
                  right: -10,
                  top: -10,
                  bottom: -10,
                }}
                data={[
                  {
                    activity: "delay",
                    value: (8 / 12) * 100,
                    fill: "var(--color-delay)",
                  },
                  {
                    activity: "stand by",
                    value: (46 / 60) * 100,
                    fill: "var(--color-stand_by)",
                  },
                  {
                    activity: "Watched",
                    value: (245 / 360) * 100,
                    fill: "var(--color-Watched)",
                  },
                ]}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar dataKey="value" background cornerRadius={5} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          x-chunk="A bar chart showing active practice in the past 7 days."
          className="max-w-xs"
        >
          <CardHeader className="p-4 pb-0">
            <CardTitle>Active Practice</CardTitle>
            <CardDescription>
              You&apos;re gaining an average of 754 customers per day. Good job!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
            <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
              1,254
              <span className="text-sm font-normal text-muted-foreground">
                min/day
              </span>
            </div>
            <ChartContainer
              config={{
                customers: {
                  label: "customers",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[64px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    customers: 354,
                  },
                  {
                    date: "2024-01-02",
                    customers: 514,
                  },
                  {
                    date: "2024-01-03",
                    customers: 345,
                  },
                  {
                    date: "2024-01-04",
                    customers: 734,
                  },
                  {
                    date: "2024-01-05",
                    customers: 645,
                  },
                  {
                    date: "2024-01-06",
                    customers: 456,
                  },
                  {
                    date: "2024-01-07",
                    customers: 345,
                  },
                ]}
              >
                <Bar
                  dataKey="customers"
                  fill="var(--color-customers)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card
          x-chunk="An area chart showing the time spent in delay for the past 7 days."
          className="max-w-xs"
        >
          <CardHeader className="space-y-0 pb-0">
            <CardDescription>Time in delay</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              8
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                hr
              </span>
              35
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                min
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                time: {
                  label: "Time",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <AreaChart
                accessibilityLayer
                data={[
                  {
                    date: "2024-01-01",
                    time: 8.5,
                  },
                  {
                    date: "2024-01-02",
                    time: 7.2,
                  },
                  {
                    date: "2024-01-03",
                    time: 8.1,
                  },
                  {
                    date: "2024-01-04",
                    time: 6.2,
                  },
                  {
                    date: "2024-01-05",
                    time: 5.2,
                  },
                  {
                    date: "2024-01-06",
                    time: 8.1,
                  },
                  {
                    date: "2024-01-07",
                    time: 7.0,
                  },
                ]}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="date" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                <defs>
                  <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-time)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="time"
                  type="natural"
                  fill="url(#fillTime)"
                  fillOpacity={0.4}
                  stroke="var(--color-time)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      Time in delay
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          hr
                        </span>
                      </div>
                    </div>
                  )}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1">
        <div className="flex gap-6">
          <SupplyDemandGraph />
          <RecommendationCard />
        </div>
      </div>
    </div>
  );
}
