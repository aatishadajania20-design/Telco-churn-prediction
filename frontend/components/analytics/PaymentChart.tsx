"use client"

import { motion } from "framer-motion"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ChurnByPayment } from "@/lib/types"

interface Props {
  data: ChurnByPayment[]
}

const COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#6366f1"]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-900 p-3 shadow-2xl">
      <p className="text-xs font-semibold text-slate-200 mb-1">{payload[0]?.payload?.PaymentMethod}</p>
      <p className="text-xs text-indigo-400">Churn Rate: <span className="font-bold">{payload[0]?.value}%</span></p>
      <p className="text-xs text-slate-500">Total: {payload[0]?.payload?.total?.toLocaleString()}</p>
    </div>
  )
}

export function PaymentChart({ data }: Props) {
  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Churn by Payment Method</CardTitle>
        <CardDescription>Electronic check customers churn at highest rates</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis
                type="category"
                dataKey="PaymentMethod"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="churn_rate" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}
