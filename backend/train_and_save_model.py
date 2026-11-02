import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import f1_score
from custom_transformers import StSlopeFixer, OutlierCapper


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "heart-disease-dataset.csv"
MODEL_PATH = BASE_DIR / "model.pkl"


def find_best_threshold(model, X_train, y_train, cv):
    train_proba_cv = cross_val_predict(
        model,
        X_train,
        y_train,
        cv=cv,
        method="predict_proba"
    )[:, 1]

    thresholds = np.arange(0.10, 0.91, 0.01)
    best_threshold = 0.50
    best_f1 = -1

    for thr in thresholds:
        y_pred_thr = (train_proba_cv >= thr).astype(int)
        current_f1 = f1_score(y_train, y_pred_thr)

        if current_f1 > best_f1:
            best_f1 = current_f1
            best_threshold = thr

    return best_threshold


df = pd.read_csv(DATA_PATH)

df["cholesterol"] = df["cholesterol"].replace(0, np.nan)
df["resting_bp_s"] = df["resting_bp_s"].replace(0, np.nan)
df = df.drop_duplicates()

X = df.drop("target", axis=1)
y = df["target"].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

num_features = ["age", "cholesterol", "resting_bp_s", "max_heart_rate", "oldpeak"]
cat_features = ["sex", "chest_pain_type", "fasting_blood_sugar", "resting_ecg", "exercise_angina", "st_slope"]

num_pipeline = Pipeline([
    ("outlier_capper", OutlierCapper(columns=["cholesterol", "resting_bp_s", "oldpeak"])),
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

cat_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", num_pipeline, num_features),
    ("cat", cat_pipeline, cat_features)
])

full_preprocess = Pipeline([
    ("st_slope_fix", StSlopeFixer(column="st_slope", invalid_value=0)),
    ("column_transform", preprocessor)
])

knn_pipeline = Pipeline([
    ("preprocessing", full_preprocess),
    ("classifier", KNeighborsClassifier())
])

param_grid = {
    "classifier__n_neighbors": [3, 5, 7, 9, 11, 13],
    "classifier__weights": ["uniform", "distance"],
    "classifier__metric": ["euclidean", "manhattan", "minkowski"]
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

grid_knn = GridSearchCV(
    estimator=knn_pipeline,
    param_grid=param_grid,
    cv=cv,
    scoring="f1",
    n_jobs=-1,
    refit=True
)

grid_knn.fit(X_train, y_train)
best_knn = grid_knn.best_estimator_

calibrated_knn = CalibratedClassifierCV(
    estimator=best_knn,
    method="sigmoid",
    cv=5
)

calibrated_knn.fit(X_train, y_train)

best_threshold_knn = find_best_threshold(calibrated_knn, X_train, y_train, cv)

artifact = {
    "model": calibrated_knn,
    "threshold": best_threshold_knn
}

joblib.dump(artifact, MODEL_PATH)

print("Model saved successfully as model.pkl")
print("Best threshold:", best_threshold_knn)