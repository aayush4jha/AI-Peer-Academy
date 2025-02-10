import React, { useState, useEffect } from "react";
import { apiConnector } from "../services/apiConnectors";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import QuizCompletionScreen from "./QuizCompletionScreen";
import toast from "react-hot-toast";
import axios from "axios";

const QuizInterface = () => {
  const location = useLocation();
  const { subModule_id, subjectId } = useParams();
  const submoduleId = subModule_id;

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
  const [lastAttemptedIndex, setLastAttemptedIndex] = useState(0);
  const { signupData } = useSelector((state) => state.auth);

  const googleId = signupData.googleId;

  // Question Grid Component
  const QuestionGrid = () => {
    const getQuestionStats = () => {
      const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
      const incorrectCount = Object.values(answers).filter(a => !a.isCorrect).length;
      const unattemptedCount = data.length - (correctCount + incorrectCount);
      
      return {
        correct: correctCount,
        incorrect: incorrectCount,
        unattempted: unattemptedCount
      };
    };

    const stats = getQuestionStats();

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Questions Overview</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {data.map((question, index) => {
            const isAnswered = answers[question._id];
            let bgColor = "bg-blue-500"; // Unattempted
            let attempts = 0;
    
            if (isAnswered) {
              bgColor = isAnswered.isCorrect ? "bg-green-500" : "bg-red-500";
              attempts = isAnswered.attempts || 0;
            }
    
            const isCurrentQuestion = index === currentQuestionIndex;
            const borderStyle = isCurrentQuestion ? "border-4 border-yellow-500" : "";
    
            return (
              <div key={question._id} className="relative">
                <button
                  onClick={() => {
                    saveResponse();
                    setCurrentQuestionIndex(index);
                    setQuestionTimer(0);
                    const savedAnswer = answers[question._id];
                    setSelectedOption(savedAnswer?.optionId || null);
                    setIsCorrect(savedAnswer?.isCorrect || null);
                  }}
                  className={`w-10 h-10 ${bgColor} ${borderStyle} text-white rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity`}
                >
                  {index + 1}
                </button>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Correct: {stats.correct}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Incorrect: {stats.incorrect}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>Unattempted: {stats.unattempted}</span>
          </div>
        </div>
      </div>
    );
    
  };

  useEffect(() => {
      const fetchAttemptedSubModules = async () => {
        try {
          const response = await apiConnector(
            "GET",
            `users/analytics/answers/?googleId=${googleId}&subModuleId=${submoduleId}`
          );
    
          if(response.data?.isAttempted){
            const userResponses = response.data?.answers;
            let lastIndex = 0;
            let nextQuestionIndex = 0;
            
            // Update answers with past responses
            setAnswers(() => {
              const pastAnswers = {};
              userResponses.forEach((answer, index) => {
                if(answer.userAnswer) {
                  pastAnswers[answer.questionId._id] = {
                    optionId: answer.userAnswer,
                    isCorrect: answer.isCorrect,
                    attempts: 1
                  };
                  
                  // Track the last attempted index
                  lastIndex = index;
                }
              });
              return pastAnswers;
            });
    
            // Update stats based on past answers
            const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
            const incorrectCount = Object.keys(answers).length - correctCount;
            
            setStats({
              correct: correctCount,
              incorrect: incorrectCount
            });
            
            // Prioritize navigation logic
            const attemptedQuestionIds = Object.keys(answers);
            const unattemptedQuestionIndices = data.reduce((acc, question, index) => {
              if (!attemptedQuestionIds.includes(question._id)) {
                acc.push(index);
              }
              return acc;
            }, []);
    
            // If there are unattempted questions, start from the first unattempted question
            if (unattemptedQuestionIndices.length > 0) {
              nextQuestionIndex = unattemptedQuestionIndices[0];
            } else {
              // If all questions are attempted, move to the next question
              nextQuestionIndex = Math.min(lastIndex + 1, data.length - 1);
            }
            
            setCurrentQuestionIndex(nextQuestionIndex);
            
            // Set the selected option and correctness for the current question
            const currentQuestion = data[nextQuestionIndex];
            const savedAnswer = answers[currentQuestion._id];
            setSelectedOption(savedAnswer?.optionId || null);
            setIsCorrect(savedAnswer?.isCorrect || null);
          }
        } catch (err) {
          console.error("Error fetching course details:", err);
        }
      };
  
      // Only run this effect if data is loaded
      if (data.length > 0) {
        fetchAttemptedSubModules();
      }
    }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiConnector(
          "GET",
          `/admin/submodules/${submoduleId}`
        );
        setData(response.data.submodule.questions);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading courses:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
  
    // Only update stats if this is a new answer for this question
    if (!answers[question._id] || answers[question._id].optionId !== optionId) {
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
        attempts: (prev[question._id]?.attempts || 0) + 1
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
        const updatedResponses = [...prev];
        updatedResponses[existingResponseIndex] = {
          ...updatedResponses[existingResponseIndex],
          ...responseData,
        };
        return updatedResponses;
      } else {
        return [...prev, responseData];
      }
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < data.length - 1) {
      saveResponse();
      const qID = data[currentQuestionIndex]._id;
      const res = await apiConnector("POST", `/users/questions/${qID}/attempt`, {
        subModuleId: submoduleId,
        userAnswer: {
          questionId: qID,
          userAnswer: answers[qID]?.optionId || null,
          isCorrect: answers[qID]?.isCorrect || false,
          timeSpent: questionTimer,
          notes,
          importance,
          timestamp: new Date().toISOString(),
        },
        subjectId,
        googleId
      });
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
    const allResponses = data.map((question, index) => {
      const existingResponse = userResponses.find(
        (response) => response.questionId === question._id
      );

      if (!existingResponse) {
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
      saveResponse();
      const qID = data[currentQuestionIndex]._id;
      const res = await apiConnector("POST", `/users/questions/${qID}/attempt`, {
        subModuleId: submoduleId,
        userAnswer: {
          questionId: qID,
          userAnswer: answers[qID]?.optionId || null,
          isCorrect: answers[qID]?.isCorrect || false,
          timeSpent: questionTimer,
          notes,
          importance,
          timestamp: new Date().toISOString(),
        },
        subjectId,
        googleId
      });

      data.forEach((_, index) => {
        if (index !== currentQuestionIndex) {
          saveResponse(index);
        }
      });

      setIsRunning(false);
      const analyticsData = prepareAnalyticsData();
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
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 flex flex-col lg:flex-row ">
      {/* Left sidebar with clock and QuestionGrid */}
      <div className="w-full lg:w-64 mb-4 lg:mb-0 lg:mr-4">
        <div className="flex  lg:flex-col items-center lg:items-start space-y-0 lg:space-y-4 space-x-4 lg:space-x-0">
          {/* Clock */}
          <div className="bg-white rounded-full p-4 shadow-lg">
            <div className="text-2xl font-bold">{formatTime(timer)}</div>
          </div>

          {/* QuestionGrid */}
          <div className="w-full lg:w-auto">
            <QuestionGrid />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-3xl mx-auto relative">
          {/* <img
            src="../../images/vectorImg2.png"
            alt=""
            className="absolute bottom-[10px] left-[10px] w-40 h-40 lg:w-80 lg:h-80 rounded-full opacity-30 lg:opacity-50"
          /> */}

          {/* Animation Overlay */}
          {showAnimation && (
            <div
              className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity ${showAnimation ? "opacity-100" : "opacity-0"}`}
            >
              <div className={`text-6xl lg:text-8xl animate-bounce`}>{isCorrect ? "🎉" : "😔"}</div>
            </div>
          )}

          {/* Main Quiz Card */}
          <div className="bg-white rounded-lg shadow-lg mt-4 lg:mt-16">
            <div className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 bg-black text-white p-4 lg:p-8 rounded-t-2xl">
              {data[currentQuestionIndex].questionText}
            </div>

            {/* Options */}
            <div className="space-y-3 p-4">
              {data[currentQuestionIndex].options.map((option, index) => {
                const currentQuestionId = data[currentQuestionIndex]._id
                const savedAnswer = answers[currentQuestionId]
                const isSelected = selectedOption === option._id || savedAnswer?.optionId === option._id
                const showCorrectness = isSelected && (isCorrect !== null || savedAnswer?.isCorrect !== null)

                return (
                  <button
                    key={option._id}
                    className={`w-full p-3 lg:p-4 text-left rounded-lg border transition-all ${
                      isSelected
                        ? showCorrectness && (isCorrect || savedAnswer?.isCorrect)
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-red-500 text-white border-red-600"
                        : "bg-white hover:bg-gray-50 border-gray-300"
                    }`}
                    onClick={() => handleOptionSelect(option._id)}
                    disabled={savedAnswer !== undefined}
                  >
                    {index + 1}.<span className="ml-2 lg:ml-4"></span>
                    {option.optionText}
                  </button>
                )
              })}
            </div>

            {/* Importance Markers */}
            <div className="flex justify-center space-x-2 lg:space-x-4 mt-4 lg:mt-6">
              <button
                className={`px-2 lg:px-4 py-2 rounded-lg flex items-center text-sm lg:text-base ${
                  importance === "bad" ? "bg-red-500 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setImportance("bad")}
              >
                <span className="mr-1 lg:mr-2">🚫</span> Bad
              </button>
              <button
                className={`px-2 lg:px-4 py-2 rounded-lg flex items-center text-sm lg:text-base ${
                  importance === "ok" ? "bg-green-500 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setImportance("ok")}
              >
                <span className="mr-1 lg:mr-2">👍</span> OK
              </button>
              <button
                className={`px-2 lg:px-4 py-2 rounded-lg flex items-center text-sm lg:text-base ${
                  importance === "important"
                    ? "bg-yellow-500 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setImportance("important")}
              >
                <span className="mr-1 lg:mr-2">⭐</span> Important
              </button>
            </div>

            {/* Notes */}
            <div className="p-4">
              <textarea
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-4 lg:mt-6 p-3 lg:p-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full mt-2">
              <button
                className={`px-4 lg:px-6 w-full py-3 lg:py-4 rounded-lg justify-center font-bold flex items-center text-sm lg:text-base ${
                  currentQuestionIndex === 0
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
                  className="px-4 lg:px-6 py-3 lg:py-4 w-full justify-center font-bold rounded-lg flex items-center bg-green-600 text-white hover:bg-green-700 text-sm lg:text-base"
                  onClick={handleQuizSubmit}
                  disabled={isQuizCompleted}
                >
                  {isQuizCompleted ? "Submitted!" : "Submit Quiz"}
                </button>
              ) : (
                <button
                  className="px-4 lg:px-6 py-3 lg:py-4 w-full justify-center font-bold rounded-lg flex items-center bg-black text-white hover:bg-gray-900 text-sm lg:text-base"
                  onClick={handleNext}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;