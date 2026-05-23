"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  matrix: number[][]
}

export function ConfusionMatrix({ matrix }: Props) {
  const tn = matrix[0][0]
  const fp = matrix[0][1]
  const fn = matrix[1][0]
  const tp = matrix[1][1]
  const total = tn + fp + fn + tp

  const cells = [
    { label: "True Negative", value: tn, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300", sub: "Correctly predicted stay" },
    { label: "False Positive", value: fp, color: "bg-amber-500/20 border-amber-500/30 text-amber-300", sub: "Predicted churn, stayed" },
    { label: "False Negative", value: fn, color: "bg-orange-500/20 border-orange-500/30 text-orange-300", sub: "Predicted stay, churned" },
    { label: "True Positive", value: tp, color: "bg-indigo-500/20 border-indigo-500/30 text-indigo-300", sub: "Correctly predicted churn" },
  ]

  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Confusion Matrix</CardTitle>
        <CardDescription>Model prediction accuracy breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Axis labels */}
        <div className="flex items-center justify-center mb-4">
          <div className="text-xs text-slate-500 mr-3 w-20 text-right">Actual →</div>
          <div className="grid grid-cols-2 gap-1 flex-1 max-w-xs">
            <p className="text-center text-xs font-semibold text-slate-400">Stay</p>
            <p className="text-center text-xs font-semibold text-slate-400">Churn</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="writing-vertical text-xs text-slate-500 mr-3 w-20 text-right">
            <div className="flex flex-col gap-12 items-end">
              <span>Pred Stay</span>
              <span>Pred Churn</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1 max-w-xs mx-auto">
            {cells.map((cell, i) => (
              <motion.div
                key={cell.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`rounded-xl border p-4 text-center ${cell.color}`}
              >
                <p className="text-2xl font-bold stat-number">{cell.value.toLocaleString()}</p>
                <p className="text-[10px] font-semibold mt-1">{cell.label}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{((cell.value / total) * 100).toFixed(1)}%</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-1.5">
          {cells.map((cell) => (
            <div key={cell.label} className="flex justify-between text-xs">
              <span className="text-slate-500">{cell.label}</span>
              <span className="text-slate-400">{cell.sub}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
