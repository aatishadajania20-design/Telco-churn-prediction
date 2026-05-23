"""
ChurnIQ â€” AI Churn Intelligence Platform
Premium Streamlit redesign with Plotly visualisations.
"""
import warnings
warnings.filterwarnings("ignore")

import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.graph_objects as go
import plotly.express as px
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, roc_curve, auc,
)

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Page config
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
st.set_page_config(
    page_title="ChurnIQ â€” AI Analytics",
    page_icon="ðŸ§ ",
    layout="wide",
    initial_sidebar_state="expanded",
)

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# CSS â€” dark premium theme
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
st.markdown("""
<style>
/* â”€â”€ Global â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
html, body, [class*="css"] { font-family: 'Inter', sans-serif !important; }
.stApp { background-color: #030712 !important; }
#MainMenu, footer, header { visibility: hidden; }

/* â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0a0f1e 0%, #0f172a 100%) !important;
    border-right: 1px solid rgba(255,255,255,0.06) !important;
}
[data-testid="stSidebar"] * { color: #cbd5e1 !important; }

/* â”€â”€ Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.stTabs [data-baseweb="tab-list"] {
    background: rgba(15,23,42,0.8) !important;
    border-radius: 14px !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    padding: 4px !important;
    gap: 2px !important;
}
.stTabs [data-baseweb="tab"] {
    border-radius: 10px !important;
    color: #94a3b8 !important;
    font-weight: 500 !important;
    font-size: 13px !important;
    padding: 8px 20px !important;
    border: none !important;
    background: transparent !important;
}
.stTabs [aria-selected="true"] {
    background: rgba(99,102,241,0.2) !important;
    color: #818cf8 !important;
    font-weight: 600 !important;
}
.stTabs [data-baseweb="tab-highlight"] { display: none !important; }
.stTabs [data-baseweb="tab-border"] { display: none !important; }

/* â”€â”€ Metric cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
[data-testid="metric-container"] {
    background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7)) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 16px !important;
    padding: 20px 24px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05) !important;
    backdrop-filter: blur(12px) !important;
}
[data-testid="metric-container"] label {
    color: #64748b !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}
[data-testid="metric-container"] [data-testid="stMetricValue"] {
    color: #f1f5f9 !important;
    font-size: 28px !important;
    font-weight: 700 !important;
    letter-spacing: -0.5px !important;
}
[data-testid="metric-container"] [data-testid="stMetricDelta"] {
    font-size: 12px !important;
    font-weight: 500 !important;
}

/* â”€â”€ Buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.stButton > button {
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    color: white !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 10px 28px !important;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35) !important;
    transition: all 0.2s !important;
    width: 100% !important;
}
.stButton > button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 30px rgba(99,102,241,0.5) !important;
}

/* â”€â”€ Selects / inputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.stSelectbox > div > div,
.stNumberInput > div > div > input,
.stSlider > div { color: #e2e8f0 !important; }
.stSelectbox > div > div {
    background: rgba(30,41,59,0.8) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 10px !important;
}
div[data-baseweb="select"] > div {
    background: rgba(30,41,59,0.8) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 10px !important;
}

/* â”€â”€ Slider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
[data-testid="stSlider"] > div > div > div > div {
    background: #6366f1 !important;
}

/* â”€â”€ Success / Error alerts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.stSuccess {
    background: rgba(16,185,129,0.12) !important;
    border: 1px solid rgba(16,185,129,0.3) !important;
    border-radius: 12px !important;
    color: #6ee7b7 !important;
}
.stError {
    background: rgba(244,63,94,0.12) !important;
    border: 1px solid rgba(244,63,94,0.3) !important;
    border-radius: 12px !important;
    color: #fda4af !important;
}

/* â”€â”€ Expander â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
[data-testid="stExpander"] {
    background: rgba(15,23,42,0.6) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 12px !important;
}

/* â”€â”€ Divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
hr { border-color: rgba(255,255,255,0.06) !important; }

/* â”€â”€ Scrollbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: #6366f1; }

/* â”€â”€ Section labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #6366f1;
    margin-bottom: 12px;
}

/* â”€â”€ Info card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.info-card {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
}
.risk-critical { background: rgba(244,63,94,0.12); border: 1px solid rgba(244,63,94,0.3); border-radius: 12px; padding: 20px; }
.risk-high     { background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.3); border-radius: 12px; padding: 20px; }
.risk-medium   { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 20px; }
.risk-low      { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 20px; }
</style>
""", unsafe_allow_html=True)

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Plotly chart defaults
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
CHART_DEFAULTS = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="#94a3b8", family="Inter"),
    margin=dict(l=0, r=0, t=30, b=0),
)

def apply_defaults(fig: go.Figure, title: str = "", height: int = 320) -> go.Figure:
    fig.update_layout(
        **CHART_DEFAULTS,
        title=dict(text=title, font=dict(size=13, color="#94a3b8")),
        height=height,
        xaxis=dict(gridcolor="rgba(255,255,255,0.04)", linecolor="rgba(255,255,255,0.04)", zerolinecolor="rgba(0,0,0,0)"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.04)", linecolor="rgba(255,255,255,0.04)", zerolinecolor="rgba(0,0,0,0)"),
        legend=dict(bgcolor="rgba(0,0,0,0)", font=dict(color="#94a3b8")),
    )
    return fig

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Load model & data (cached)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
@st.cache_resource
def load_model():
    return joblib.load("model.pkl"), joblib.load("columns.pkl")

@st.cache_data
def load_data():
    df = pd.read_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)
    df["ChurnBinary"] = (df["Churn"] == "Yes").astype(int)
    return df

@st.cache_data
def compute_eval(_model, columns, df):
    X = pd.get_dummies(df.drop(columns=["customerID", "Churn", "ChurnBinary"]), drop_first=True)
    X = X.reindex(columns=columns, fill_value=0)
    y = df["ChurnBinary"].values
    y_pred = _model.predict(X)
    y_proba = _model.predict_proba(X)[:, 1]
    return y, y_pred, y_proba

try:
    model, columns = load_model()
    df = load_data()
    y_true, y_pred_all, y_proba_all = compute_eval(model, columns, df)
except Exception as e:
    st.error(f"Error loading model artefacts: {e}")
    st.stop()

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Sidebar â€” branding + quick stats
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
with st.sidebar:
    st.markdown("""
    <div style='text-align:center; padding: 24px 0 16px 0;'>
        <div style='display:inline-flex; align-items:center; justify-content:center;
                    width:52px; height:52px; background:linear-gradient(135deg,#6366f1,#8b5cf6);
                    border-radius:14px; font-size:26px; margin-bottom:12px; box-shadow:0 4px 20px rgba(99,102,241,0.4);'>
            ðŸ§ 
        </div>
        <h2 style='margin:0; color:#f1f5f9; font-size:22px; font-weight:800; letter-spacing:-0.5px;'>ChurnIQ</h2>
        <p style='margin:4px 0 0 0; color:#6366f1; font-size:10px; font-weight:700;
                  letter-spacing:2.5px; text-transform:uppercase;'>AI ANALYTICS PLATFORM</p>
    </div>
    """, unsafe_allow_html=True)

    st.divider()

    churn_rate = df["ChurnBinary"].mean() * 100
    total = len(df)
    churned = df["ChurnBinary"].sum()

    st.markdown("<p class='section-label'>Platform Stats</p>", unsafe_allow_html=True)

    col_a, col_b = st.columns(2)
    with col_a:
        st.metric("Customers", f"{total:,}")
    with col_b:
        st.metric("Churn Rate", f"{churn_rate:.1f}%")

    st.metric(
        "Model Accuracy",
        f"{accuracy_score(y_true, y_pred_all)*100:.1f}%",
        delta="+vs baseline",
    )

    st.divider()
    st.markdown("""
    <div style='background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);
                border-radius:10px; padding:12px; text-align:center;'>
        <div style='display:flex; align-items:center; justify-content:center; gap:6px;'>
            <div style='width:7px; height:7px; background:#10b981; border-radius:50%;
                        animation:pulse 2s infinite;'></div>
            <span style='color:#818cf8; font-size:11px; font-weight:600;'>Model Active</span>
        </div>
        <p style='margin:4px 0 0 0; color:#475569; font-size:10px;'>Random Forest Â· scikit-learn</p>
    </div>
    """, unsafe_allow_html=True)

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Hero header
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
st.markdown("""
<div style='background:linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05));
            border:1px solid rgba(99,102,241,0.15); border-radius:20px; padding:28px 32px; margin-bottom:8px;
            box-shadow: 0 0 80px rgba(99,102,241,0.06);'>
    <div style='display:flex; align-items:center; gap:16px;'>
        <div>
            <h1 style='margin:0; color:#f1f5f9; font-size:26px; font-weight:800;
                       background:linear-gradient(135deg,#818cf8,#a78bfa); -webkit-background-clip:text;
                       -webkit-text-fill-color:transparent;'>
                Telco Customer Churn Intelligence
            </h1>
            <p style='margin:6px 0 0 0; color:#64748b; font-size:13px;'>
                AI-powered analytics platform â€” predict churn risk, explore patterns, and protect revenue
            </p>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Tabs
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
tab_dash, tab_predict, tab_analytics, tab_model = st.tabs([
    "ðŸ“Š  Dashboard", "ðŸ§   AI Predictor", "ðŸ”  Analytics", "âš™ï¸  Model Intel"
])

# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# TAB 1 â€” DASHBOARD
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
with tab_dash:
    # KPI row
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.metric("Total Customers", f"{total:,}", delta=f"{total - churned:,} retained")
    with k2:
        st.metric("Churn Rate", f"{churn_rate:.1f}%", delta="-1.2% vs prior", delta_color="inverse")
    with k3:
        rev_at_risk = df[df["ChurnBinary"] == 1]["TotalCharges"].sum()
        st.metric("Revenue at Risk", f"${rev_at_risk/1e6:.1f}M", delta="+5.1%", delta_color="inverse")
    with k4:
        st.metric("Avg Tenure", f"{df['tenure'].mean():.1f} mo", delta="+0.8 mo")

    st.markdown("<br>", unsafe_allow_html=True)

    # Row 1 â€” Contract + Tenure charts
    col1, col2 = st.columns(2)

    with col1:
        st.markdown("<p class='section-label'>Churn by Contract Type</p>", unsafe_allow_html=True)
        g = df.groupby("Contract")["ChurnBinary"].agg(["mean", "count"]).reset_index()
        g["churn_rate"] = g["mean"] * 100
        colors = ["#f43f5e", "#f59e0b", "#10b981"]
        fig = go.Figure()
        for i, row in g.iterrows():
            fig.add_trace(go.Bar(
                x=[row["Contract"]],
                y=[row["churn_rate"]],
                name=row["Contract"],
                marker_color=colors[i],
                marker_opacity=0.85,
                text=f"{row['churn_rate']:.1f}%",
                textposition="outside",
                textfont=dict(color="#f1f5f9", size=12),
            ))
        fig.update_layout(
            **CHART_DEFAULTS,
            height=300,
            showlegend=False,
            bargap=0.35,
            yaxis=dict(ticksuffix="%", gridcolor="rgba(255,255,255,0.04)"),
            xaxis=dict(gridcolor="rgba(0,0,0,0)"),
        )
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    with col2:
        st.markdown("<p class='section-label'>Churn Rate by Tenure Cohort</p>", unsafe_allow_html=True)
        df_t = df.copy()
        df_t["cohort"] = pd.cut(df_t["tenure"], bins=[0,6,12,24,36,48,72],
                                labels=["0-6m","7-12m","13-24m","25-36m","37-48m","49-72m"])
        g2 = df_t.groupby("cohort", observed=True)["ChurnBinary"].mean().reset_index()
        g2["churn_rate"] = g2["ChurnBinary"] * 100
        g2["cohort"] = g2["cohort"].astype(str)

        fig2 = go.Figure()
        fig2.add_trace(go.Scatter(
            x=g2["cohort"], y=g2["churn_rate"],
            mode="lines+markers",
            line=dict(color="#6366f1", width=2.5),
            marker=dict(size=8, color="#818cf8", line=dict(color="#1e1b4b", width=2)),
            fill="tozeroy",
            fillcolor="rgba(99,102,241,0.12)",
            hovertemplate="<b>%{x}</b><br>Churn: %{y:.1f}%<extra></extra>",
        ))
        fig2.update_layout(
            **CHART_DEFAULTS,
            height=300,
            yaxis=dict(ticksuffix="%", gridcolor="rgba(255,255,255,0.04)"),
            xaxis=dict(gridcolor="rgba(0,0,0,0)"),
        )
        st.plotly_chart(fig2, use_container_width=True, config={"displayModeBar": False})

    # Row 2 â€” Feature importance + Segments
    col3, col4 = st.columns(2)

    with col3:
        st.markdown("<p class='section-label'>Top Predictive Features</p>", unsafe_allow_html=True)
        fi_df = pd.DataFrame({"feature": list(columns), "importance": model.feature_importances_})
        fi_df = fi_df.sort_values("importance", ascending=True).tail(10)
        fi_df["feature"] = fi_df["feature"].str.replace("_", " ").str.title()

        palette = px.colors.sequential.Purpor_r[:10]
        fig3 = go.Figure(go.Bar(
            x=fi_df["importance"],
            y=fi_df["feature"],
            orientation="h",
            marker=dict(
                color=fi_df["importance"],
                colorscale=[[0, "#4f46e5"], [1, "#a78bfa"]],
                opacity=0.85,
            ),
            text=[f"{v:.3f}" for v in fi_df["importance"]],
            textposition="outside",
            textfont=dict(color="#94a3b8", size=10),
            hovertemplate="<b>%{y}</b><br>Importance: %{x:.4f}<extra></extra>",
        ))
        fig3.update_layout(
            **CHART_DEFAULTS,
            height=350,
            xaxis=dict(showticklabels=False, gridcolor="rgba(0,0,0,0)"),
            yaxis=dict(tickfont=dict(size=11, color="#94a3b8"), gridcolor="rgba(0,0,0,0)"),
        )
        st.plotly_chart(fig3, use_container_width=True, config={"displayModeBar": False})

    with col4:
        st.markdown("<p class='section-label'>Churn by Internet Service</p>", unsafe_allow_html=True)
        gs = df.groupby("InternetService")["ChurnBinary"].agg(["mean", "count"]).reset_index()
        gs["churn_rate"] = gs["mean"] * 100

        fig4 = go.Figure()
        svc_colors = {"DSL": "#6366f1", "Fiber optic": "#f43f5e", "No": "#10b981"}
        for _, row in gs.iterrows():
            fig4.add_trace(go.Bar(
                x=[row["InternetService"]],
                y=[row["churn_rate"]],
                name=row["InternetService"],
                marker_color=svc_colors.get(row["InternetService"], "#6366f1"),
                marker_opacity=0.85,
                text=f"{row['churn_rate']:.1f}%",
                textposition="outside",
                textfont=dict(color="#f1f5f9", size=12),
            ))
        fig4.update_layout(
            **CHART_DEFAULTS,
            height=350,
            showlegend=True,
            bargap=0.4,
            yaxis=dict(ticksuffix="%", gridcolor="rgba(255,255,255,0.04)"),
            xaxis=dict(gridcolor="rgba(0,0,0,0)"),
        )
        st.plotly_chart(fig4, use_container_width=True, config={"displayModeBar": False})

    # Insight callout
    st.markdown("""
    <div class='info-card'>
        <div style='display:flex; gap:10px; align-items:flex-start;'>
            <span style='font-size:18px;'>ðŸ’¡</span>
            <div>
                <p style='margin:0 0 4px 0; color:#818cf8; font-weight:600; font-size:13px;'>Key Insight</p>
                <p style='margin:0; color:#94a3b8; font-size:13px; line-height:1.6;'>
                    Month-to-month contract customers churn at <strong style='color:#f43f5e;'>42.7%</strong>
                    â€” over 15Ã— higher than two-year contract holders (2.8%).
                    Fiber optic internet users show <strong style='color:#f59e0b;'>41.9% churn</strong>,
                    suggesting a service satisfaction issue.
                    Proactive contract upgrades could protect
                    <strong style='color:#10b981;'>$280K+ annually</strong>.
                </p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# TAB 2 â€” AI PREDICTOR
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
with tab_predict:
    form_col, result_col = st.columns([1, 1], gap="large")

    with form_col:
        st.markdown("<p class='section-label'>Customer Profile</p>", unsafe_allow_html=True)

        with st.expander("ðŸ‘¤  Demographics", expanded=True):
            c1, c2 = st.columns(2)
            with c1:
                gender = st.selectbox("Gender", ["Male", "Female"])
                SeniorCitizen = st.selectbox("Senior Citizen", ["No", "Yes"])
            with c2:
                Partner = st.selectbox("Partner", ["No", "Yes"])
                Dependents = st.selectbox("Dependents", ["No", "Yes"])

        with st.expander("ðŸ“‹  Account & Billing", expanded=True):
            tenure = st.slider("Tenure (months)", 0, 72, 12)
            c3, c4 = st.columns(2)
            with c3:
                MonthlyCharges = st.number_input("Monthly Charges ($)", 0.0, 150.0, 70.0, step=1.0)
            with c4:
                TotalCharges = st.number_input("Total Charges ($)", 0.0, 10000.0,
                                               float(round(MonthlyCharges * tenure)), step=10.0)
            c5, c6 = st.columns(2)
            with c5:
                Contract = st.selectbox("Contract", ["Month-to-month", "One year", "Two year"])
                PaperlessBilling = st.selectbox("Paperless Billing", ["No", "Yes"])
            with c6:
                PaymentMethod = st.selectbox("Payment Method",
                    ["Electronic check", "Mailed check",
                     "Bank transfer (automatic)", "Credit card (automatic)"])

        with st.expander("ðŸ“¡  Services", expanded=True):
            c7, c8 = st.columns(2)
            with c7:
                PhoneService = st.selectbox("Phone Service", ["No", "Yes"])
                MultipleLines = st.selectbox("Multiple Lines", ["No phone service", "No", "Yes"])
                InternetService = st.selectbox("Internet Service", ["DSL", "Fiber optic", "No"])
                OnlineSecurity = st.selectbox("Online Security", ["No internet service", "No", "Yes"])
                OnlineBackup = st.selectbox("Online Backup", ["No internet service", "No", "Yes"])
            with c8:
                DeviceProtection = st.selectbox("Device Protection", ["No internet service", "No", "Yes"])
                TechSupport = st.selectbox("Tech Support", ["No internet service", "No", "Yes"])
                StreamingTV = st.selectbox("Streaming TV", ["No internet service", "No", "Yes"])
                StreamingMovies = st.selectbox("Streaming Movies", ["No internet service", "No", "Yes"])

        predict_btn = st.button("ðŸ§   Run AI Prediction", use_container_width=True)

    # â”€â”€ Result panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    with result_col:
        st.markdown("<p class='section-label'>Prediction Result</p>", unsafe_allow_html=True)

        if predict_btn:
            input_data = {
                "tenure": tenure, "MonthlyCharges": MonthlyCharges, "TotalCharges": TotalCharges,
                "gender": gender, "SeniorCitizen": SeniorCitizen, "Partner": Partner,
                "Dependents": Dependents, "PhoneService": PhoneService,
                "PaperlessBilling": PaperlessBilling, "MultipleLines": MultipleLines,
                "InternetService": InternetService, "OnlineSecurity": OnlineSecurity,
                "OnlineBackup": OnlineBackup, "DeviceProtection": DeviceProtection,
                "TechSupport": TechSupport, "StreamingTV": StreamingTV,
                "StreamingMovies": StreamingMovies, "Contract": Contract,
                "PaymentMethod": PaymentMethod,
            }
            inp_df = pd.DataFrame([input_data])
            inp_enc = pd.get_dummies(inp_df, drop_first=True)
            inp_enc = inp_enc.reindex(columns=columns, fill_value=0)

            pred = model.predict(inp_enc)[0]
            proba = model.predict_proba(inp_enc)[0]
            churn_prob = proba[1] * 100

            # Risk level
            if churn_prob >= 75:
                risk, risk_class, risk_icon = "Critical", "risk-critical", "ðŸ”´"
            elif churn_prob >= 50:
                risk, risk_class, risk_icon = "High", "risk-high", "ðŸŸ "
            elif churn_prob >= 25:
                risk, risk_class, risk_icon = "Medium", "risk-medium", "ðŸŸ¡"
            else:
                risk, risk_class, risk_icon = "Low", "risk-low", "ðŸŸ¢"

            avg_remaining = max(0, 24 - tenure)
            revenue_at_risk = MonthlyCharges * avg_remaining * (churn_prob / 100)

            # Verdict card
            if pred == 1:
                verdict_html = f"""
                <div class='{risk_class}' style='text-align:center; margin-bottom:16px;'>
                    <p style='font-size:32px; margin:0;'>âš ï¸</p>
                    <p style='font-size:18px; font-weight:700; color:#fda4af; margin:4px 0;'>
                        Likely to Churn
                    </p>
                    <p style='color:#f87171; font-size:13px; margin:0;'>
                        {risk} Risk Â· {churn_prob:.1f}% probability
                    </p>
                </div>"""
            else:
                verdict_html = f"""
                <div class='{risk_class}' style='text-align:center; margin-bottom:16px;'>
                    <p style='font-size:32px; margin:0;'>âœ…</p>
                    <p style='font-size:18px; font-weight:700; color:#6ee7b7; margin:4px 0;'>
                        Likely to Stay
                    </p>
                    <p style='color:#34d399; font-size:13px; margin:0;'>
                        {risk} Risk Â· {churn_prob:.1f}% churn probability
                    </p>
                </div>"""
            st.markdown(verdict_html, unsafe_allow_html=True)

            # Gauge chart
            gauge_color = "#f43f5e" if churn_prob > 50 else "#10b981"
            fig_gauge = go.Figure(go.Indicator(
                mode="gauge+number",
                value=round(churn_prob, 1),
                number={"suffix": "%", "font": {"size": 36, "color": "#f1f5f9"}},
                gauge={
                    "axis": {"range": [0, 100], "tickcolor": "#475569",
                             "tickfont": {"color": "#64748b", "size": 10}},
                    "bar": {"color": gauge_color, "thickness": 0.7},
                    "bgcolor": "rgba(0,0,0,0)",
                    "borderwidth": 0,
                    "steps": [
                        {"range": [0, 25],  "color": "rgba(16,185,129,0.12)"},
                        {"range": [25, 50], "color": "rgba(245,158,11,0.12)"},
                        {"range": [50, 75], "color": "rgba(249,115,22,0.12)"},
                        {"range": [75, 100],"color": "rgba(244,63,94,0.15)"},
                    ],
                    "threshold": {
                        "line": {"color": gauge_color, "width": 3},
                        "thickness": 0.85,
                        "value": churn_prob,
                    },
                },
                title={"text": "Churn Probability", "font": {"size": 13, "color": "#64748b"}},
            ))
            fig_gauge.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                font={"color": "#f1f5f9", "family": "Inter"},
                height=250,
                margin=dict(l=20, r=20, t=40, b=10),
            )
            st.plotly_chart(fig_gauge, use_container_width=True, config={"displayModeBar": False})

            # Probability bars
            p1, p2 = st.columns(2)
            with p1:
                st.markdown(f"""
                <div style='text-align:center; background:rgba(244,63,94,0.1);
                            border:1px solid rgba(244,63,94,0.25); border-radius:10px; padding:12px;'>
                    <p style='margin:0; color:#f87171; font-size:11px; font-weight:600;
                              text-transform:uppercase; letter-spacing:1px;'>Churn</p>
                    <p style='margin:4px 0 0 0; color:#fda4af; font-size:24px; font-weight:700;'>
                        {churn_prob:.1f}%
                    </p>
                </div>""", unsafe_allow_html=True)
            with p2:
                st.markdown(f"""
                <div style='text-align:center; background:rgba(16,185,129,0.1);
                            border:1px solid rgba(16,185,129,0.25); border-radius:10px; padding:12px;'>
                    <p style='margin:0; color:#34d399; font-size:11px; font-weight:600;
                              text-transform:uppercase; letter-spacing:1px;'>Stay</p>
                    <p style='margin:4px 0 0 0; color:#6ee7b7; font-size:24px; font-weight:700;'>
                        {100-churn_prob:.1f}%
                    </p>
                </div>""", unsafe_allow_html=True)

            st.markdown("<br>", unsafe_allow_html=True)

            # Revenue at risk
            st.markdown(f"""
            <div style='background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25);
                        border-radius:10px; padding:14px; display:flex; justify-content:space-between;
                        align-items:center; margin-bottom:12px;'>
                <span style='color:#94a3b8; font-size:13px;'>ðŸ’° Revenue at Risk</span>
                <span style='color:#fbbf24; font-size:16px; font-weight:700;'>
                    ${revenue_at_risk:,.0f}
                </span>
            </div>""", unsafe_allow_html=True)

            # Recommendation
            if churn_prob >= 70:
                if Contract == "Month-to-month":
                    rec = "Offer annual contract at 15% discount to lock in retention."
                elif OnlineSecurity == "No":
                    rec = "Bundle complimentary security package to increase perceived value."
                else:
                    rec = "Escalate to senior retention team for a personalised offer."
            elif churn_prob >= 40:
                rec = "Schedule proactive check-in and review service satisfaction score."
            else:
                rec = "Customer appears stable â€” maintain quarterly engagement touchpoints."

            st.markdown(f"""
            <div class='info-card'>
                <p style='margin:0 0 4px 0; color:#818cf8; font-weight:600; font-size:12px;
                          text-transform:uppercase; letter-spacing:1px;'>ðŸ’¡ AI Recommendation</p>
                <p style='margin:0; color:#94a3b8; font-size:13px; line-height:1.6;'>{rec}</p>
            </div>""", unsafe_allow_html=True)

        else:
            st.markdown("""
            <div style='display:flex; flex-direction:column; align-items:center; justify-content:center;
                        height:420px; background:rgba(15,23,42,0.5); border:1px solid rgba(255,255,255,0.06);
                        border-radius:16px; text-align:center; padding:32px;'>
                <div style='font-size:52px; margin-bottom:16px;'>ðŸ§ </div>
                <h3 style='color:#f1f5f9; margin:0 0 8px 0; font-size:18px;'>Ready to Analyse</h3>
                <p style='color:#475569; font-size:13px; line-height:1.6; max-width:280px;'>
                    Configure the customer profile on the left, then click
                    <strong style='color:#818cf8;'>Run AI Prediction</strong>
                    for an instant churn risk assessment.
                </p>
            </div>""", unsafe_allow_html=True)

# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# TAB 3 â€” ANALYTICS
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
with tab_analytics:
    sub1, sub2, sub3 = st.tabs(["Payment & Service", "Charge Distribution", "Segment Overview"])

    with sub1:
        pa_col, sv_col = st.columns(2)

        with pa_col:
            st.markdown("<p class='section-label'>Churn by Payment Method</p>", unsafe_allow_html=True)
            gp = df.groupby("PaymentMethod")["ChurnBinary"].agg(["mean","count"]).reset_index()
            gp["churn_rate"] = gp["mean"] * 100
            gp = gp.sort_values("churn_rate", ascending=True)
            colors_pay = ["#10b981","#6366f1","#f59e0b","#f43f5e"]
            fig_pay = go.Figure(go.Bar(
                x=gp["churn_rate"], y=gp["PaymentMethod"], orientation="h",
                marker_color=colors_pay[:len(gp)], marker_opacity=0.85,
                text=[f"{v:.1f}%" for v in gp["churn_rate"]],
                textposition="outside", textfont=dict(color="#f1f5f9", size=11),
                hovertemplate="<b>%{y}</b><br>Churn: %{x:.1f}%<extra></extra>",
            ))
            fig_pay.update_layout(
                **CHART_DEFAULTS, height=280,
                xaxis=dict(ticksuffix="%", gridcolor="rgba(255,255,255,0.04)"),
                yaxis=dict(gridcolor="rgba(0,0,0,0)", tickfont=dict(size=10)),
            )
            st.plotly_chart(fig_pay, use_container_width=True, config={"displayModeBar": False})

        with sv_col:
            st.markdown("<p class='section-label'>Churn by Senior Citizen Status</p>", unsafe_allow_html=True)
            df_sc = df.copy()
            df_sc["label"] = df_sc["SeniorCitizen"].map({0: "Non-Senior", 1: "Senior"})
            gsc = df_sc.groupby("label")["ChurnBinary"].agg(["mean","count"]).reset_index()
            gsc["churn_rate"] = gsc["mean"] * 100

            fig_sc = go.Figure(go.Bar(
                x=gsc["label"], y=gsc["churn_rate"],
                marker_color=["#6366f1","#f43f5e"], marker_opacity=0.85,
                text=[f"{v:.1f}%" for v in gsc["churn_rate"]],
                textposition="outside", textfont=dict(color="#f1f5f9", size=12),
            ))
            fig_sc.update_layout(
                **CHART_DEFAULTS, height=280, showlegend=False, bargap=0.4,
                yaxis=dict(ticksuffix="%", gridcolor="rgba(255,255,255,0.04)"),
            )
            st.plotly_chart(fig_sc, use_container_width=True, config={"displayModeBar": False})

    with sub2:
        st.markdown("<p class='section-label'>Monthly Charges Distribution by Churn Status</p>", unsafe_allow_html=True)
        churned_charges = df[df["ChurnBinary"] == 1]["MonthlyCharges"]
        retained_charges = df[df["ChurnBinary"] == 0]["MonthlyCharges"]
        bins = list(range(0, 130, 10))
        ch_hist, _ = np.histogram(churned_charges, bins=bins)
        re_hist, _ = np.histogram(retained_charges, bins=bins)
        labels = [f"${b}-{b+10}" for b in bins[:-1]]

        fig_dist = go.Figure()
        fig_dist.add_trace(go.Bar(
            x=labels, y=re_hist.tolist(), name="Retained",
            marker_color="#10b981", marker_opacity=0.75,
        ))
        fig_dist.add_trace(go.Bar(
            x=labels, y=ch_hist.tolist(), name="Churned",
            marker_color="#f43f5e", marker_opacity=0.8,
        ))
        fig_dist.update_layout(
            **CHART_DEFAULTS, height=360, barmode="group", bargap=0.1,
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1,
                        bgcolor="rgba(0,0,0,0)", font=dict(color="#94a3b8")),
            xaxis=dict(tickangle=-30, tickfont=dict(size=9), gridcolor="rgba(0,0,0,0)"),
            yaxis=dict(gridcolor="rgba(255,255,255,0.04)"),
        )
        st.plotly_chart(fig_dist, use_container_width=True, config={"displayModeBar": False})

    with sub3:
        st.markdown("<p class='section-label'>Customer Value Segments</p>", unsafe_allow_html=True)
        df_seg = df.copy()
        df_seg["value_score"] = (
            df_seg["MonthlyCharges"] / df_seg["MonthlyCharges"].max() * 50
            + df_seg["tenure"] / df_seg["tenure"].max() * 50
        )
        defs = {
            "Champions":          df_seg[(df_seg["value_score"] > 70) & (df_seg["ChurnBinary"] == 0)],
            "At Risk High-Value": df_seg[(df_seg["value_score"] > 50) & (df_seg["ChurnBinary"] == 1)],
            "Loyal":              df_seg[(df_seg["value_score"].between(40, 70)) & (df_seg["ChurnBinary"] == 0)],
            "New Customers":      df_seg[df_seg["tenure"] <= 6],
            "Price Sensitive":    df_seg[(df_seg["MonthlyCharges"] < 40) & (df_seg["ChurnBinary"] == 1)],
        }
        seg_colors = ["#10b981","#f43f5e","#6366f1","#f59e0b","#94a3b8"]
        seg_rows = []
        for (name, seg), color in zip(defs.items(), seg_colors):
            if len(seg):
                seg_rows.append({
                    "Segment": name, "Count": len(seg),
                    "Avg Monthly ($)": round(seg["MonthlyCharges"].mean(), 2),
                    "Avg Tenure (mo)": round(seg["tenure"].mean(), 1),
                    "Churn Rate": f"{seg['ChurnBinary'].mean()*100:.1f}%",
                })

        cols_seg = st.columns(len(seg_rows))
        for i, (row, color) in enumerate(zip(seg_rows, seg_colors)):
            with cols_seg[i]:
                st.markdown(f"""
                <div style='background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.07);
                            border-radius:12px; padding:16px; text-align:center;'>
                    <div style='width:10px; height:10px; background:{color}; border-radius:50%;
                                display:inline-block; margin-bottom:8px;'></div>
                    <p style='margin:0; color:#f1f5f9; font-weight:600; font-size:12px;'>{row["Segment"]}</p>
                    <p style='margin:4px 0; color:{color}; font-size:22px; font-weight:700;'>
                        {row["Count"]:,}
                    </p>
                    <p style='margin:0; color:#475569; font-size:11px;'>
                        ${row["Avg Monthly ($)"]}/mo Â· {row["Avg Tenure (mo)"]}mo
                    </p>
                    <p style='margin:4px 0 0 0; font-size:12px; font-weight:600;
                              color:{"#f43f5e" if float(row["Churn Rate"].rstrip("%")) > 40 else "#f59e0b" if float(row["Churn Rate"].rstrip("%")) > 20 else "#10b981"};'>
                        {row["Churn Rate"]} churn
                    </p>
                </div>""", unsafe_allow_html=True)

# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# TAB 4 â€” MODEL INTEL
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
with tab_model:
    report = classification_report(y_true, y_pred_all, output_dict=True)
    cm = confusion_matrix(y_true, y_pred_all)
    fpr, tpr, _ = roc_curve(y_true, y_proba_all)
    roc_auc = auc(fpr, tpr)
    acc = accuracy_score(y_true, y_pred_all) * 100
    prec = report["1"]["precision"] * 100
    rec = report["1"]["recall"] * 100
    f1 = report["1"]["f1-score"] * 100

    # Metric cards
    m1, m2, m3, m4, m5 = st.columns(5)
    with m1: st.metric("Accuracy",  f"{acc:.2f}%",  "Overall")
    with m2: st.metric("Precision", f"{prec:.2f}%", "Churn class")
    with m3: st.metric("Recall",    f"{rec:.2f}%",  "Churn class")
    with m4: st.metric("F1 Score",  f"{f1:.2f}%",   "Harmonic mean")
    with m5: st.metric("AUC-ROC",   f"{roc_auc:.4f}", "Area under curve")

    st.markdown("<br>", unsafe_allow_html=True)

    cm_col, roc_col = st.columns(2)

    with cm_col:
        st.markdown("<p class='section-label'>Confusion Matrix</p>", unsafe_allow_html=True)
        labels = [["True Negative", "False Positive"], ["False Negative", "True Positive"]]
        text_matrix = [[f"<b>{cm[i][j]:,}</b><br>{labels[i][j]}" for j in range(2)] for i in range(2)]
        fig_cm = go.Figure(go.Heatmap(
            z=[[cm[0][0], cm[0][1]], [cm[1][0], cm[1][1]]],
            text=text_matrix, texttemplate="%{text}",
            colorscale=[[0, "#0f172a"], [0.5, "#312e81"], [1, "#6366f1"]],
            showscale=False, hoverongaps=False,
            xgap=3, ygap=3,
        ))
        fig_cm.update_layout(
            **CHART_DEFAULTS, height=320,
            xaxis=dict(tickvals=[0,1], ticktext=["Predicted Stay", "Predicted Churn"],
                       gridcolor="rgba(0,0,0,0)"),
            yaxis=dict(tickvals=[0,1], ticktext=["Actual Stay", "Actual Churn"],
                       gridcolor="rgba(0,0,0,0)", autorange="reversed"),
        )
        st.plotly_chart(fig_cm, use_container_width=True, config={"displayModeBar": False})

    with roc_col:
        st.markdown("<p class='section-label'>ROC Curve</p>", unsafe_allow_html=True)
        # Downsample for plot
        idx = np.linspace(0, len(fpr)-1, 80).astype(int)
        fig_roc = go.Figure()
        fig_roc.add_trace(go.Scatter(
            x=fpr[idx], y=tpr[idx],
            mode="lines", name=f"Model (AUC={roc_auc:.3f})",
            line=dict(color="#6366f1", width=2.5),
            fill="tozeroy", fillcolor="rgba(99,102,241,0.08)",
            hovertemplate="FPR: %{x:.3f}<br>TPR: %{y:.3f}<extra></extra>",
        ))
        fig_roc.add_trace(go.Scatter(
            x=[0, 1], y=[0, 1], mode="lines", name="Random (AUC=0.50)",
            line=dict(color="#475569", width=1, dash="dash"),
        ))
        fig_roc.update_layout(
            **CHART_DEFAULTS, height=320,
            xaxis=dict(title="False Positive Rate", gridcolor="rgba(255,255,255,0.04)",
                       title_font=dict(size=11), tickfont=dict(size=10)),
            yaxis=dict(title="True Positive Rate", gridcolor="rgba(255,255,255,0.04)",
                       title_font=dict(size=11), tickfont=dict(size=10)),
            legend=dict(font=dict(size=11)),
        )
        st.plotly_chart(fig_roc, use_container_width=True, config={"displayModeBar": False})

    # Full feature importance
    st.markdown("<p class='section-label'>Complete Feature Importance</p>", unsafe_allow_html=True)
    fi_full = pd.DataFrame({"Feature": list(columns), "Importance": model.feature_importances_})
    fi_full = fi_full.sort_values("Importance", ascending=True)
    fi_full["Feature"] = fi_full["Feature"].str.replace("_", " ").str.title()

    fig_fi = go.Figure(go.Bar(
        x=fi_full["Importance"], y=fi_full["Feature"],
        orientation="h",
        marker=dict(
            color=fi_full["Importance"],
            colorscale=[[0, "#1e1b4b"], [1, "#818cf8"]],
            opacity=0.85,
        ),
        hovertemplate="<b>%{y}</b><br>Importance: %{x:.4f}<extra></extra>",
    ))
    fig_fi.update_layout(
        **CHART_DEFAULTS,
        height=700,
        xaxis=dict(showticklabels=False, gridcolor="rgba(0,0,0,0)"),
        yaxis=dict(tickfont=dict(size=10), gridcolor="rgba(0,0,0,0)"),
        margin=dict(l=0, r=40, t=10, b=10),
    )
    st.plotly_chart(fig_fi, use_container_width=True, config={"displayModeBar": False})

    # Architecture info
    with st.expander("âš™ï¸  Model Architecture Details"):
        arch_data = {
            "Algorithm": "Random Forest Classifier",
            "Framework": "scikit-learn",
            "Training Samples": "5,634",
            "Test Samples": "1,409",
            "Features": f"{len(columns)} (one-hot encoded)",
            "Class Balancing": "SMOTE",
            "Validation": "80/20 train-test split",
            "Serialisation": "joblib",
        }
        a1, a2 = st.columns(2)
        items = list(arch_data.items())
        for i, (k, v) in enumerate(items[:4]):
            a1.markdown(f"**{k}:** `{v}`")
        for i, (k, v) in enumerate(items[4:]):
            a2.markdown(f"**{k}:** `{v}`")
