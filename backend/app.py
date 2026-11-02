from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from pathlib import Path

from custom_transformers import StSlopeFixer, OutlierCapper

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

artifact = joblib.load(MODEL_PATH)
model = artifact["model"]
best_threshold = artifact["threshold"]


def compute_risk_score(probability, threshold):
    if probability < threshold:
        score = (probability / threshold) * 50
    else:
        score = 50 + ((probability - threshold) / (1 - threshold)) * 50
    return round(score, 2)


def get_risk_label(score):
    if score < 33:
        return "Low Risk"
    elif score < 66:
        return "Moderate Risk"
    return "High Risk"


def get_risk_color(score):
    if score < 33:
        return "green"
    elif score < 66:
        return "orange"
    return "red"


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CardioAI Flask API is running."
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        required_fields = [
            "age",
            "cholesterol",
            "resting_bp_s",
            "max_heart_rate",
            "oldpeak",
            "sex",
            "chest_pain_type",
            "fasting_blood_sugar",
            "resting_ecg",
            "exercise_angina",
            "st_slope"
        ]

        missing = [field for field in required_fields if field not in data]
        if missing:
            return jsonify({
                "error": f"Missing fields: {', '.join(missing)}"
            }), 400

        patient = pd.DataFrame([{
            "age": float(data["age"]),
            "cholesterol": float(data["cholesterol"]),
            "resting_bp_s": float(data["resting_bp_s"]),
            "max_heart_rate": float(data["max_heart_rate"]),
            "oldpeak": float(data["oldpeak"]),
            "sex": int(data["sex"]),
            "chest_pain_type": int(data["chest_pain_type"]),
            "fasting_blood_sugar": int(data["fasting_blood_sugar"]),
            "resting_ecg": int(data["resting_ecg"]),
            "exercise_angina": int(data["exercise_angina"]),
            "st_slope": int(data["st_slope"])
        }])

        probability = float(model.predict_proba(patient)[0][1])
        score = compute_risk_score(probability, best_threshold)
        risk_label = get_risk_label(score)
        risk_color = get_risk_color(score)

        return jsonify({
            "probability": round(probability, 4),
            "risk_score": score,
            "risk_label": risk_label,
            "risk_color": risk_color,
            "threshold": round(float(best_threshold), 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)