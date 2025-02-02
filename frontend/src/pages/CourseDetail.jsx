import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnectors.jsx";
import { ImUnlocked, ImLock } from "react-icons/im";
import toast from "react-hot-toast";

import {
  setSubjectData,
  setModulesData,
  setTotalModules,
} from "../slices/viewCoursesSlice.jsx";

// Mock data array
const items = [
  { icon: "💻", rating: 4.8 },
  { icon: "📱", rating: 4.6 },
  { icon: "🎮", rating: 4.9 },
  { icon: "📚", rating: 4.7 },
  { icon: "🎨", rating: 4.5 },
  { icon: "🎵", rating: 4.8 },
  { icon: "📷", rating: 4.7 },
  { icon: "🎬", rating: 4.6 },
  { icon: "⚡", rating: 4.9 },
  { icon: "🚀", rating: 4.8 },
];

const CourseDetail = () => {
  const { courseName, courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subject, modules, totalModules } = useSelector(
    (state) => state.viewCourse
  );
  console.log("this is odkes" , modules)
  const { signupData } = useSelector((state) => state.auth);
  const googleId = signupData?.googleId;
  const [randomItem] = useState(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  });
  const [isAttempted, setIsAttempted] = useState(false);
  const [attemptedList, setAttemptedList] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedSubModuleId, setSelectedSubModuleId] = useState(null);
  const [allAnalytics, setAllAnalytics] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await apiConnector("GET", `/courses/${courseName}`);
        console.log(response)
        dispatch(setSubjectData(response.data.subject));
        dispatch(setModulesData(response.data.modules));
        dispatch(setTotalModules(response.data.totalModules));
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };

    fetchCourseDetails();
  }, [courseName, dispatch]);

  useEffect(() => {
    const fetchAttemptedSubModules = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `users/attempted-submodule/?googleId=${googleId}&subjectId=${courseId}`
        );
        console.log(response);
        console.log(response.data?.attemptedSubmodules);
        setAttemptedList(() => [...response.data?.attemptedSubmodules]);
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    fetchAttemptedSubModules();
    // console.log(attemptedList, "yeh rha list");
  }, []);
  console.log(attemptedList, "yeh rha list");

  if (!subject || !modules) {
    return (
      <div className="p-6 max-w-4xl mx-auto my-8">
        <p>Loading course details...</p>
      </div>
    );
  }
  // console.log(signupData);
  const getDifficultyStyles = (difficulty) => {
    const styles = {
      hard: "border-red-500 text-red-500 rounded-2xl",
      easy: "border-green-500 text-green-500",
      medium: "border-yellow-500 text-yellow-500",
    };
    return styles[difficulty?.toLowerCase()] || styles.medium;
  };

  const resetQuizData = async (googleId, subModuleId) => {
    try {
      const response = await apiConnector("POST", "/users/reset-quiz", {
        data: { googleId, subModuleId },
      });

      console.log("Quiz data reset:", response.data);
    } catch (error) {
      console.error("Error resetting quiz data:", error);
    }
  };

  const continueHandler = () => {
    //reset logic
    resetQuizData(signupData?.googleId, selectedSubModuleId);
    setConfirmationModal(false); // Close modal after confirming
    if (selectedSubModuleId) {
      navigate(`/course/${subject.id}/${selectedSubModuleId}`); // Navigate to selected submodule
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto my-8">
      {/* Modal with blur effect on background */}
      {confirmationModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          {attemptedList.find((sub) => sub.id == selectedSubModuleId).isCompleted ? <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-xl mb-4">
              Are you sure you want to attempt this quiz?
            </p>
            <p className="mb-6 text-red-500">It will reset your stats.</p>
            <div className="flex justify-between">
              <button
                onClick={continueHandler}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                Attempt
              </button>
              <button
                onClick={() => setConfirmationModal(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div> :
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-xl mb-4">
                Start Again?
              </p>
              <p className="mb-6 text-red-500">Complete previous.</p>
              <div className="flex justify-between">
                <button
                onClick={() => navigate(`/course/${subject.id}/${selectedSubModuleId}`)}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  Attempt
                </button>
                <button
                  onClick={() => setConfirmationModal(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>}
        </div>
      )}

      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">{randomItem.icon}</div>
        <div>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-gray-600 mt-2">{subject.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center">
          <span className="text-yellow-400">⭐</span>
          <span className="ml-1">{randomItem.rating} Rating</span>
        </div>
        <span className="text-gray-500">•</span>
        <span className="text-gray-500">{totalModules} modules</span>
      </div>
      <div className="w-full my-4 border-t-2 mb-8 border-dotted border-gray-500"></div>
      <div className="space-y-8">
        {modules.length === 0 && (
          <p className="text-3xl">No modules found for this course.</p>
        )}
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {moduleIndex + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{module.name}</h3>

                <div className="space-y-3">
                  {module.subModules.length === 0 && (
                    <p className="text-xl">
                      No sub-modules found for this module.
                    </p>
                  )}
                  {module.subModules?.map((subModule, subModuleIndex) => (
                    <div
                      key={subModule.id}
                      className={`${subModule.isPro} flex items-center justify-between bg-white p-3 mt-4 rounded-md hover:shadow-lg shadow-md transition-shadow cursor-pointer`}
                    >
                      <div className="flex items-center gap-2">
                        {/* <div className="w-2 h-2 bg-blue-600 rounded-full"></div> */}
                        {subModule.isPro ? <ImLock /> : <ImUnlocked />}
                        <span className="font-medium">{subModule.name}</span>
                        <span
                          className={`w-16
 justify-center flex text-white font-semibold rounded-2xl text-xs p-1 ml-3 ${subModule.difficulty === "easy"
                              ? "bg-green-500"
                              : subModule.difficulty === "medium"
                                ? "bg-yellow-500"
                                : "bg-red-400"
                            }`}
                        >
                          {subModule.difficulty}
                        </span>
                      </div>
                      {/*  attemptedList.includes{subModule.id} */}
                      {/* Retry Button (Triggers the modal) */}
                      {attemptedList.find((sub) => sub.id == subModule.id) && (
                        <div className="flex items-center gap-3">
                          {attemptedList.find((sub) => sub.id === subModule.id).isCompleted ? <button
                            onClick={() => {
                              setSelectedSubModuleId(subModule.id); // Store the submodule ID
                              setConfirmationModal(true); // Show the modal
                            }}
                          >
                            <div className="bg-blue-800 rounded-xl p-2 text-white">
                              Retry
                            </div>
                          </button> :
                            <button
                              onClick={() => {
                                setSelectedSubModuleId(subModule.id); // Store the submodule ID
                                setConfirmationModal(true); // Show the modal
                              }}
                            >
                              <div className="bg-blue-800 rounded-xl p-2 text-white">
                                Complete
                              </div>
                            </button>
                          }
                          <Link to={`/courses/view-stats/${subModule.id}`}>
                            <div className="bg-blue-800 rounded-xl p-2 text-white">
                              View Stats
                            </div>
                          </Link>
                        </div>
                      )}
                      {!attemptedList.find((sub) => sub.id == subModule.id) && (
                        <div className="flex items-center gap-3">
                          {signupData.isSubscribed === false &&
                            subModule.isPro === true ? (
                            <div
                              onClick={() =>
                                toast.error(
                                  "Take subscription to access content"
                                )
                              }
                              className="bg-blue-800 rounded-xl p-2 text-white cursor-pointer"
                            >
                              Attempt
                            </div>
                          ) : (
                            <Link to={`/course/${subject.id}/${subModule.id}`}>
                              <div className="bg-blue-800 rounded-xl p-2 text-white">
                                Attempt
                              </div>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;


