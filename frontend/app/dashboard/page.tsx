"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { KPICards } from "@/components/dashboard/KPICards"
import { ChurnByContractChart } from "@/components/dashboard/ChurnByContractChart"
import { ChurnByTenureChart } from "@/components/dashboard/ChurnByTenureChart"
import { FeatureImportanceChart } from "@/components/dashboard/FeatureImportanceChart"
import { SegmentChart } from "@/components/dashboard/SegmentChart"
import { Skeleton } from "@/components/ui/skeleton"
import { api, MOCK } from "@/lib/api"
import type {
  OverviewData, ChurnByContract, ChurnByTenure,
  FeatureImportance, Segment,
} from "@/lib/types"

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [contracts, setContracts] = useState<ChurnByContract[]>([])
  const [tenure, setTenure] = useState<ChurnByTenure[]>([])
  const [features, setFeatures] = useState<FeatureImportance[]>([])
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [ov, ct, te, fi, sg] = await Promise.all([
          api.overview(),
          api.churnByContract(),
          api.churnByTenure(),
          api.featureImportance(),
          api.segments(),
        ])
        setOverview(ov)
        setContracts(ct)
        setTenure(te)
        setFeatures(fi)
        setSegments(sg)
      } catch {
        // API offline — use mock
        setOverview(MOCK.overview)
        setContracts(MOCK.churnByContract)
        setTenure(MOCK.churnByTenure)
        setFeatures(MOCK.featureImportance)
        setSegments(MOCK.segments)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar
          title="Analytics Dashboard"
          subtitle="Telco Churn Intelligence Platform"
        />
        <main className="p-6 space-y-6">
          {/* KPI Cards */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            overview && <KPICards data={overview} />
          )}

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
              </>
            ) : (
              <>
                <ChurnByContractChart data={contracts} />
                <ChurnByTenureChart data={tenure} />
              </>
            )}
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
              </>
            ) : (
              <>
                <FeatureImportanceChart data={features} />
                <SegmentChart data={segments} />
              </>
            )}
          </div>

          {/* Insight callout */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 flex-shrink-0 mt-0.5">
                  <span className="text-sm">💡</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-300 mb-1">Key Insight</p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Month-to-month contract customers churn at <strong className="text-rose-400">42.7%</strong> — over 15x higher than two-year contract holders.
                    Converting just 10% of month-to-month customers to annual plans could protect over{" "}
                    <strong className="text-emerald-400">$280,000</strong> in annual revenue.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
