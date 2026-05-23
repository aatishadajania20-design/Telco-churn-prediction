"use client"

import { motion } from "framer-motion"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  fpr: number[]
  tpr: number[]
  auc: number
}

export function ROCCurve({ fpr, tpr, auc }: Props) {
  const data = fpr.map((x, i) => ({ fpr: parseFloat(x.toFixed(3)), tpr: parseFloat(tpr[i].toFixed(3)) }))

  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>ROC Curve</CardTitle>
            <CardDescription>Receiver Operating Characteristic analysis</CardDescription>
          </div>
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-center">
            <p className="text-xs text-indigo-400 font-medium">AUC Score</p>
            <p className="text-xl font-bold stat-number text-indigo-300">{auc.toFixed(3)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="rocGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="fpr"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "False Positive Rate", position: "insideBottom", offset: -5, fill: "#475569", fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                formatter={(v: any) => [v.toFixed(3)]}
                labelFormatter={(l) => `FPR: ${l}`}
              />
              {/* Random classifier diagonal */}
              <ReferenceLine
                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                stroke="#475569"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="tpr"
                stroke="url(#rocGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#818cf8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        <p className="text-xs text-slate-600 text-center mt-2">
          Dashed line = random classifier (AUC = 0.50)
        </p>
      </CardContent>
    </Card>
  )
}
