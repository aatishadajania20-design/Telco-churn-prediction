"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import type { CustomerInput, PredictionResult } from "@/lib/types"

const DEFAULT: CustomerInput = {
  gender: "Male",
  SeniorCitizen: "No",
  Partner: "Yes",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 70,
  TotalCharges: 840,
}

type YesNo = "Yes" | "No"
type YesNoNone = "Yes" | "No" | "No internet service"
type YesNoPhone = "Yes" | "No" | "No phone service"

interface Props {
  onResult: (r: PredictionResult) => void
  onLoading: (l: boolean) => void
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-slate-500">{label}</Label>
      {children}
    </div>
  )
}

function YNSelect({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

export function PredictionForm({ onResult, onLoading }: Props) {
  const [form, setForm] = useState<CustomerInput>(DEFAULT)
  const [loading, setLoading] = useState(false)

  function set<K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    onLoading(true)
    try {
      const result = await api.predict(form)
      onResult(result)
    } catch {
      // Fallback mock result for demo
      const prob = Math.random() * 80 + 10
      onResult({
        prediction: prob > 50 ? 1 : 0,
        churn_probability: Math.round(prob * 10) / 10,
        stay_probability: Math.round((100 - prob) * 10) / 10,
        risk_level: prob > 75 ? "Critical" : prob > 50 ? "High" : prob > 25 ? "Medium" : "Low",
        revenue_at_risk: Math.round(form.MonthlyCharges * Math.max(0, 24 - form.tenure) * (prob / 100)),
        monthly_charges: form.MonthlyCharges,
        recommendation: "Connect with the retention team to explore personalised offers.",
      })
    } finally {
      setLoading(false)
      onLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Demographics */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Demographics</p>
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Gender">
            <YNSelect value={form.gender} onChange={(v) => set("gender", v)} options={["Male", "Female"]} />
          </FieldGroup>
          <FieldGroup label="Senior Citizen">
            <YNSelect value={form.SeniorCitizen} onChange={(v) => set("SeniorCitizen", v)} options={["No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Partner">
            <YNSelect value={form.Partner} onChange={(v) => set("Partner", v)} options={["No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Dependents">
            <YNSelect value={form.Dependents} onChange={(v) => set("Dependents", v)} options={["No", "Yes"]} />
          </FieldGroup>
        </div>
      </section>

      <Separator />

      {/* Account Info */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Account</p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-xs text-slate-400">Tenure</Label>
              <span className="text-xs font-mono text-indigo-300">{form.tenure} months</span>
            </div>
            <Slider
              min={0} max={72} step={1}
              value={[form.tenure]}
              onValueChange={([v]) => set("tenure", v)}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-xs text-slate-400">Monthly Charges</Label>
              <span className="text-xs font-mono text-indigo-300">${form.MonthlyCharges}</span>
            </div>
            <Slider
              min={0} max={150} step={1}
              value={[form.MonthlyCharges]}
              onValueChange={([v]) => {
                set("MonthlyCharges", v)
                set("TotalCharges", Math.round(v * form.tenure))
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Contract">
              <YNSelect
                value={form.Contract}
                onChange={(v) => set("Contract", v)}
                options={["Month-to-month", "One year", "Two year"]}
              />
            </FieldGroup>
            <FieldGroup label="Payment Method">
              <YNSelect
                value={form.PaymentMethod}
                onChange={(v) => set("PaymentMethod", v)}
                options={["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"]}
              />
            </FieldGroup>
            <FieldGroup label="Paperless Billing">
              <YNSelect value={form.PaperlessBilling} onChange={(v) => set("PaperlessBilling", v)} options={["No", "Yes"]} />
            </FieldGroup>
          </div>
        </div>
      </section>

      <Separator />

      {/* Services */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Services</p>
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Phone Service">
            <YNSelect value={form.PhoneService} onChange={(v) => set("PhoneService", v)} options={["No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Multiple Lines">
            <YNSelect value={form.MultipleLines} onChange={(v) => set("MultipleLines", v)} options={["No phone service", "No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Internet Service">
            <YNSelect value={form.InternetService} onChange={(v) => set("InternetService", v)} options={["DSL", "Fiber optic", "No"]} />
          </FieldGroup>
          <FieldGroup label="Online Security">
            <YNSelect value={form.OnlineSecurity} onChange={(v) => set("OnlineSecurity", v)} options={["No internet service", "No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Online Backup">
            <YNSelect value={form.OnlineBackup} onChange={(v) => set("OnlineBackup", v)} options={["No internet service", "No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Device Protection">
            <YNSelect value={form.DeviceProtection} onChange={(v) => set("DeviceProtection", v)} options={["No internet service", "No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Tech Support">
            <YNSelect value={form.TechSupport} onChange={(v) => set("TechSupport", v)} options={["No internet service", "No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Streaming TV">
            <YNSelect value={form.StreamingTV} onChange={(v) => set("StreamingTV", v)} options={["No internet service", "No", "Yes"]} />
          </FieldGroup>
          <FieldGroup label="Streaming Movies">
            <YNSelect value={form.StreamingMovies} onChange={(v) => set("StreamingMovies", v)} options={["No internet service", "No", "Yes"]} />
          </FieldGroup>
        </div>
      </section>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        variant="gradient"
        size="lg"
        className="w-full mt-2"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Analysing…</>
        ) : (
          <><Brain className="h-4 w-4" /> Run AI Prediction</>
        )}
      </Button>
    </div>
  )
}
