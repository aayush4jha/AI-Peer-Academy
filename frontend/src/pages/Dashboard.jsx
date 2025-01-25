import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnectors.jsx";
import { Link } from "react-router-dom";
import {
  setCourseData,
  setTotalNoOfSubjects,
} from "../slices/subjectsSlice.jsx";

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courseData, totalNoOfSubjects } = useSelector(
    (state) => state.viewSubject
  );

  const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnector("GET", "/dashboard");
        dispatch(setCourseData(response.data.subjects));
        dispatch(setTotalNoOfSubjects(response.data.totalSubjects));
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="p-6 max-w-7xl mx-auto my-12">
      <h1 className="text-3xl font-bold mb-4">All Quizzes Catalog</h1>
      <p className="text-gray-600 mb-8">
        Explore our collection of interactive quizzes designed to test and
        improve your knowledge. Choose a topic and start challenging yourself
        today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {courseData?.map((course) => {
          const randomItem = getRandomItem();
          const path = `/courses/${course.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${course._id}`;

          return (
            <div
              key={course._id}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{randomItem.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1 text-sm">{randomItem.rating}</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {course.modules?.length || 0} modules
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <Link
                to={path}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center group"
              >
                View Details
                <span className="transform transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              {/* <Route path="/courses/:courseName" element={<CourseDetails />} /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
