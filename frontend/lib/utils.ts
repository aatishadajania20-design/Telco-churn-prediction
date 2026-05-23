import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "Critical": return "text-rose-400"
    case "High": return "text-orange-400"
    case "Medium": return "text-amber-400"
    case "Low": return "text-emerald-400"
    default: return "text-slate-400"
  }
}

export function getRiskBg(riskLevel: string): string {
  switch (riskLevel) {
    case "Critical": return "bg-rose-500/15 border-rose-500/30"
    case "High": return "bg-orange-500/15 border-orange-500/30"
    case "Medium": return "bg-amber-500/15 border-amber-500/30"
    case "Low": return "bg-emerald-500/15 border-emerald-500/30"
    default: return "bg-slate-500/15 border-slate-500/30"
  }
}
