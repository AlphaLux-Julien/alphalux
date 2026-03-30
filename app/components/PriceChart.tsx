"use client"

import React from "react"

let LineChart
let Line
let XAxis
let YAxis
let Tooltip
let ResponsiveContainer

if (typeof window !== "undefined") {
  const recharts = require("recharts")

  LineChart = recharts.LineChart
  Line = recharts.Line
  XAxis = recharts.XAxis
  YAxis = recharts.YAxis
  Tooltip = recharts.Tooltip
  ResponsiveContainer = recharts.ResponsiveContainer
}

export default function PriceChart({ history }) {

  if (!history || history.length === 0) return null

  if (typeof window === "undefined") return null

  const data = history.map((h) => ({
    value: Number(h.value),
    date: new Date(h.created_at).toLocaleDateString(),
  }))

  return (
    <div style={{ width: 300, height: 150 }}>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}