"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Brain, Shield, Zap, Users, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => ({ default: m.SplineScene })),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><span className="loader" /></div> }
)

const stats = [
  { label: "Customers Analysed", value: "7,043", icon: Users, color: "text-indigo-400" },
  { label: "Model Accuracy", value: "80.4%", icon: Brain, color: "text-violet-400" },
  { label: "Avg Churn Rate", value: "26.5%", icon: TrendingUp, color: "text-rose-400" },
  { label: "Revenue Protected", value: "$2.8M", icon: DollarSign, color: "text-emerald-400" },
]

const features = [
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "Random Forest model with 80%+ accuracy identifies at-risk customers before they leave.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Cohort analysis, segment intelligence, and behavioural pattern detection.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Explainable AI",
    description: "Feature importance and model transparency — understand every prediction.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Real-Time Scoring",
    description: "Instant churn probability scores with revenue impact estimates and recommendations.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
]

export default function HeroPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] grid-pattern">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full">
        <Card className="w-full rounded-none border-x-0 border-t-0 bg-black/[0.96] relative overflow-hidden min-h-[600px]">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

          <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
            {/* Left: Text content */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">
                    Enterprise AI Platform
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Predict Churn
                  </span>
                  <br />
                  <span className="gradient-text">Before It Happens</span>
                </h1>

                <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">
                  AI-powered telecom analytics that identifies at-risk customers,
                  quantifies revenue exposure, and delivers actionable retention intelligence.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="gradient" size="lg">
                    <Link href="/dashboard">
                      View Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/predict">
                      Run Prediction <Brain className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Stats strip */}
                <div className="mt-10 flex flex-wrap gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-2"
                      >
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-100 stat-number">{stat.value}</p>
                          <p className="text-xs text-slate-500">{stat.label}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right: 3D Spline Scene */}
            <div className="flex-1 relative min-h-[400px] lg:min-h-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0"
              >
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Enterprise Analytics Intelligence
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to understand, predict, and prevent customer churn at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className={`border ${feat.border} h-full hover:border-opacity-60 transition-all duration-300 group`}>
                  <CardContent className="p-5">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feat.bg} mb-4`}>
                      <Icon className={`h-5 w-5 ${feat.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Button asChild variant="gradient" size="xl">
            <Link href="/dashboard">
              Launch Analytics Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </main>
  )
}
