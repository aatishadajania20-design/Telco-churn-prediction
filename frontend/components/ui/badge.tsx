import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
        secondary: "border-slate-700 bg-slate-800 text-slate-300",
        destructive: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        outline: "border-white/10 bg-transparent text-slate-300",
        critical: "border-rose-500/50 bg-rose-500/20 text-rose-200",
        high: "border-orange-500/50 bg-orange-500/15 text-orange-300",
        medium: "border-amber-500/50 bg-amber-500/15 text-amber-300",
        low: "border-emerald-500/50 bg-emerald-500/15 text-emerald-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
