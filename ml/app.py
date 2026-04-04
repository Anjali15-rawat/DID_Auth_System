from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("fraud_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        features = np.array([[
            data["login_attempts"],
            data["failed_attempts"],
            data["request_frequency"],
            data["odd_hour_access"],
            data["new_device"],
            data["location_change"],
            data["multiple_wallet_switches"]
        ]])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0].tolist()

        result = "Fraudulent / Suspicious" if prediction == 1 else "Legitimate"

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "probability": probability
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)