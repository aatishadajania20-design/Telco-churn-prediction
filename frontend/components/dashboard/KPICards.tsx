"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatNumber, formatCurrency, formatPercent } from "@/lib/utils"
import type { OverviewData } from "@/lib/types"

interface KPICardsProps {
  data: OverviewData
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      title: "Total Customers",
      value: formatNumber(data.total_customers),
      sub: `${formatNumber(data.retained_customers)} retained`,
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      trend: "+2.4%",
      trendUp: true,
    },
    {
      title: "Churn Rate",
      value: formatPercent(data.churn_rate),
      sub: `${formatNumber(data.churned_customers)} customers at risk`,
      icon: TrendingUp,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      trend: "-1.2%",
      trendUp: false,
    },
    {
      title: "Revenue at Risk",
      value: formatCurrency(data.revenue_at_risk),
      sub: `${formatCurrency(data.avg_monthly_revenue)} avg/month`,
      icon: DollarSign,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      trend: "+5.1%",
      trendUp: false,
    },
    {
      title: "Avg Tenure",
      value: `${data.avg_tenure_months}mo`,
      sub: "Customer lifetime span",
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      trend: "+0.8mo",
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div key={card.title} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className={`border ${card.border} relative overflow-hidden group hover:border-opacity-40 transition-all duration-300 hover:shadow-xl`}>
              <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? "text-emerald-400" : "text-rose-400"}`}>
                    {card.trendUp
                      ? <ArrowUpRight className="h-3.5 w-3.5" />
                      : <ArrowDownRight className="h-3.5 w-3.5" />
                    }
                    {card.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="stat-number text-2xl font-bold text-slate-100">{card.value}</p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{card.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{card.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
