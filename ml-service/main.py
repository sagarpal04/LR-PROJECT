from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np
import os
from model_class import LinearRegressionModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Student Performance ML API",
    description="ML API for predicting student exam scores",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/model.joblib"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "Model not found. Please run train.py first."
    )

model = joblib.load(MODEL_PATH)


class StudentData(BaseModel):
    study_hours: float = Field(..., ge=0, le=24)
    attendance: float = Field(..., ge=0, le=100)
    previous_score: float = Field(..., ge=0, le=100)
    sleep_hours: float = Field(..., ge=0, le=24)
    assignments: int = Field(..., ge=0)


@app.get("/")
def home():
    return {
        "message": "Student Performance ML API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(data: StudentData):
    input_data = np.array([
        [
            data.study_hours,
            data.attendance,
            data.previous_score,
            data.sleep_hours,
            data.assignments
        ]
    ], dtype=float)

    prediction = model.predict(input_data)[0]
    prediction = max(0, min(100, prediction))

    return {
        "predicted_score": round(float(prediction), 2)
    }