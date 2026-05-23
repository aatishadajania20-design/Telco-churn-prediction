"""
Telco Churn Intelligence — FastAPI Backend
Wraps the existing RandomForest model and exposes REST endpoints.
Run with: uvicorn api:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    roc_curve, auc
)
from typing import List, Dict, Any

app = FastAPI(title="Telco Churn Intelligence API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Load model artifacts once at startup
# ---------------------------------------------------------------------------
model = joblib.load("model.pkl")
columns = joblib.load("columns.pkl")

df_raw = pd.read_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")
df_raw["TotalCharges"] = pd.to_numeric(df_raw["TotalCharges"], errors="coerce").fillna(0)
df_raw["ChurnBinary"] = (df_raw["Churn"] == "Yes").astype(int)

# Pre-build encoded eval dataset
_eval = pd.get_dummies(df_raw.drop(columns=["customerID", "Churn", "ChurnBinary"]), drop_first=True)
_eval = _eval.reindex(columns=columns, fill_value=0)
_y_true = df_raw["ChurnBinary"].values
_y_pred = model.predict(_eval)
_y_proba = model.predict_proba(_eval)[:, 1]


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------
class CustomerInput(BaseModel):
    gender: str = "Male"
    SeniorCitizen: str = "No"
    Partner: str = "Yes"
    Dependents: str = "No"
    tenure: int = 12
    PhoneService: str = "Yes"
    MultipleLines: str = "No"
    InternetService: str = "Fiber optic"
    OnlineSecurity: str = "No"
    OnlineBackup: str = "No"
    DeviceProtection: str = "No"
    TechSupport: str = "No"
    StreamingTV: str = "No"
    StreamingMovies: str = "No"
    Contract: str = "Month-to-month"
    PaperlessBilling: str = "Yes"
    PaymentMethod: str = "Electronic check"
    MonthlyCharges: float = 70.0
    TotalCharges: float = 840.0


def _encode(customer: CustomerInput) -> pd.DataFrame:
    row = customer.model_dump()
    df = pd.DataFrame([row])
    df_encoded = pd.get_dummies(df, drop_first=True)
    df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
    return df_encoded


def _risk_level(p: float) -> str:
    if p >= 0.75:
        return "Critical"
    if p >= 0.50:
        return "High"
    if p >= 0.25:
        return "Medium"
    return "Low"


def _recommendation(c: CustomerInput, p: float) -> str:
    if p >= 0.70:
        if c.Contract == "Month-to-month":
            return "Offer annual contract at 15% discount to lock in retention."
        if c.OnlineSecurity == "No":
            return "Bundle complimentary security package to increase perceived value."
        return "Escalate to senior retention team for personalised offer."
    if p >= 0.40:
        return "Schedule proactive check-in; review service satisfaction score."
    return "Customer appears stable — maintain quarterly engagement touchpoints."


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {
        "status": "operational",
        "model": "RandomForest Classifier",
        "version": "2.0.0",
        "total_customers": int(len(df_raw)),
    }


@app.post("/api/predict")
def predict(customer: CustomerInput):
    try:
        encoded = _encode(customer)
        pred = int(model.predict(encoded)[0])
        proba = model.predict_proba(encoded)[0]
        churn_prob = float(proba[1])
        avg_remaining = max(0, 24 - customer.tenure)
        revenue_at_risk = customer.MonthlyCharges * avg_remaining * churn_prob
        return {
            "prediction": pred,
            "churn_probability": round(churn_prob * 100, 1),
            "stay_probability": round((1 - churn_prob) * 100, 1),
            "risk_level": _risk_level(churn_prob),
            "revenue_at_risk": round(revenue_at_risk, 2),
            "monthly_charges": customer.MonthlyCharges,
            "recommendation": _recommendation(customer, churn_prob),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/analytics/overview")
def overview():
    total = len(df_raw)
    churned = int(df_raw["ChurnBinary"].sum())
    return {
        "total_customers": total,
        "churned_customers": churned,
        "retained_customers": total - churned,
        "churn_rate": round(churned / total * 100, 1),
        "avg_monthly_revenue": round(float(df_raw["MonthlyCharges"].mean()), 2),
        "revenue_at_risk": round(float(df_raw[df_raw["Churn"] == "Yes"]["TotalCharges"].sum()), 2),
        "avg_tenure_months": round(float(df_raw["tenure"].mean()), 1),
    }


@app.get("/api/analytics/churn-by-contract")
def churn_by_contract():
    g = df_raw.groupby("Contract").agg(
        total=("ChurnBinary", "count"), churned=("ChurnBinary", "sum")
    ).reset_index()
    g["churn_rate"] = (g["churned"] / g["total"] * 100).round(1)
    return g.to_dict("records")


@app.get("/api/analytics/churn-by-tenure")
def churn_by_tenure():
    d = df_raw.copy()
    d["tenure_group"] = pd.cut(
        d["tenure"],
        bins=[0, 6, 12, 24, 36, 48, 72],
        labels=["0-6m", "7-12m", "13-24m", "25-36m", "37-48m", "49-72m"],
    )
    g = d.groupby("tenure_group", observed=True).agg(
        total=("ChurnBinary", "count"), churned=("ChurnBinary", "sum")
    ).reset_index()
    g["churn_rate"] = (g["churned"] / g["total"] * 100).round(1)
    g["tenure_group"] = g["tenure_group"].astype(str)
    return g.to_dict("records")


@app.get("/api/analytics/churn-by-service")
def churn_by_service():
    g = df_raw.groupby("InternetService").agg(
        total=("ChurnBinary", "count"), churned=("ChurnBinary", "sum")
    ).reset_index()
    g["churn_rate"] = (g["churned"] / g["total"] * 100).round(1)
    return g.to_dict("records")


@app.get("/api/analytics/churn-by-payment")
def churn_by_payment():
    g = df_raw.groupby("PaymentMethod").agg(
        total=("ChurnBinary", "count"), churned=("ChurnBinary", "sum")
    ).reset_index()
    g["churn_rate"] = (g["churned"] / g["total"] * 100).round(1)
    return g.to_dict("records")


@app.get("/api/analytics/monthly-distribution")
def monthly_distribution():
    bins = list(range(0, 130, 10))
    ch, _ = np.histogram(df_raw[df_raw["Churn"] == "Yes"]["MonthlyCharges"], bins=bins)
    re, _ = np.histogram(df_raw[df_raw["Churn"] == "No"]["MonthlyCharges"], bins=bins)
    return {
        "bins": [f"${b}-{b+10}" for b in bins[:-1]],
        "churned": ch.tolist(),
        "retained": re.tolist(),
    }


@app.get("/api/analytics/segments")
def segments():
    d = df_raw.copy()
    d["value_score"] = (
        d["MonthlyCharges"] / d["MonthlyCharges"].max() * 50
        + d["tenure"] / d["tenure"].max() * 50
    )
    defs = {
        "Champions": d[(d["value_score"] > 70) & (d["ChurnBinary"] == 0)],
        "At Risk High-Value": d[(d["value_score"] > 50) & (d["ChurnBinary"] == 1)],
        "Loyal": d[(d["value_score"].between(40, 70)) & (d["ChurnBinary"] == 0)],
        "New Customers": d[d["tenure"] <= 6],
        "Price Sensitive": d[(d["MonthlyCharges"] < 40) & (d["ChurnBinary"] == 1)],
    }
    result = []
    for name, seg in defs.items():
        if len(seg) == 0:
            continue
        result.append({
            "segment": name,
            "count": len(seg),
            "avg_monthly_charges": round(float(seg["MonthlyCharges"].mean()), 2),
            "avg_tenure": round(float(seg["tenure"].mean()), 1),
            "churn_rate": round(float(seg["ChurnBinary"].mean() * 100), 1),
        })
    return result


@app.get("/api/model/performance")
def model_performance():
    cm = confusion_matrix(_y_true, _y_pred).tolist()
    fpr, tpr, _ = roc_curve(_y_true, _y_proba)
    roc_auc = auc(fpr, tpr)
    idx = np.linspace(0, len(fpr) - 1, min(60, len(fpr))).astype(int)
    report = classification_report(_y_true, _y_pred, output_dict=True)
    return {
        "accuracy": round(float(accuracy_score(_y_true, _y_pred)) * 100, 2),
        "confusion_matrix": cm,
        "roc_curve": {"fpr": fpr[idx].tolist(), "tpr": tpr[idx].tolist()},
        "auc": round(float(roc_auc), 4),
        "precision": round(float(report["1"]["precision"]) * 100, 2),
        "recall": round(float(report["1"]["recall"]) * 100, 2),
        "f1_score": round(float(report["1"]["f1-score"]) * 100, 2),
        "support": int(report["1"]["support"]),
    }


@app.get("/api/model/feature-importance")
def feature_importance():
    df_fi = pd.DataFrame(
        {"feature": list(columns), "importance": model.feature_importances_}
    ).sort_values("importance", ascending=False).head(15)
    return df_fi.to_dict("records")
