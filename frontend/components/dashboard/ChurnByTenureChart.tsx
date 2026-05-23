"use client"

import { motion } from "framer-motion"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ChurnByTenure } from "@/lib/types"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-900 p-3 shadow-2xl">
      <p className="text-xs font-semibold text-slate-300 mb-1.5">Tenure: {label}</p>
      <p className="text-xs text-indigo-400">
        Churn Rate: <span className="font-bold">{payload[0]?.value}%</span>
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Customers: {payload[0]?.payload?.total?.toLocaleString()}
      </p>
    </div>
  )
}

interface Props {
  data: ChurnByTenure[]
}

export function ChurnByTenureChart({ data }: Props) {
  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Churn Rate by Tenure Cohort</CardTitle>
        <CardDescription>Newer customers churn at significantly higher rates</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="tenureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="tenure_group"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="churn_rate"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#tenureGradient)"
                dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#818cf8", stroke: "#1e1b4b", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}
