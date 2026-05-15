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
print("LOADING DATASET...")
print("===================================")

# Load dataset
data = pd.read_csv(
    "datasets/rba-dataset.csv",
    nrows=100000
)

print("\nDATASET LOADED SUCCESSFULLY")
print(data.head())

# ===================================
# PREPROCESSING
# ===================================

print("\n===================================")
print("PREPROCESSING DATA...")
print("===================================")

# Fill missing RTT values
data['Round-Trip Time [ms]'] = data[
    'Round-Trip Time [ms]'
].fillna(-1.0)

# Convert boolean login status to integer
data['LoginSuccessful'] = data[
    'Login Successful'
].astype(int)

# ===================================
# TARGET VARIABLE
# ===================================

# 1 = Attack
# 0 = Legitimate
y = data['Is Attack IP'].astype(int)

# ===================================
# FEATURE SELECTION
# ===================================

X = data[[
    'ASN',
    'LoginSuccessful',
    'Round-Trip Time [ms]'
]].copy()

X.columns = [
    'ASN',
    'LoginSuccessful',
    'RoundTripTime'
]

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
    random_state=42
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

print("\nACCURACY:")
print(accuracy)

print("\nCLASSIFICATION REPORT:")
print(classification_report(y_test, y_pred))

print("\nCONFUSION MATRIX:")
print(confusion_matrix(y_test, y_pred))

# ===================================
# FEATURE IMPORTANCE
# ===================================

print("\nFEATURE IMPORTANCE:")

importance = model.feature_importances_

for feature, score in zip(X.columns, importance):
    print(f"{feature}: {score:.4f}")

# ===================================
# SAVE MODEL
# ===================================

print("\n===================================")
print("SAVING MODEL...")
print("===================================")

joblib.dump(model, "fraud_model.pkl")

print("\nMODEL SAVED SUCCESSFULLY")
print("File: fraud_model.pkl")