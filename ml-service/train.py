import pandas as pd
import joblib
import os
import numpy as np
from model_class import LinearRegressionModel
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


df = pd.read_csv("data.csv")

print("Dataset:")
print(df.head())

print("\nDataset shape:", df.shape)


features = [
    "study_hours",
    "attendance",
    "previous_score",
    "sleep_hours",
    "assignments"
]

X = df[features].values
y = df["exam_score"].values


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


X_mean = X_train.mean(axis=0)
X_std = X_train.std(axis=0)

X_std[X_std == 0] = 1

X_train_scaled = (X_train - X_mean) / X_std
X_test_scaled = (X_test - X_mean) / X_std


n_features = X_train_scaled.shape[1]

weights = np.zeros(n_features)
bias = 0.0

learning_rate = 0.01
epochs = 1000


n = len(X_train_scaled)

for epoch in range(epochs):
    predictions = np.dot(X_train_scaled, weights) + bias
    error = predictions - y_train
    cost = np.mean(error ** 2)

    dw = (2 / n) * np.dot(X_train_scaled.T, error)
    db = (2 / n) * np.sum(error)

    weights = weights - learning_rate * dw
    bias = bias - learning_rate * db

    if epoch % 100 == 0:
        print(f"Epoch {epoch}, Cost: {cost:.4f}")


model = LinearRegressionModel(
    weights=weights,
    bias=bias,
    mean=X_mean,
    std=X_std,
    features=features
)


predictions = model.predict(X_test)


mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\nModel Evaluation")
print("----------------")
print("MAE:", mae)
print("MSE:", mse)
print("R2 Score:", r2)


print("\nLearned Parameters")
print("------------------")

for feature, weight in zip(features, weights):
    print(f"{feature}: {weight:.4f}")

print("Bias:", bias)


os.makedirs("model", exist_ok=True)

joblib.dump(
    model,
    "model/model.joblib"
)

print("\nModel saved successfully!")
print("Location: model/model.joblib")