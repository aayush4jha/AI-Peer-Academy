// components/quiz/QuizCompletionScreen.jsx
import React from "react";
import { Link } from "react-router-dom";

const QuizCompletionScreen = ({ quizStats, totalQuestions, totalTime }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <div className="mb-6">
          <p className="text-lg mb-2">Your Results:</p>
          <p className="text-green-500">Correct Answers: {quizStats.correct}</p>
          <p className="text-red-500">
            Incorrect Answers: {quizStats.incorrect}
          </p>
          <p className="text-gray-600">Total Time: {formatTime(totalTime)}</p>
          <p className="text-gray-600">
            Score: {((quizStats.correct / totalQuestions) * 100).toFixed(1)}%
          </p>
        </div>
        <Link
          to="/dashboard"
          className="bg-black text-white px-6 py-3 rounded-lg inline-block hover:bg-gray-800"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default QuizCompletionScreen;
