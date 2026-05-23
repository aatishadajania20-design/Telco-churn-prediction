"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard, Brain, BarChart3, Activity,
  TrendingUp, Zap, ChevronRight, Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Platform", icon: Zap, group: "home" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { href: "/predict", label: "AI Predictor", icon: Brain, group: "main" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, group: "main" },
  { href: "/model", label: "Model Intel", icon: Activity, group: "main" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-slate-950/90 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-900/50">
          <Cpu className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-slate-100">ChurnIQ</span>
          <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-widest text-indigo-400">Pro</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.filter(n => n.group === "main").map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "nav-item-active text-indigo-300"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300",
                    )}
                  />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto"
                      initial={false}
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                    </motion.div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Resources
          </p>
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-all"
          >
            <TrendingUp className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
            Overview
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3 rounded-lg bg-indigo-600/10 border border-indigo-500/20 px-3 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600/30">
            <Brain className="h-3.5 w-3.5 text-indigo-300" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-300">AI Model</p>
            <p className="text-[10px] text-indigo-400/70">Random Forest • v2.0</p>
          </div>
          <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </aside>
  )
}
