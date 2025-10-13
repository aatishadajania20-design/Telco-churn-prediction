# app.py
import streamlit as st
import pandas as pd
import numpy as np
import joblib
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

st.set_page_config(page_title="📊 Telco Customer Churn Prediction", layout="wide")

st.title("📞 Telco Customer Churn Prediction")
st.markdown("Use the sidebar to input customer details and click **Predict Churn** to see the result.")

# -------------------------
# 1️⃣ Load model & columns
# -------------------------
try:
    model = joblib.load("model.pkl")
    columns = joblib.load("columns.pkl")
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

# -------------------------
# 2️⃣ Load dataset for evaluation
# -------------------------
@st.cache_data
def load_data():
    df = pd.read_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")
    df = df.drop(columns=["customerID"])
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)
    return df

data = load_data()
y_true = data["Churn"].map({"Yes": 1, "No": 0})
X_eval = pd.get_dummies(data.drop(columns=["Churn"]), drop_first=True)
X_eval = X_eval.reindex(columns=columns, fill_value=0)

y_pred_eval = model.predict(X_eval)
accuracy = accuracy_score(y_true, y_pred_eval)
report_dict = classification_report(y_true, y_pred_eval, output_dict=True)
cm = confusion_matrix(y_true, y_pred_eval)

# -------------------------
# 3️⃣ Sidebar Inputs
# -------------------------
st.sidebar.header("Customer Information")

def user_input():
    # Numeric
    tenure = st.sidebar.slider("Tenure (Months)", 0, 72, 12)
    MonthlyCharges = st.sidebar.number_input("Monthly Charges ($)", 0.0, 500.0, 70.0)
    TotalCharges = st.sidebar.number_input("Total Charges ($)", 0.0, 20000.0, 2000.0)

    # YES/NO toggles
    yes_no = ["No", "Yes"]
    gender = st.sidebar.selectbox("Gender", ["Male", "Female"])
    SeniorCitizen = st.sidebar.selectbox("Senior Citizen?", yes_no)
    Partner = st.sidebar.selectbox("Partner?", yes_no)
    Dependents = st.sidebar.selectbox("Dependents?", yes_no)
    PhoneService = st.sidebar.selectbox("Phone Service?", yes_no)
    PaperlessBilling = st.sidebar.selectbox("Paperless Billing?", yes_no)

    # Categorical
    MultipleLines = st.sidebar.selectbox("Multiple Lines", ["No phone service", "No", "Yes"])
    InternetService = st.sidebar.selectbox("Internet Service", ["DSL", "Fiber optic", "No"])
    OnlineSecurity = st.sidebar.selectbox("Online Security", ["No internet service", "No", "Yes"])
    OnlineBackup = st.sidebar.selectbox("Online Backup", ["No internet service", "No", "Yes"])
    DeviceProtection = st.sidebar.selectbox("Device Protection", ["No internet service", "No", "Yes"])
    TechSupport = st.sidebar.selectbox("Tech Support", ["No internet service", "No", "Yes"])
    StreamingTV = st.sidebar.selectbox("Streaming TV", ["No internet service", "No", "Yes"])
    StreamingMovies = st.sidebar.selectbox("Streaming Movies", ["No internet service", "No", "Yes"])
    Contract = st.sidebar.selectbox("Contract", ["Month-to-month", "One year", "Two year"])
    PaymentMethod = st.sidebar.selectbox("Payment Method", ["Electronic check", "Mailed check", 
                                                            "Bank transfer (automatic)", 
                                                            "Credit card (automatic)"])

    data = {
        "tenure": tenure,
        "MonthlyCharges": MonthlyCharges,
        "TotalCharges": TotalCharges,
        "gender": gender,
        "SeniorCitizen": SeniorCitizen,
        "Partner": Partner,
        "Dependents": Dependents,
        "PhoneService": PhoneService,
        "PaperlessBilling": PaperlessBilling,
        "MultipleLines": MultipleLines,
        "InternetService": InternetService,
        "OnlineSecurity": OnlineSecurity,
        "OnlineBackup": OnlineBackup,
        "DeviceProtection": DeviceProtection,
        "TechSupport": TechSupport,
        "StreamingTV": StreamingTV,
        "StreamingMovies": StreamingMovies,
        "Contract": Contract,
        "PaymentMethod": PaymentMethod
    }
    return pd.DataFrame([data])

input_df = user_input()

# Encode user input to match training
input_encoded = pd.get_dummies(input_df, drop_first=True)
input_encoded = input_encoded.reindex(columns=columns, fill_value=0)

# -------------------------
# 4️⃣ Predict Button (top)
# -------------------------
if st.button("🔮 Predict Churn"):
    pred = model.predict(input_encoded)[0]
    prob = model.predict_proba(input_encoded)[0][1]

    if pred == 1:
        st.error(f"⚠️ The customer is likely to **CHURN** (Probability: {prob*100:.2f}%)")
    else:
        st.success(f"✅ The customer is likely to **STAY** (Probability of churn: {prob*100:.2f}%)")

    # Optional: show input table in expandable
    with st.expander("📋 View Input Data"):
        st.dataframe(input_df)

# -------------------------
# 5️⃣ Collapsible Model Evaluation
# -------------------------
with st.expander("📊 Model Evaluation (Accuracy, Confusion Matrix, Precision/Recall)"):
    st.write(f"**Accuracy:** {accuracy*100:.2f}%")

    st.write("**Precision, Recall, F1-Score:**")
    eval_df = pd.DataFrame(report_dict).transpose()[["precision", "recall", "f1-score"]]
    st.dataframe(eval_df.style.format("{:.2f}"))

    st.write("**Confusion Matrix:**")
    fig, ax = plt.subplots(figsize=(5,4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=ax)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    st.pyplot(fig)
