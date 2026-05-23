"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ChurnByService } from "@/lib/types"

interface Props {
  data: ChurnByService[]
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981"]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-900 p-3 shadow-2xl">
      <p className="text-xs font-semibold text-slate-200 mb-1">{payload[0].name}</p>
      <p className="text-xs text-indigo-400">Churn: <span className="font-bold">{payload[0].payload.churn_rate}%</span></p>
      <p className="text-xs text-slate-500">{payload[0].value.toLocaleString()} customers</p>
    </div>
  )
}

export function ServiceChart({ data }: Props) {
  const pieData = data.map((d) => ({ name: d.InternetService, value: d.total, ...d }))

  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Customers by Internet Service</CardTitle>
        <CardDescription>Fiber optic users show highest churn tendency</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {data.map((item, i) => (
            <div key={item.InternetService} className="text-center rounded-lg bg-slate-800/50 p-2">
              <p className="text-xs text-slate-500 truncate">{item.InternetService}</p>
              <p className="text-base font-bold stat-number" style={{ color: COLORS[i] }}>
                {item.churn_rate}%
              </p>
              <p className="text-xs text-slate-600">churn</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
