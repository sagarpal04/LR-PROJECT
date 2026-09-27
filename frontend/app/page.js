"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    study_hours: 8,
    attendance: 90,
    previous_score: 75,
    sleep_hours: 7,
    assignments: 9,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch(
        "https://ml-backend-be26.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setPrediction(data);
    } catch (err) {
      setError("Unable to get prediction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Performance Predictor
          </h1>

          <p className="text-gray-500 mt-2">
            Enter student details to predict the exam score
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Hours
            </label>

            <input
              type="number"
              name="study_hours"
              value={formData.study_hours}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance (%)
            </label>

            <input
              type="number"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Score
            </label>

            <input
              type="number"
              name="previous_score"
              value={formData.previous_score}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Hours
            </label>

            <input
              type="number"
              name="sleep_hours"
              value={formData.sleep_hours}
              onChange={handleChange}
              min="0"
              max="24"
              step="0.1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignments Completed
            </label>

            <input
              type="number"
              name="assignments"
              value={formData.assignments}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Predicting..." : "Predict Score"}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {prediction && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm">
              Predicted Exam Score
            </p>

            <p className="text-5xl font-bold text-green-600 mt-2">
              {prediction.predicted_score ?? prediction.prediction}
            </p>

            <p className="text-gray-500 mt-2">
              out of 100
            </p>
          </div>
        )}
      </div>
    </main>
  );
}