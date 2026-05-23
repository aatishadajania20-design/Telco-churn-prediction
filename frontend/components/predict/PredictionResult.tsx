"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, ShieldAlert, AlertTriangle, Zap, DollarSign, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, getRiskColor, getRiskBg } from "@/lib/utils"
import type { PredictionResult } from "@/lib/types"

interface Props {
  result: PredictionResult | null
  loading: boolean
}

function RiskGauge({ probability }: { probability: number }) {
  const angle = (probability / 100) * 180 - 90
  const color = probability > 75 ? "#f43f5e" : probability > 50 ? "#f97316" : probability > 25 ? "#f59e0b" : "#10b981"

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-48 h-24">
        {/* Background arc */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#1e293b" strokeWidth="16" fill="none" strokeLinecap="round" />
        {/* Colored arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          stroke={color}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="251.2"
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (251.2 * probability) / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Needle */}
        <motion.line
          x1="100" y1="100"
          x2={100 + 60 * Math.cos(((angle - 90) * Math.PI) / 180)}
          y2={100 + 60 * Math.sin(((angle - 90) * Math.PI) / 180)}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ rotate: -90, originX: "100px", originY: "100px" }}
          animate={{ rotate: angle, originX: "100px", originY: "100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <circle cx="100" cy="100" r="6" fill={color} />
      </svg>
      <div className="text-center -mt-2">
        <motion.p
          className="text-4xl font-bold stat-number"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {probability.toFixed(1)}%
        </motion.p>
        <p className="text-xs text-slate-500 mt-1">Churn Probability</p>
      </div>
    </div>
  )
}

export function PredictionResult({ result, loading }: Props) {
  if (loading) {
    return (
      <Card className="border border-white/[0.06] h-full">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="border border-white/[0.06] h-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-2">Ready to Analyse</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Configure the customer profile on the left and click <strong className="text-slate-400">Run AI Prediction</strong> to get an instant churn risk assessment.
          </p>
        </div>
      </Card>
    )
  }

  const isChurn = result.prediction === 1
  const riskVariant = result.risk_level.toLowerCase() as "low" | "medium" | "high" | "critical"

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`border ${isChurn ? "border-rose-500/20 glow-rose" : "border-emerald-500/20 glow-emerald"} h-full`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Prediction Result</CardTitle>
              <Badge variant={riskVariant}>{result.risk_level} Risk</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verdict */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center gap-3 rounded-xl border p-4 ${isChurn ? "bg-rose-500/10 border-rose-500/30" : "bg-emerald-500/10 border-emerald-500/30"}`}
            >
              {isChurn
                ? <ShieldAlert className="h-8 w-8 text-rose-400 flex-shrink-0" />
                : <ShieldCheck className="h-8 w-8 text-emerald-400 flex-shrink-0" />
              }
              <div>
                <p className={`text-base font-bold ${isChurn ? "text-rose-300" : "text-emerald-300"}`}>
                  {isChurn ? "Likely to Churn" : "Likely to Stay"}
                </p>
                <p className="text-xs text-slate-400">
                  Model confidence: {isChurn ? result.churn_probability : result.stay_probability}%
                </p>
              </div>
            </motion.div>

            {/* Gauge */}
            <div className="flex justify-center">
              <RiskGauge probability={result.churn_probability} />
            </div>

            {/* Probability bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Churn</span>
                  <span className="font-mono text-rose-400">{result.churn_probability}%</span>
                </div>
                <Progress
                  value={result.churn_probability}
                  className="h-2"
                  indicatorClassName="bg-rose-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Retain</span>
                  <span className="font-mono text-emerald-400">{result.stay_probability}%</span>
                </div>
                <Progress
                  value={result.stay_probability}
                  className="h-2"
                  indicatorClassName="bg-emerald-500"
                />
              </div>
            </div>

            <Separator />

            {/* Revenue at risk */}
            <div className="flex items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">Revenue at Risk</span>
              </div>
              <span className="text-sm font-bold font-mono text-amber-300">
                {formatCurrency(result.revenue_at_risk)}
              </span>
            </div>

            {/* Recommendation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4"
            >
              <div className="flex items-start gap-2.5">
                <Lightbulb className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-indigo-300 mb-1">AI Recommendation</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
