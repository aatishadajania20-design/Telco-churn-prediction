"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { PaymentChart } from "@/components/analytics/PaymentChart"
import { MonthlyDistributionChart } from "@/components/analytics/MonthlyDistributionChart"
import { ServiceChart } from "@/components/analytics/ServiceChart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { api, MOCK } from "@/lib/api"
import type { ChurnByPayment, MonthlyDistribution, ChurnByService, Segment } from "@/lib/types"

export default function AnalyticsPage() {
  const [payment, setPayment] = useState<ChurnByPayment[]>([])
  const [distribution, setDistribution] = useState<MonthlyDistribution | null>(null)
  const [service, setService] = useState<ChurnByService[]>([])
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [py, dt, sv, sg] = await Promise.all([
          api.churnByPayment(),
          api.monthlyDistribution(),
          api.churnByService(),
          api.segments(),
        ])
        setPayment(py)
        setDistribution(dt)
        setService(sv)
        setSegments(sg)
      } catch {
        setPayment([
          { PaymentMethod: "Electronic check", total: 2365, churned: 1071, churn_rate: 45.3 },
          { PaymentMethod: "Mailed check", total: 1612, churned: 308, churn_rate: 19.1 },
          { PaymentMethod: "Bank transfer (automatic)", total: 1544, churned: 258, churn_rate: 16.7 },
          { PaymentMethod: "Credit card (automatic)", total: 1522, churned: 232, churn_rate: 15.2 },
        ])
        setDistribution({
          bins: ["$0-10","$10-20","$20-30","$30-40","$40-50","$50-60","$60-70","$70-80","$80-90","$90-100","$100-110","$110-120"],
          churned: [12, 28, 95, 142, 178, 201, 248, 312, 287, 198, 106, 62],
          retained: [145, 289, 412, 521, 634, 578, 498, 423, 387, 312, 245, 130],
        })
        setService([
          { InternetService: "DSL", total: 2421, churned: 459, churn_rate: 18.96 },
          { InternetService: "Fiber optic", total: 3096, churned: 1297, churn_rate: 41.89 },
          { InternetService: "No", total: 1526, churned: 113, churn_rate: 7.40 },
        ])
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
        <Navbar title="Analytics" subtitle="Deep-dive churn analysis" />
        <main className="p-6 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="segments">Segments</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {loading ? (
                  <>
                    <Skeleton className="h-80 rounded-xl" />
                    <Skeleton className="h-80 rounded-xl" />
                  </>
                ) : (
                  <>
                    <PaymentChart data={payment} />
                    <ServiceChart data={service} />
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="segments">
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  [...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
                ) : (
                  segments.map((seg, i) => (
                    <motion.div
                      key={seg.segment}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="border border-white/[0.06] hover:border-indigo-500/30 transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">{seg.segment}</CardTitle>
                          <CardDescription>{seg.count.toLocaleString()} customers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Avg Monthly</span>
                            <span className="font-mono text-slate-300">${seg.avg_monthly_charges}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Avg Tenure</span>
                            <span className="font-mono text-slate-300">{seg.avg_tenure}mo</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Churn Rate</span>
                            <span className={`font-bold font-mono ${seg.churn_rate > 50 ? "text-rose-400" : seg.churn_rate > 25 ? "text-amber-400" : "text-emerald-400"}`}>
                              {seg.churn_rate}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="distribution">
              <div className="mt-4">
                {loading ? (
                  <Skeleton className="h-96 rounded-xl" />
                ) : (
                  distribution && <MonthlyDistributionChart data={distribution} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
