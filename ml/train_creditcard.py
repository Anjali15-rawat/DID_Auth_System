import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

print("===================================")
print("LOADING CREDIT CARD DATASET...")
print("===================================")

# ===================================
# LOAD DATASET
# ===================================

data = pd.read_csv(
    "datasets/creditcard.csv"
)

print("\nDATASET LOADED SUCCESSFULLY")
print(data.head())

# ===================================
# CHECK DATASET
# ===================================

print("\n===================================")
print("DATASET INFORMATION")
print("===================================")

print("\nSHAPE:")
print(data.shape)

print("\nMISSING VALUES:")
print(data.isnull().sum())

# ===================================
# TARGET VARIABLE
# ===================================

# 1 = Fraud
# 0 = Legitimate

y = data['Class']

# ===================================
# FEATURE SELECTION
# ===================================

X = data.drop("Class", axis=1)

print("\nFEATURES USED:")
print(X.columns)

# ===================================
# TRAIN TEST SPLIT
# ===================================

print("\n===================================")
print("SPLITTING DATASET...")
print("===================================")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ===================================
# MODEL TRAINING
# ===================================

print("\n===================================")
print("TRAINING RANDOM FOREST MODEL...")
print("===================================")

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("\nMODEL TRAINED SUCCESSFULLY")

# ===================================
# MODEL TESTING
# ===================================

print("\n===================================")
print("TESTING MODEL...")
print("===================================")

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print(f"\nACCURACY: {accuracy * 100:.2f}%")

print("\nCLASSIFICATION REPORT:")
print(classification_report(y_test, y_pred))

print("\nCONFUSION MATRIX:")
print(confusion_matrix(y_test, y_pred))

# ===================================
# FRAUD PROBABILITY SCORES
# ===================================

print("\n===================================")
print("GENERATING RISK SCORES...")
print("===================================")

y_prob = model.predict_proba(X_test)[:, 1]

print("\nSAMPLE FRAUD RISK SCORES:")
print(y_prob[:10])

# ===================================
# FEATURE IMPORTANCE
# ===================================

print("\n===================================")
print("FEATURE IMPORTANCE")
print("===================================")

importance = model.feature_importances_

feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': importance
})

feature_importance = feature_importance.sort_values(
    by='Importance',
    ascending=False
)

print(feature_importance.head(10))

# ===================================
# SAVE MODEL
# ===================================

print("\n===================================")
print("SAVING MODEL...")
print("===================================")

joblib.dump(
    model,
    "models/creditcard_model.pkl"
)

print("\nMODEL SAVED SUCCESSFULLY")
print("File: models/creditcard_model.pkl")