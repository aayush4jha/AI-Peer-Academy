import React from "react";
import { FaGoogle } from "react-icons/fa";
import GoogleSignInButton from "../GoogleSignInButton.jsx";

function Section1() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email subscription
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
              Test your skills with interactive quizzes
            </h1>
            <p className="text-lg text-slate-600">
              Challenge yourself with our practice-oriented quiz platform
              designed by subject matter experts. Perfect for self-assessment
              and learning.
            </p>

            {/* Email Subscription Form */}
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="flex flex-col sm:flex-row gap-3 mt-12">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  Subscribe ⚡
                </button>
              </div>
            </form>

            {/* Sign in with Google */}
            <div className="gap-6 flex">
              <p className="text-slate-600">or sign up with</p>

              <GoogleSignInButton />
            </div>
          </div>

          {/* Right Image Section - Placeholder */}
          <div className="hidden lg:block">
            {/* Image space - You can add your image here */}
            <div className="aspect-square w-full max-w-lg ml-auto">
              <img
                src="../../../images/vectorImg1.jpg"
                alt=""
                className="rounded-full scale-125 mt-16 -skew-x-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section1;
