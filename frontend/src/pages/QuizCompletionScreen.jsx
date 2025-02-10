import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnectors";
import { useSelector } from "react-redux";

const QuizCompletionScreen = ({ quizStats, totalQuestions, totalTime }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { subModule_id, subjectId } = useParams();
  const { signupData } = useSelector((state) => state.auth);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchAnalyticsDetails = async () => {
      try {
        const response = await apiConnector(
          "GET", 
          `users/analytics?googleId=${signupData.googleId}&subModuleId=${subModule_id}`
        );
        
        // Log the response to debug
        console.log("Analytics Response:", response.data);
        
        // Ensure the response structure matches what we expect
        if (response.data && response.data.responseData) {
          setAnalyticsData(response.data.responseData);
        } else {
          console.error("Unexpected response structure", response);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setIsLoading(false);
      }
    };

    fetchAnalyticsDetails();
  }, [signupData.googleId, subModule_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Quiz Completed!</h2>
        
        {/* Overall Performance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Performance Summary</h3>
            <p className="text-green-500">Correct Answers: {quizStats.correct}</p>
            <p className="text-red-500">Incorrect Answers: {quizStats.incorrect}</p>
            <p className="text-gray-600">Total Time: {formatTime(totalTime)}</p>
            <p className="text-gray-600">
              Score: {((quizStats.correct / totalQuestions) * 100).toFixed(1)}%
            </p>
          </div>
          
          {/* Detailed Analytics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Question Classification</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>OK Questions:</span>
                <span className="font-bold">{analyticsData?.questionClassification?.ok?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Bad Questions:</span>
                <span className="font-bold">{analyticsData?.questionClassification?.bad?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Important Questions:</span>
                <span className="font-bold">{analyticsData?.questionClassification?.important?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        

        {/* Navigation */}
        <div className="mt-6 text-center">
          <Link
            to="/dashboard"
            className="bg-black text-white px-6 py-3 rounded-lg inline-block hover:bg-gray-800"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCompletionScreen;