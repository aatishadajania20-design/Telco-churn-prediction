"use client"

import { Bell, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  title: string
  subtitle?: string
}

export function Navbar({ title, subtitle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl px-6">
      <div>
        <h1 className="text-base font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <div className="ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
          A
        </div>
      </div>
    </header>
  )
}
