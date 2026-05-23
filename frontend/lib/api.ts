import type {
  OverviewData, CustomerInput, PredictionResult,
  ChurnByContract, ChurnByTenure, ChurnByService,
  ChurnByPayment, MonthlyDistribution, Segment,
  FeatureImportance, ModelPerformance,
} from "./types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json()
}

export const api = {
  health: () => get<{ status: string; total_customers: number }>("/api/health"),
  overview: () => get<OverviewData>("/api/analytics/overview"),
  churnByContract: () => get<ChurnByContract[]>("/api/analytics/churn-by-contract"),
  churnByTenure: () => get<ChurnByTenure[]>("/api/analytics/churn-by-tenure"),
  churnByService: () => get<ChurnByService[]>("/api/analytics/churn-by-service"),
  churnByPayment: () => get<ChurnByPayment[]>("/api/analytics/churn-by-payment"),
  monthlyDistribution: () => get<MonthlyDistribution>("/api/analytics/monthly-distribution"),
  segments: () => get<Segment[]>("/api/analytics/segments"),
  modelPerformance: () => get<ModelPerformance>("/api/model/performance"),
  featureImportance: () => get<FeatureImportance[]>("/api/model/feature-importance"),
  predict: async (customer: CustomerInput): Promise<PredictionResult> => {
    const res = await fetch(`${BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
    if (!res.ok) throw new Error(`Prediction failed: ${res.status}`)
    return res.json()
  },
}

// ── Mock data used when API is unreachable ─────────────────────────────────
export const MOCK: {
  overview: OverviewData
  churnByContract: ChurnByContract[]
  churnByTenure: ChurnByTenure[]
  featureImportance: FeatureImportance[]
  modelPerformance: ModelPerformance
  segments: Segment[]
} = {
  overview: {
    total_customers: 7043,
    churned_customers: 1869,
    retained_customers: 5174,
    churn_rate: 26.5,
    avg_monthly_revenue: 64.76,
    revenue_at_risk: 2862920,
    avg_tenure_months: 32.4,
  },
  churnByContract: [
    { Contract: "Month-to-month", total: 3875, churned: 1655, churn_rate: 42.7 },
    { Contract: "One year", total: 1473, churned: 166, churn_rate: 11.3 },
    { Contract: "Two year", total: 1695, churned: 48, churn_rate: 2.8 },
  ],
  churnByTenure: [
    { tenure_group: "0-6m", total: 613, churned: 279, churn_rate: 45.5 },
    { tenure_group: "7-12m", total: 589, churned: 241, churn_rate: 40.9 },
    { tenure_group: "13-24m", total: 1147, churned: 364, churn_rate: 31.7 },
    { tenure_group: "25-36m", total: 842, churned: 220, churn_rate: 26.1 },
    { tenure_group: "37-48m", total: 754, churned: 152, churn_rate: 20.2 },
    { tenure_group: "49-72m", total: 2098, churned: 613, churn_rate: 29.2 },
  ],
  featureImportance: [
    { feature: "tenure", importance: 0.142 },
    { feature: "TotalCharges", importance: 0.138 },
    { feature: "MonthlyCharges", importance: 0.121 },
    { feature: "Contract_Two year", importance: 0.089 },
    { feature: "Contract_One year", importance: 0.075 },
    { feature: "InternetService_Fiber optic", importance: 0.062 },
    { feature: "PaymentMethod_Electronic check", importance: 0.048 },
    { feature: "OnlineSecurity_Yes", importance: 0.041 },
    { feature: "TechSupport_Yes", importance: 0.038 },
    { feature: "PaperlessBilling_Yes", importance: 0.032 },
  ],
  modelPerformance: {
    accuracy: 80.37,
    confusion_matrix: [[4812, 362], [1022, 847]],
    roc_curve: { fpr: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 1], tpr: [0, 0.35, 0.55, 0.72, 0.81, 0.9, 1] },
    auc: 0.8432,
    precision: 70.1,
    recall: 45.3,
    f1_score: 55.0,
    support: 1869,
  },
  segments: [
    { segment: "Champions", count: 1243, avg_monthly_charges: 95.4, avg_tenure: 58.2, churn_rate: 3.1 },
    { segment: "At Risk High-Value", count: 432, avg_monthly_charges: 88.7, avg_tenure: 24.5, churn_rate: 78.4 },
    { segment: "Loyal", count: 2187, avg_monthly_charges: 61.2, avg_tenure: 39.8, churn_rate: 12.3 },
    { segment: "New Customers", count: 613, avg_monthly_charges: 55.8, avg_tenure: 3.2, churn_rate: 45.5 },
    { segment: "Price Sensitive", count: 568, avg_monthly_charges: 24.6, avg_tenure: 18.7, churn_rate: 28.2 },
  ],
}
