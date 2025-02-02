import React, { useState, useEffect } from "react";
import { apiConnector } from "../services/apiConnectors";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import QuizCompletionScreen from "./QuizCompletionScreen";
import toast from "react-hot-toast";
import axios from "axios";
// import toast from "react-hot-toast";

const QuizInterface = () => {
  const location = useLocation();
  const { subModule_id, subjectId } = useParams();
  const submoduleId = subModule_id;
  // console.log("here useparams", useParams())

  // Enhanced state management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [notes, setNotes] = useState("");
  const [importance, setImportance] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isCorrect, setIsCorrect] = useState(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [data, setData] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const { signupData } = useSelector((state) => state.auth);
  // const userId = signupData.userId;
  useEffect (() => console.log(data),[data])

  useEffect(() => {
      const fetchAttemptedSubModules = async () => {
        try {
          const response = await apiConnector(
            "GET",
            `users/analytics/answers/?googleId=${googleId}&subModuleId=${submoduleId}`
          );

          console.log(response.data, "yeh rha data");

          if(response.data?.isAttempted){
            const userResponses = response.data?.answers;
            setAnswers(() => {
              const pastAnswers = {};
              userResponses.forEach((answer) => {
                if(answer.userAnswer){pastAnswers[answer.questionId._id] = {
                  optionId: answer.userAnswer,
                  isCorrect: answer.isCorrect,
                };}
              })

              return pastAnswers;
            });
          }
          // console.log(response.data?.attemptedSubmodules);
          // setAttemptedList(() => [...response.data?.attemptedSubmodules]);
        } catch (err) {
          console.error("Error fetching course details:", err);
        }
      };
      fetchAttemptedSubModules();
      // console.log(attemptedList, "yeh rha list");
    }, []);

  const googleId = signupData.googleId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiConnector(
          "GET",
          `/admin/submodules/${submoduleId}`
        );
        console.log("this is the data", response.data)
        setData(response.data.submodule.questions);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading courses:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load saved response when changing questions
  useEffect(() => {
    if (data.length > 0) {
      const currentQuestionId = data[currentQuestionIndex]._id;
      const savedResponse = userResponses.find(
        (response) => response.questionId === currentQuestionId
      );

      if (savedResponse) {
        setNotes(savedResponse.notes || "");
        setImportance(savedResponse.importance || null);
      } else {
        setNotes("");
        setImportance(null);
      }
    }
  }, [currentQuestionIndex, data]);

  // Timer effects
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setQuestionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const checkAnswer = (optionId, questionIndex) => {
    const question = data[questionIndex];
    const selectedAnswer = question.options.find((opt) => opt._id === optionId);
    const correct = selectedAnswer.isCorrect;

    if (!answers[question._id]) {
      setStats((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
      }));
    }

    setIsCorrect(correct);
    setShowAnimation(true);

    setAnswers((prev) => ({
      ...prev,
      [question._id]: {
        optionId,
        isCorrect: correct,
      },
    }));

    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    checkAnswer(optionId, currentQuestionIndex);
  };

  const saveResponse = (index = currentQuestionIndex) => {
    const currentQuestionId = data[index]._id;
    const responseData = {
      questionId: currentQuestionId,
      userAnswer: answers[currentQuestionId]?.optionId || null,
      isCorrect: answers[currentQuestionId]?.isCorrect || false,
      timeSpent: questionTimer,
      notes,
      importance,
      timestamp: new Date().toISOString(),
    };

    setUserResponses((prev) => {
      const existingResponseIndex = prev.findIndex(
        (response) => response.questionId === currentQuestionId
      );

      if (existingResponseIndex !== -1) {
        // Update existing response
        const updatedResponses = [...prev];
        updatedResponses[existingResponseIndex] = {
          ...updatedResponses[existingResponseIndex],
          ...responseData,
        };
        return updatedResponses;
      } else {
        // Add new response
        return [...prev, responseData];
      }
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < data.length - 1) {
      saveResponse();
      const qID = data[currentQuestionIndex]._id;
      const res = await apiConnector("POST", `/users/questions/${qID}/attempt`, {
        subModuleId:submoduleId, userAnswer: {
          questionId: qID,
          userAnswer: answers[qID]?.optionId || null,
          isCorrect: answers[qID]?.isCorrect || false,
          timeSpent: questionTimer,
          notes,
          importance,
          timestamp: new Date().toISOString(),
        },subjectId,googleId
      })
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestion = data[currentQuestionIndex + 1];
      const savedAnswer = answers[nextQuestion._id];
      setSelectedOption(savedAnswer?.optionId || null);
      setIsCorrect(savedAnswer?.isCorrect || null);
      setQuestionTimer(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveResponse();
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQuestion = data[currentQuestionIndex - 1];
      const savedAnswer = answers[prevQuestion._id];
      setSelectedOption(savedAnswer?.optionId || null);
      setIsCorrect(savedAnswer?.isCorrect || null);
      setQuestionTimer(0);
    }
  };

  const prepareAnalyticsData = () => {
    // Ensure all questions have responses
    const allResponses = data.map((question, index) => {
      const existingResponse = userResponses.find(
        (response) => response.questionId === question._id
      );

      console.log("existingResponse", existingResponse);

      if (!existingResponse) {
        // Create a default response for unanswered questions
        return {
          questionId: question._id,
          userAnswer: answers[question._id]?.optionId || null,
          isCorrect: answers[question._id]?.isCorrect || false,
          timeSpent: 0,
          notes: "",
          importance: null,
          timestamp: new Date().toISOString(),
        };
      }
      return existingResponse;
    });

    const tagCounts = {
      bad: [],
      ok: [],
      important: [],
    };

    const questionAnswers = allResponses.map((response) => {
      if (response.importance) {
        tagCounts[response.importance].push(response.questionId);
      }

      return {
        questionId: response.questionId,
        userAnswer: response.userAnswer,
        isCorrect: response.isCorrect,
        notes: response.notes,
        tag: response.importance,
        timeSpent: response.timeSpent,
      };
    });

    return {
      subjectId,
      googleId,
      subModuleId: submoduleId,
      tagCounts,
      questionAnswers,
      totalTimeSpent: timer,
      correctAnswers: stats.correct,
      incorrectAnswers: stats.incorrect,
      progress: (stats.correct / data.length) * 100,
    };
  };

  const handleQuizSubmit = async () => {
    try {
      // Save the current question's response first
      saveResponse();

      // Make sure we have responses for all questions
      data.forEach((_, index) => {
        if (index !== currentQuestionIndex) {
          saveResponse(index);
        }
      });

      setIsRunning(false);
      const analyticsData = prepareAnalyticsData();
      console.log(analyticsData, "analyticsData");
      const response = await apiConnector(
        "POST",
        "/users/submit-analytics",
        analyticsData
      );
      setIsQuizCompleted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (isLoading || !data?.length) {
    return <div>Loading...</div>;
  }

  if (isQuizCompleted) {
    return (
      <QuizCompletionScreen
        quizStats={stats}
        totalQuestions={data.length}
        totalTime={timer}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative ">
      <div className="max-w-4xl mx-auto ">
        <img
          src="../../images/vectorImg2.png"
          alt=""
          className="absolute bottom-[10px] left-[10px] size-80 rounded-full opacity-30 lg:opacity-50"
        />
        {/* Timer and Stats */}
        <div
          className="absolute xl:top-[50px] xl:left-[50px] 
                flex flex-row gap-5 top-[5px] left-[5px]  
                xl:flex xl:flex-col xl:space-y-2"
        >
          <div className="bg-white rounded-full p-4 shadow-lg">
            <div className="text-2xl font-bold">{formatTime(timer)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-green-500">Correct: {stats.correct}</div>
            <div className="text-red-500">Incorrect: {stats.incorrect}</div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="absolute top-1/3 right-5 space-y-4">
          {[
            currentQuestionIndex - 1,
            currentQuestionIndex,
            currentQuestionIndex + 1,
          ].map((index, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center font-bold justify-center  ${index === currentQuestionIndex
                ? "bg-black text-white scale-125 "
                : "bg-gray-300 text-white"
                }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Animation Overlay */}
        {showAnimation && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity ${showAnimation ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className={`text-8xl animate-bounce`}>
              {isCorrect ? "🎉" : "😔"}
            </div>
          </div>
        )}

        {/* Main Quiz Card */}
        <div className="bg-white rounded-lg shadow-lg mt-16 ">
          <div className="text-2xl font-bold mb-6 bg-black text-white p-8 rounded-t-2xl">
            {data[currentQuestionIndex].questionText}
          </div>
          {/* Options */}
          {/* setOptionNo(0); */}
          <div className="space-y-3 p-4">
            {data[currentQuestionIndex].options.map((option, index) => {
              const currentQuestionId = data[currentQuestionIndex]._id;
              const savedAnswer = answers[currentQuestionId];
              const isSelected =
                selectedOption === option._id ||
                savedAnswer?.optionId === option._id;
              const showCorrectness =
                isSelected &&
                (isCorrect !== null || savedAnswer?.isCorrect !== null);

              return (
                <button
                  key={option._id}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${isSelected
                    ? showCorrectness && (isCorrect || savedAnswer?.isCorrect)
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-red-500 text-white border-red-600"
                    : "bg-white hover:bg-gray-50 border-gray-300"
                    }`}
                  onClick={() => handleOptionSelect(option._id)}
                  disabled={savedAnswer !== undefined}
                >
                  {index + 1}.<span className="ml-4"></span>
                  {option.optionText}
                </button>
              );
            })}
          </div>
          {/* Importance Markers */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${importance === "bad"
                ? "bg-red-500 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => setImportance("bad")}
            >
              <span className="mr-2">🚫</span> Bad
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${importance === "ok"
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => setImportance("ok")}
            >
              <span className="mr-2">👍</span> OK
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${importance === "important"
                ? "bg-yellow-500 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => setImportance("important")}
            >
              <span className="mr-2">⭐</span> Important
            </button>
          </div>
          {/* Notes */}
          <div className="p-4">
            <textarea
              placeholder="Add your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-6 p-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between w-full mt-2">
            <button
              className={`px-6 w-full py-4 rounded-lg justify-center font-bold flex items-center ${currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                : "bg-gray-300 border border-gray-500 hover:bg-gray-50"
                }`}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>
            {currentQuestionIndex === data.length - 1 ? (
              <button
                className="px-6 py-4 w-full justify-center font-bold rounded-lg flex items-center bg-green-600 text-white hover:bg-green-700"
                onClick={handleQuizSubmit}
                disabled={isQuizCompleted}
              >
                {isQuizCompleted ? "Submitted!" : "Submit Quiz"}
              </button>
            ) : (
              <button
                className="px-6 py-4 w-full justify-center font-bold rounded-lg flex items-center bg-black text-white hover:bg-gray-900"
                onClick={handleNext}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
