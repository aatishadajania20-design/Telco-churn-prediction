"use client"

import { motion } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ChurnByContract } from "@/lib/types"

const COLORS = ["#f43f5e", "#f59e0b", "#10b981"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-900 p-3 shadow-2xl">
      <p className="text-xs font-semibold text-slate-200 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.fill }}>
          Churn Rate: <span className="font-bold">{p.value}%</span>
        </p>
      ))}
    </div>
  )
}

interface Props {
  data: ChurnByContract[]
}

export function ChurnByContractChart({ data }: Props) {
  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Churn by Contract Type</CardTitle>
        <CardDescription>Month-to-month contracts drive the highest churn</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="Contract"
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
              <Bar dataKey="churn_rate" radius={[6, 6, 0, 0]} maxBarSize={64}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {data.map((item, i) => (
            <div key={item.Contract} className="flex flex-col gap-1 rounded-lg bg-slate-800/50 p-2.5">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-xs text-slate-400 truncate">{item.Contract}</span>
              </div>
              <span className="text-lg font-bold text-slate-100 stat-number">{item.churn_rate}%</span>
              <span className="text-xs text-slate-500">{item.total.toLocaleString()} customers</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
