"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { ConfusionMatrix } from "@/components/analytics/ConfusionMatrix"
import { ROCCurve } from "@/components/analytics/ROCCurve"
import { FeatureImportanceChart } from "@/components/dashboard/FeatureImportanceChart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { api, MOCK } from "@/lib/api"
import type { ModelPerformance, FeatureImportance } from "@/lib/types"

interface MetricCardProps {
  label: string
  value: string
  sub: string
  color: string
  delay: number
}

function MetricCard({ label, value, sub, color, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="border border-white/[0.06] text-center">
        <CardContent className="p-5">
          <p className={`text-3xl font-bold stat-number ${color}`}>{value}</p>
          <p className="text-sm font-medium text-slate-200 mt-1">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ModelPage() {
  const [perf, setPerf] = useState<ModelPerformance | null>(null)
  const [features, setFeatures] = useState<FeatureImportance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [p, f] = await Promise.all([api.modelPerformance(), api.featureImportance()])
        setPerf(p)
        setFeatures(f)
      } catch {
        setPerf(MOCK.modelPerformance)
        setFeatures(MOCK.featureImportance)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = perf
    ? [
        { label: "Accuracy", value: `${perf.accuracy}%`, sub: "Overall predictions", color: "text-indigo-400", delay: 0 },
        { label: "Precision", value: `${perf.precision}%`, sub: "Churn class precision", color: "text-violet-400", delay: 0.1 },
        { label: "Recall", value: `${perf.recall}%`, sub: "Churn class recall", color: "text-emerald-400", delay: 0.2 },
        { label: "F1 Score", value: `${perf.f1_score}%`, sub: "Harmonic mean", color: "text-amber-400", delay: 0.3 },
        { label: "AUC-ROC", value: perf.auc.toFixed(3), sub: "Area under curve", color: "text-rose-400", delay: 0.4 },
      ]
    : []

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Model Intelligence" subtitle="Random Forest classifier performance analysis" />
        <main className="p-6 space-y-6">
          {/* Model badge */}
          <div className="flex items-center gap-3">
            <Badge variant="default">Random Forest</Badge>
            <Badge variant="secondary">scikit-learn</Badge>
            <Badge variant="outline">SMOTE Balanced</Badge>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Model Active
            </div>
          </div>

          {/* Metric cards */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
              </>
            ) : perf ? (
              <>
                <ConfusionMatrix matrix={perf.confusion_matrix} />
                <ROCCurve fpr={perf.roc_curve.fpr} tpr={perf.roc_curve.tpr} auc={perf.auc} />
              </>
            ) : null}
          </div>

          {/* Feature importance */}
          {loading ? (
            <Skeleton className="h-80 rounded-xl" />
          ) : (
            <FeatureImportanceChart data={features} />
          )}

          {/* Model info */}
          <Card className="border border-white/[0.06]">
            <CardHeader>
              <CardTitle>Model Architecture</CardTitle>
              <CardDescription>Training configuration and methodology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Algorithm", value: "Random Forest" },
                  { label: "Training Size", value: "5,634 samples" },
                  { label: "Test Size", value: "1,409 samples" },
                  { label: "Features", value: "31 engineered" },
                  { label: "Class Balancing", value: "SMOTE" },
                  { label: "Encoding", value: "One-Hot" },
                  { label: "Validation", value: "80/20 split" },
                  { label: "Framework", value: "scikit-learn" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-slate-900 border border-white/[0.05] p-3">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
