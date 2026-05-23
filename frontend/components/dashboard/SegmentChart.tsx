"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Segment } from "@/lib/types"

interface Props {
  data: Segment[]
}

const SEGMENT_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "Champions": { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  "At Risk High-Value": { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-300", dot: "bg-rose-400" },
  "Loyal": { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-300", dot: "bg-indigo-400" },
  "New Customers": { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-300", dot: "bg-amber-400" },
  "Price Sensitive": { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-300", dot: "bg-slate-400" },
}

export function SegmentChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="border border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle>Customer Segments</CardTitle>
        <CardDescription>Value-based customer classification</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stacked bar */}
        <div className="flex h-3 w-full rounded-full overflow-hidden mb-5 gap-0.5">
          {data.map((seg) => {
            const colors = SEGMENT_COLORS[seg.segment] ?? SEGMENT_COLORS["Loyal"]
            return (
              <motion.div
                key={seg.segment}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ width: `${(seg.count / total) * 100}%` }}
                className={`h-full ${colors.dot.replace("bg-", "bg-opacity-80 bg-")}`}
                title={`${seg.segment}: ${seg.count}`}
              />
            )
          })}
        </div>

        <div className="space-y-2.5">
          {data.map((seg, i) => {
            const colors = SEGMENT_COLORS[seg.segment] ?? SEGMENT_COLORS["Loyal"]
            const pct = ((seg.count / total) * 100).toFixed(1)
            return (
              <motion.div
                key={seg.segment}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center justify-between rounded-lg border ${colors.border} ${colors.bg} px-3 py-2.5`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                  <div>
                    <p className={`text-xs font-semibold ${colors.text}`}>{seg.segment}</p>
                    <p className="text-xs text-slate-500">{seg.count.toLocaleString()} customers · {pct}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-300">${seg.avg_monthly_charges}/mo</p>
                  <p className={`text-xs font-semibold ${seg.churn_rate > 50 ? "text-rose-400" : seg.churn_rate > 25 ? "text-amber-400" : "text-emerald-400"}`}>
                    {seg.churn_rate}% churn
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
