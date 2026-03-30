"use client"

import dynamic from "next/dynamic"

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import("recharts").then(m => m.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then(m => m.Line), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false })

export default function PriceChart({ history }: { history: { value: number; created_at: string }[] }) {
  if (!history || history.length === 0) return null

  const data = history.map((h) => ({
    value: Number(h.value),
    date: new Date(h.created_at).toLocaleDateString("fr-FR"),
  }))

  return (
    <div style={{ width: 300, height: 150 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString("fr-FR")} €`, "Value"]} />
          <Line dataKey="value" stroke="#c9a84c" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
