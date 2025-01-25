import React from "react";

function Section2() {
  return (
    <div className="bg-slate-900 text-white py-20">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <p className="text-blue-400">Assessment Platform</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Comprehensive Quiz Topics
            </h2>
            <p className="text-slate-300 text-lg">
              From basic concepts to advanced problems, our platform offers
              quizzes that match industry standards, helping you assess and
              improve your knowledge from beginner to expert level.
            </p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Browse Tests
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Placeholder for your quiz catalog screenshot */}
            <div className="aspect-[4/3] w-full">
              <img src="../../../images/img1.png" alt="" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Placeholder for your quiz interface screenshot */}
            <img src="../../../images/img2.png" alt="" />
            <div className=" w-full"></div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <p className="text-blue-400">In Browser Testing</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Interactive Testing Experience
            </h2>
            <p className="text-slate-300 text-lg">
              Take quizzes directly in your browser with our integrated testing
              interface. Each quiz is crafted with instant feedback and detailed
              explanations to help you understand your performance better.
            </p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Try a quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section2;
