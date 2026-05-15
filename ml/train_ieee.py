import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

print("===================================")
print("LOADING IEEE DATASETS...")
print("===================================")

# ===================================
# LOAD DATASETS
# ===================================

transaction = pd.read_csv(
    "datasets/train_transaction.csv",
    nrows=50000
)

identity = pd.read_csv(
    "datasets/train_identity.csv",
    nrows=50000
)

print("\nDATASETS LOADED SUCCESSFULLY")

# ===================================
# MERGE DATASETS
# ===================================

print("\n===================================")
print("MERGING DATASETS...")
print("===================================")

data = transaction.merge(
    identity,
    on="TransactionID",
    how="left"
)

print("\nMERGED DATASET SHAPE:")
print(data.shape)

# ===================================
# SELECT FEATURES
# ===================================

print("\n===================================")
print("SELECTING FEATURES...")
print("===================================")

selected_features = [
    'TransactionAmt',
    'card1',
    'card2',
    'addr1',
    'dist1'
]

# Add DeviceType if available
if 'DeviceType' in data.columns:
    selected_features.append('DeviceType')

print("\nFEATURES USED:")
print(selected_features)

# ===================================
# HANDLE MISSING VALUES
# ===================================

print("\n===================================")
print("HANDLING MISSING VALUES...")
print("===================================")

for column in selected_features:

    # Numerical columns
    if data[column].dtype != 'object':
        data[column] = data[column].fillna(
            data[column].median()
        )

    # Categorical columns
    else:
        data[column] = data[column].fillna("Unknown")

# ===================================
# ENCODE CATEGORICAL DATA
# ===================================

print("\n===================================")
print("ENCODING CATEGORICAL FEATURES...")
print("===================================")

for column in selected_features:

    if data[column].dtype == 'object':

        data[column] = pd.factorize(
            data[column]
        )[0]

# ===================================
# FEATURES AND TARGET
# ===================================

X = data[selected_features]

y = data['isFraud']

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
print("TRAINING IEEE FRAUD MODEL...")
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
# FRAUD RISK SCORES
# ===================================

print("\n===================================")
print("GENERATING RISK SCORES...")
print("===================================")

y_prob = model.predict_proba(X_test)[:, 1]

print("\nSAMPLE FRAUD SCORES:")
print(y_prob[:10])

# ===================================
# FEATURE IMPORTANCE
# ===================================

print("\n===================================")
print("FEATURE IMPORTANCE")
print("===================================")

importance = model.feature_importances_

feature_importance = pd.DataFrame({
    'Feature': selected_features,
    'Importance': importance
})

feature_importance = feature_importance.sort_values(
    by='Importance',
    ascending=False
)

print(feature_importance)

# ===================================
# SAVE MODEL
# ===================================

print("\n===================================")
print("SAVING MODEL...")
print("===================================")

joblib.dump(
    model,
    "models/ieee_model.pkl"
)

print("\nMODEL SAVED SUCCESSFULLY")
print("File: models/ieee_model.pkl")