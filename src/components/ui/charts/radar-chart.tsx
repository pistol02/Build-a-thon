"use client"

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"

interface RadarChartProps {
  data: { category: string; value: number }[]
  index: string
  categories: string[]
  colors: string[]
}

export function RadarChart({ data, index, categories, colors }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={index} />
        <PolarRadiusAxis />
        {categories.map((category, i) => (
          <Radar
            key={category}
            dataKey={category}
            stroke={colors[i]}
            fill={colors[i]}
            fillOpacity={0.6}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}