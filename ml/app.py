from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import shap
from pathlib import Path

app = Flask(__name__)
CORS(app)

# =========================================
# LOAD MODELS
# =========================================

BASE_DIR = Path(__file__).resolve().parent

print("===================================")
print("LOADING ML MODELS...")
print("===================================")

rba_model = joblib.load(
    BASE_DIR / "models/rba_model.pkl"
)

creditcard_model = joblib.load(
    BASE_DIR / "models/creditcard_model.pkl"
)

ieee_model = joblib.load(
    BASE_DIR / "models/ieee_model.pkl"
)

print("INITIALIZING SHAP EXPLAINERS...")
# Use TreeExplainer for RandomForest models
rba_explainer = shap.TreeExplainer(rba_model)
creditcard_explainer = shap.TreeExplainer(creditcard_model)
ieee_explainer = shap.TreeExplainer(ieee_model)

print("ALL MODELS AND EXPLAINERS LOADED SUCCESSFULLY")

# =========================================
# FEATURE LISTS
# =========================================

RBA_FEATURES = [
    "ASN",
    "LoginSuccessful",
    "RoundTripTime"
]

CREDITCARD_FEATURES = [
    "Time",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
    "V18",
    "V19",
    "V20",
    "V21",
    "V22",
    "V23",
    "V24",
    "V25",
    "V26",
    "V27",
    "V28",
    "Amount"
]

IEEE_FEATURES = [
    "TransactionAmt",
    "card1",
    "card2",
    "addr1",
    "dist1",
    "DeviceType"
]

# =========================================
# HEALTH CHECK
# =========================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "online",
        "service": "DID Multi-Fraud Intelligence API"
    })

# =========================================
# RBA PREDICTION API
# =========================================

@app.route("/api/predict/rba", methods=["POST"])
def predict_rba():

    try:
        data = request.get_json(silent=True) or {}

        missing = [
            feature for feature in RBA_FEATURES
            if feature not in data
        ]

        if missing:
            return jsonify({
                "error": "Missing required feature(s)",
                "missing": missing
            }), 400

        features = pd.DataFrame(
            [[float(data[feature]) for feature in RBA_FEATURES]],
            columns=RBA_FEATURES
        )

        prediction = rba_model.predict(features)[0]

        risk_score = rba_model.predict_proba(features)[0][1]

        result = (
            "Suspicious Login"
            if prediction == 1
            else "Legitimate Login"
        )

        shap_vals = rba_explainer.shap_values(features)
        shap_class1 = shap_vals[1][0] if isinstance(shap_vals, list) else shap_vals[0]
        feature_importance = [
            {"feature": f, "value": float(v)}
            for f, v in zip(RBA_FEATURES, shap_class1)
        ]

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "risk_score": float(risk_score),
            "shap_values": feature_importance
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================================
# CREDIT CARD FRAUD API
# =========================================

@app.route("/api/predict/creditcard", methods=["POST"])
def predict_creditcard():

    try:
        data = request.get_json(silent=True) or {}

        missing = [
            feature for feature in CREDITCARD_FEATURES
            if feature not in data
        ]

        if missing:
            return jsonify({
                "error": "Missing required feature(s)",
                "missing": missing
            }), 400

        features = pd.DataFrame(
            [[float(data[feature]) for feature in CREDITCARD_FEATURES]],
            columns=CREDITCARD_FEATURES
        )

        prediction = creditcard_model.predict(features)[0]

        risk_score = creditcard_model.predict_proba(features)[0][1]

        result = (
            "Fraudulent Transaction"
            if prediction == 1
            else "Legitimate Transaction"
        )

        shap_vals = creditcard_explainer.shap_values(features)
        shap_class1 = shap_vals[1][0] if isinstance(shap_vals, list) else shap_vals[0]
        feature_importance = [
            {"feature": f, "value": float(v)}
            for f, v in zip(CREDITCARD_FEATURES, shap_class1)
        ]

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "risk_score": float(risk_score),
            "shap_values": feature_importance
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================================
# IEEE FRAUD API
# =========================================

@app.route("/api/predict/ieee", methods=["POST"])
def predict_ieee():

    try:
        data = request.get_json(silent=True) or {}

        missing = [
            feature for feature in IEEE_FEATURES
            if feature not in data
        ]

        if missing:
            return jsonify({
                "error": "Missing required feature(s)",
                "missing": missing
            }), 400

        processed_data = []

        for feature in IEEE_FEATURES:

            value = data[feature]

            if feature == "DeviceType":

                val_str = str(value).lower()
                if val_str == "mobile":
                    value = 1
                elif val_str == "desktop":
                    value = 2
                else:
                    value = 0

            processed_data.append(float(value))

        features = pd.DataFrame(
            [processed_data],
            columns=IEEE_FEATURES
        )

        prediction = ieee_model.predict(features)[0]

        risk_score = ieee_model.predict_proba(features)[0][1]

        result = (
            "High Fraud Risk"
            if prediction == 1
            else "Low Fraud Risk"
        )

        shap_vals = ieee_explainer.shap_values(features)
        shap_class1 = shap_vals[1][0] if isinstance(shap_vals, list) else shap_vals[0]
        feature_importance = [
            {"feature": f, "value": float(v)}
            for f, v in zip(IEEE_FEATURES, shap_class1)
        ]

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "risk_score": float(risk_score),
            "shap_values": feature_importance
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================================
# START SERVER
# =========================================

if __name__ == "__main__":

    print("\n===================================")
    print("STARTING FLASK SERVER...")
    print("===================================\n")

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )