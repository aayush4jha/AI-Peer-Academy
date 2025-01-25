import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnectors";
import {
  Clock,
  CheckCircle,
  XCircle,
  Star,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";

const AnalyticsDashboard = () => {
  // Sample data from your backend
  const [data, setData] = useState({
    stats: {
      totalTimeSpent: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalQuestions: 0,
    },
    questionClassification: {
      important: [],
      ok: [],
      bad: [],
      common: [],
    },
  });
  const [loading, setIsLoading] = useState(false);

  const { signupData, token } = useSelector((state) => state.auth);
  const googleId = signupData.googleId;
  const location = useLocation();
  const { subModuleId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiConnector(
          "GET",
          `/users/analytics?googleId=${googleId}&subModuleId=${subModuleId}`
        );
        console.log(response);
        setData(response.data.responseData || {}); // Safeguard against undefined responses
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading courses:", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Clock className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Time</p>
            <p className="text-xl font-semibold">
              {formatTime(data.stats.totalTimeSpent)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Correct Answers</p>
            <p className="text-xl font-semibold">{data.stats.correctAnswers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full">
            <XCircle className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Incorrect Answers</p>
            <p className="text-xl font-semibold">
              {data.stats.incorrectAnswers}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Star className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Questions</p>
            <p className="text-xl font-semibold">{data.stats.totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Important Questions */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-500 w-6 h-6" />
            <h3 className="text-lg font-semibold">Important Questions</h3>
            <span className="ml-auto text-sm text-gray-500">
              {data.questionClassification.important.length} questions
            </span>
          </div>
          <div className="space-y-3">
            {data.questionClassification.important.map((question, index) => (
              <div key={question._id} className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-gray-800">
                  <p>
                    {index + 1}. {question.questionId.questionText}
                  </p>
                  {question.notes && (
                    <p className="flex justify-end mr-4 text-gray-500">
                      Notes: {question.notes}
                    </p>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* OK Questions */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="text-green-500 w-6 h-6" />
            <h3 className="text-lg font-semibold">OK Questions</h3>
            <span className="ml-auto text-sm text-gray-500">
              {data.questionClassification.ok.length} questions
            </span>
          </div>
          <div className="space-y-3">
            {data.questionClassification.ok.map((question, index) => (
              <div key={question._id} className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-800">
                  <p>
                    {index + 1}. {question.questionId.questionText}
                  </p>
                  {question.notes && (
                    <p className="flex justify-end mr-4 text-gray-500">
                      Notes: {question.notes}
                    </p>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bad Questions */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500 w-6 h-6" />
            <h3 className="text-lg font-semibold">Needs Improvement</h3>
            <span className="ml-auto text-sm text-gray-500">
              {data.questionClassification.bad.length} questions
            </span>
          </div>
          <div className="space-y-3">
            {data.questionClassification.bad.map((question, index) => (
              <div key={question._id} className="p-4 bg-red-50 rounded-lg">
                <p className="text-gray-800">
                  <p>
                    {index + 1}. {question.questionId.questionText}
                  </p>
                  {question.notes && (
                    <p className="flex justify-end mr-4 text-gray-500">
                      Notes: {question.notes}
                    </p>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Common Questions */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="text-green-500 w-6 h-6" />
            <h3 className="text-lg font-semibold"> Common</h3>
            <span className="ml-auto text-sm text-gray-500">
              {data.questionClassification.common.length} questions
            </span>
          </div>
          <div className="space-y-3">
            {data.questionClassification?.common.map((question, index) => (
              <div key={question._id} className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-800">
                  <p>
                    {index + 1}. {question.questionId.questionText}
                  </p>
                  {question.notes && (
                    <p className="flex justify-end mr-4 text-gray-500">
                      Notes: {question.notes}
                    </p>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
