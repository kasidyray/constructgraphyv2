
import * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  className,
}: BarChartProps) {
  // Create a mapping of category to color
  const categoryColorMap = React.useMemo(() => {
    return Object.fromEntries(
      categories.map((category, i) => {
        return [category, colors[i % colors.length]]
      })
    )
  }, [categories, colors])

  // Create chart config for ChartContainer
  const chartConfig = React.useMemo(() => {
    return Object.fromEntries(
      categories.map((category) => {
        return [
          category,
          {
            color: categoryColorMap[category],
          },
        ]
      })
    )
  }, [categories, categoryColorMap])

  return (
    <ChartContainer 
      className={className}
      config={chartConfig}
    >
      <RechartsBarChart
        data={data}
        margin={{
          top: 16,
          right: 16,
          bottom: 16,
          left: 8,
        }}
      >
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#888888" 
          />
        )}
        {showXAxis && (
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            padding={{ left: 8, right: 8 }}
            style={{
              fontSize: "12px",
              fontFamily: "inherit",
            }}
          />
        )}
        {showYAxis && (
          <YAxis
            width={yAxisWidth}
            tickLine={false}
            axisLine={false}
            style={{
              fontSize: "12px",
              fontFamily: "inherit",
            }}
          />
        )}
        <ChartTooltip
          cursor={{ fill: "var(--background)" }}
          content={
            <ChartTooltipContent
              formatter={(value) => valueFormatter(value as number)}
            />
          }
        />
        {categories.map((category) => (
          <Bar
            key={category}
            name={category}
            dataKey={category}
            fill={categoryColorMap[category]}
            radius={[4, 4, 0, 0]}
          />
        ))}
        {showLegend && <Legend />}
      </RechartsBarChart>
    </ChartContainer>
  )
}
