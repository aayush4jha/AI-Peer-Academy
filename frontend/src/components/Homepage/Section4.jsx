import React from "react";
import { FaBolt } from "react-icons/fa";

function Section4() {
  const courses = [
    { id: 1, title: "Module1", icon: "🗃️", level: "Beginner" },
    { id: 2, title: "Module2", icon: "🐍", level: "Beginner" },
    { id: 3, title: "Module3", icon: "☕", level: "Intermediate" },
    { id: 4, title: "Module4", icon: "⚡", level: "Advanced" },
    { id: 5, title: "Module5", icon: "🔍", level: "Intermediate" },
    { id: 6, title: "Module6", icon: "🌐", level: "Beginner" },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Attempt you first quiz with us ✨
          </h2>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
            Start learning today <FaBolt />
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
            >
              <div className="text-3xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {course.title}
              </h3>
              <p className="text-slate-600">{course.level}</p>
            </div>
          ))}
        </div>

        {/* Pro Section */}
        <div className="bg-orange-50 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                Get QuizMaster Pro
              </h2>
              <p className="text-slate-600 mb-6">
                Launch Your QuizMaster Pro Create interactive quizzes and gain
                insights from real-world data with Pro subscription. Unlock
                exclusive features today!
              </p>
              <button className="bg-orange-950 text-white font-semibold px-6 py-3 rounded-lg hover:bg-brown-700 transition-colors mt-6">
                Go Pro
              </button>
            </div>
            <div className="hidden md:block">
              {/* Space for your illustration */}
              <div className="  bg-orange-100 rounded-xl">
                <img src="../../../images/proPic.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section4;
