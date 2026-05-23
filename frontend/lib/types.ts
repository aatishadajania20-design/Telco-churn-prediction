export interface OverviewData {
  total_customers: number
  churned_customers: number
  retained_customers: number
  churn_rate: number
  avg_monthly_revenue: number
  revenue_at_risk: number
  avg_tenure_months: number
}

export interface CustomerInput {
  gender: string
  SeniorCitizen: string
  Partner: string
  Dependents: string
  tenure: number
  PhoneService: string
  MultipleLines: string
  InternetService: string
  OnlineSecurity: string
  OnlineBackup: string
  DeviceProtection: string
  TechSupport: string
  StreamingTV: string
  StreamingMovies: string
  Contract: string
  PaperlessBilling: string
  PaymentMethod: string
  MonthlyCharges: number
  TotalCharges: number
}

export interface PredictionResult {
  prediction: number
  churn_probability: number
  stay_probability: number
  risk_level: "Low" | "Medium" | "High" | "Critical"
  revenue_at_risk: number
  monthly_charges: number
  recommendation: string
}

export interface ChurnByContract {
  Contract: string
  total: number
  churned: number
  churn_rate: number
}

export interface ChurnByTenure {
  tenure_group: string
  total: number
  churned: number
  churn_rate: number
}

export interface ChurnByService {
  InternetService: string
  total: number
  churned: number
  churn_rate: number
}

export interface ChurnByPayment {
  PaymentMethod: string
  total: number
  churned: number
  churn_rate: number
}

export interface MonthlyDistribution {
  bins: string[]
  churned: number[]
  retained: number[]
}

export interface Segment {
  segment: string
  count: number
  avg_monthly_charges: number
  avg_tenure: number
  churn_rate: number
}

export interface FeatureImportance {
  feature: string
  importance: number
}

export interface ModelPerformance {
  accuracy: number
  confusion_matrix: number[][]
  roc_curve: { fpr: number[]; tpr: number[] }
  auc: number
  precision: number
  recall: number
  f1_score: number
  support: number
}
