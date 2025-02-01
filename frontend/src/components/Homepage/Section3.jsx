import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

function Section3() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      text: "The online quiz module is excellent for both learning and practicing, providing clear and in-depth understanding of quiz concepts. It surpasses traditional learning methods.",
      name: "Mohammad Abdul Hamid Khan",
      username: "hamidkhan18",
      location: "India",
      rating: 4,
      image: "/path/to/avatar1.jpg",
    },
    {
      text: "QuizMaster Pro offers a wide range of practice questions and conducts exceptional quizzes. I am grateful to the entire team for their efforts and contributions.",
      name: "Anmol Vishwakarma",
      username: "anmol_6265",
      location: "India",
      rating: 5,
      image: "/path/to/avatar2.jpg",
    },
    {
      text: "I love quizzing, and I'm always searching for the best way to learn. QuizMaster Pro is absolutely amazing and I really enjoyed using it.",
      name: "Dhanushree",
      username: "dhanushree",
      location: "India",
      rating: 5,
      image: "/path/to/avatar3.jpg",
    },
    {
      text: "The practice quizzes are well-designed and help in understanding core concepts thoroughly.",
      name: "Rahul Sharma",
      username: "rahul_dev",
      location: "India",
      rating: 5,
      image: "/path/to/avatar4.jpg",
    },
    {
      text: "Great platform for improving problem-solving skills. The community is very supportive.",
      name: "Priya Patel",
      username: "priya_codes",
      location: "India",
      rating: 4,
      image: "/path/to/avatar5.jpg",
    },
    {
      text: "The interactive interface makes learning enjoyable. Highly recommended for beginners.",
      name: "Arjun Kumar",
      username: "arjun_k",
      location: "India",
      rating: 5,
      image: "/path/to/avatar6.jpg",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Over 1Lakhs+ Learners
          </h2>
          <p className="text-slate-600 text-lg">
            Our learners benefit from our rich repository of courses and
            practice problems every day.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
            >
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="min-w-[calc(33.33%-1rem)] bg-white rounded-xl shadow-lg p-6 flex flex-col"
                >
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < item.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 flex-grow">{item.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.username}
                      </p>
                      <p className="text-sm text-slate-600">{item.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Section3;
