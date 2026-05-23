"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { FeatureImportance } from "@/lib/types"

interface Props {
  data: FeatureImportance[]
}

function cleanLabel(f: string): string {
  return f
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const IMPORTANCE_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-green-500",
  "bg-lime-500",
  "bg-yellow-500",
]

export function FeatureImportanceChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.importance))
  const top10 = data.slice(0, 10)

  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Feature Importance</CardTitle>
        <CardDescription>Top predictors driving churn predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top10.map((item, i) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-300 font-medium truncate max-w-[75%]">
                  {cleanLabel(item.feature)}
                </span>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {(item.importance * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(item.importance / max) * 100}
                className="h-1.5"
                indicatorClassName={IMPORTANCE_COLORS[i % IMPORTANCE_COLORS.length]}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
