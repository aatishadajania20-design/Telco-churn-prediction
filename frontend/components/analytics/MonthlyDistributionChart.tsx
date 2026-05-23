"use client"

import { motion } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { MonthlyDistribution } from "@/lib/types"

interface Props {
  data: MonthlyDistribution
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-900 p-3 shadow-2xl min-w-[140px]">
      <p className="text-xs font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-4 text-xs">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-mono text-slate-300">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function MonthlyDistributionChart({ data }: Props) {
  const chartData = data.bins.map((bin, i) => ({
    bin,
    Churned: data.churned[i],
    Retained: data.retained[i],
  }))

  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Monthly Charges Distribution</CardTitle>
        <CardDescription>Customer distribution across billing tiers by churn status</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="bin"
                tick={{ fill: "#64748b", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                angle={-30}
                textAnchor="end"
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 12 }}
                iconType="circle"
              />
              <Bar dataKey="Retained" fill="#10b981" fillOpacity={0.7} radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Churned" fill="#f43f5e" fillOpacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}
