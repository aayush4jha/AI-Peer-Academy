// Modify the existing checkAnswer method
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
  
  // Modify the fetchAttemptedSubModules useEffect to handle incorrect questions
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
          
          setAnswers(() => {
            const pastAnswers = {};
            userResponses.forEach((answer, index) => {
              if(answer.userAnswer) {
                pastAnswers[answer.questionId._id] = {
                  optionId: answer.userAnswer,
                  isCorrect: answer.isCorrect,
                  attempts: 1 // Track attempts
                };
                
                // If the answer was incorrect, keep track of it
                if (!answer.isCorrect) {
                  lastIndex = index; // Set to the last incorrect question
                }
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
          
          // Prioritize returning to incorrect questions
          const incorrectQuestionIndices = data.reduce((acc, question, index) => {
            if (!answers[question._id]?.isCorrect) {
              acc.push(index);
            }
            return acc;
          }, []);
  
          // If there are incorrect questions, start from the first incorrect question
          if (incorrectQuestionIndices.length > 0) {
            setCurrentQuestionIndex(incorrectQuestionIndices[0]);
          } else {
            setLastAttemptedIndex(lastIndex);
            setCurrentQuestionIndex(lastIndex);
          }
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    fetchAttemptedSubModules();
  }, []);
  
  // Modify QuestionGrid to show number of attempts
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
            let bgColor = "bg-blue-500" // Unattempted
            let attempts = 0;
  
            if (isAnswered) {
              bgColor = isAnswered.isCorrect ? "bg-green-500" : "bg-red-500";
              attempts = isAnswered.attempts || 0;
            }
  
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
                  className={`w-10 h-10 ${bgColor} text-white rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity`}
                >
                  {index + 1}
                </button>
                {attempts > 0 && (
                  <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {attempts}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {/* Rest of the component remains the same */}
      </div>
    );
  };