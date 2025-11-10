"use client"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface AreaChartProps {
  data: { name: string; value: number }[]
  index: string
  categories: string[]
  colors: string[]
  yAxisWidth?: number
}

export function AreaChart({ data, index, categories, colors, yAxisWidth = 40 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} />
        <Tooltip />
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i]}
            fill={colors[i]}
            fillOpacity={0.3}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}