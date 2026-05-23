import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ChurnIQ — AI Churn Intelligence Platform",
  description:
    "Enterprise-grade AI analytics platform for telecom customer churn prediction and retention intelligence.",
  keywords: ["churn prediction", "AI analytics", "telecom", "customer retention", "machine learning"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#030712] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  )
}
