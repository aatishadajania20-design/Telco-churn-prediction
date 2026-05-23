"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { PredictionForm } from "@/components/predict/PredictionForm"
import { PredictionResult } from "@/components/predict/PredictionResult"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PredictionResult as PR } from "@/lib/types"

export default function PredictPage() {
  const [result, setResult] = useState<PR | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar
          title="AI Predictor"
          subtitle="Individual customer churn risk assessment"
        />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
            {/* Input Form */}
            <Card className="border border-white/[0.06]">
              <CardHeader>
                <CardTitle>Customer Profile</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[calc(100vh-200px)]">
                <PredictionForm onResult={setResult} onLoading={setLoading} />
              </CardContent>
            </Card>

            {/* Result Panel */}
            <div className="sticky top-6 self-start">
              <PredictionResult result={result} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
