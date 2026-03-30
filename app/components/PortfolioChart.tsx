"use client"

import dynamic from "next/dynamic"

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import("recharts").then(m => m.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then(m => m.Line), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false })

export default function PortfolioChart({ data }: { data: { date: string; value: number }[] }) {
  if (!data || data.length === 0) return (
    <div style={{
      width: "100%",
      height: 180,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #1a1a1a",
      borderRadius: 2,
      fontFamily: "'Montserrat', sans-serif",
      fontSize: 11,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#2a2a2a",
    }}>
      No history yet
    </div>
  )

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#3a3a3a", fontSize: 10, fontFamily: "Montserrat, sans-serif" }}
            axisLine={{ stroke: "#1a1a1a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#3a3a3a", fontSize: 10, fontFamily: "Montserrat, sans-serif" }}
            axisLine={false}
            tickLine={false}
            width={60}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#0d0d0d",
              border: "1px solid #2a2a2a",
              borderRadius: 2,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 11,
              color: "#c9a84c",
            }}
            labelStyle={{ color: "#555", fontSize: 10, letterSpacing: "0.1em" }}
            formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`, "Value"]}
            cursor={{ stroke: "#2a2a2a", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#c9a84c"
            strokeWidth={1.5}
            dot={{ fill: "#c9a84c", r: 3, strokeWidth: 0 }}
            activeDot={{ fill: "#e8c96a", r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
