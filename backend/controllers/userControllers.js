const Question = require("../models/Question");
const Analytics = require("../models/Analytics");

// const Analytics = require("../models/Analytics");
const mongoose = require("mongoose");
exports.resetQuiz = async (req, res) => {
  try {
    console.log("reset ke andar aa gya");
    const { googleId, subModuleId } = req.body.data;
    console.log(req.body);
    console.log(googleId, subModuleId, " in reset quiz");
    if (!googleId || !subModuleId) {
      return res
        .status(400)
        .json({ message: "Missing googleId or subModuleId" });
    }

    // Find the analytics data by googleId and subModuleId
    const analytics = await Analytics.findOne({ googleId, subModuleId });
    console.log("data mil gya");

    if (!analytics) {
      return res.status(404).json({ message: "Analytics data not found" });
    }

    // Delete the analytics data
    await Analytics.deleteOne({ googleId, subModuleId });
    console.log("data delete ho gya");

    res.status(200).json({ message: "Quiz data has been reset successfully" });
  } catch (error) {
    console.error("Error resetting quiz data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAttemptedSubModules = async (req, res) => {
  try {
    const { googleId, subjectId } = req.query;
    console.log(googleId, subjectId, " in get attempted submodules");
    if (!googleId || !subjectId) {
      return res.status(400).json({ message: "Missing googleId or subjectId" });
    }
    // Find the analytics data by googleId and subjectId
    const analytics = await Analytics.find({ googleId, subjectId });
    console.log("data mil gya");
    // if (!analytics) {
    //   return res.status(404).json({ message: "Analytics data not found" });
    //   }
    // Get the attempted submodules from the analytics data
    attemptedSubmodules = [];
    analytics.forEach((data) => {
      attemptedSubmodules.push(data.subModuleId);
    });
    console.log("attempted submodules mil gya");
    res.status(200).json({ attemptedSubmodules });
  } catch (error) {
    console.log("error in fetching attempted subModules", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAnalyticsData = async (req, res) => {
  try {
    const { googleId, subModuleId } = req.query; // Access query parameters
    console.log("Google ID: in get analytics dadta", googleId);
    console.log("Submodule ID:", subModuleId);

    // Validate input
    if (!googleId || !subModuleId) {
      console.log(googleId, subModuleId, " get analytics ke andar");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the analytics data
    const analyticsData = await Analytics.findOne({
      googleId,
      subModuleId: new mongoose.Types.ObjectId(subModuleId),
    }).populate("questionAnswers.questionId"); // Populate question details

    if (!analyticsData) {
      return res.status(404).json({ message: "No analytics data found" });
    }

    const {
      correctAnswers,
      incorrectAnswers,
      totalTimeSpent,
      questionAnswers,
    } = analyticsData;

    // Classification of questions
    const ok = [];
    const bad = [];
    const important = [];
    const common = [];

    questionAnswers.forEach((qa) => {
      const { questionId, isCorrect, tag, notes } = qa;
      console.log(notes, "quetion loop ke andar hai ji");
      // Classification logic (adjust thresholds as needed)
      if (tag == "ok") {
        ok.push({ questionId, notes });
      } else if (tag == "bad") {
        bad.push({ questionId, notes });
      } else if (tag == "important") {
        important.push({ questionId, notes });
      }
      if (notes) {
        common.push({ questionId: questionId, notes: notes });
      }
    });

    // Prepare the response
    const responseData = {
      stats: {
        totalQuestions: questionAnswers.length,
        correctAnswers,
        incorrectAnswers,
        totalTimeSpent,
      },
      questionClassification: {
        ok,
        bad,
        important,
        common,
      },
    };
    console.log(responseData);

    // Send response
    res.json({
      responseData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/// Controller function to handle analytics submission
exports.submitAnalytics = async (req, res) => {
  try {
    const {
      googleId,
      subjectId,
      subModuleId,
      tagCounts,
      questionAnswers,
      totalTimeSpent,
      correctAnswers,
      incorrectAnswers,
      progress,
    } = req.body;

    // Basic validation
    if (!googleId || !subModuleId || !questionAnswers || !subjectId) {
      // console.log("Missing required fields:", googleId, subModuleId);
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new analytics document
    const analyticsData = new Analytics({
      googleId,
      subjectId,
      subModuleId: new mongoose.Types.ObjectId(subModuleId), // Fix here
      tagCounts,
      questionAnswers,
      totalTimeSpent,
      correctAnswers,
      incorrectAnswers,
      progress,
      updatedAt: new Date(),
    });

    // Save the analytics data to the database
    await analyticsData.save();
    // console.log("Analytics data saved successfully:", analyticsData);

    // Respond with success
    res.status(200).json({
      message: "Analytics data submitted successfully",
      data: analyticsData,
    });
  } catch (error) {
    // Error handling
    console.error("Error submitting analytics data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Fetch questions for a submodule
exports.getSubmoduleQuestions = async (req, res) => {
  try {
    const { id } = req.params; // Submodule ID
    const questions = await Question.find({ subModuleId: id });
    if (questions.length === 0)
      return res
        .status(404)
        .json({ error: "No questions found for this submodule" });

    res.json({ questions });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching questions", details: error.message });
  }
};

// Submit an answer for a question
exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params; // Question ID
    const { userId, subModuleId, userAnswer } = req.body;

    // Find or create analytics record
    let analytics = await Analytics.findOne({ userId, subModuleId });
    if (!analytics) {
      analytics = new Analytics({ userId, subModuleId, questionAnswers: [] });
    }

    // Update or add question answer
    const existingAnswer = analytics.questionAnswers.find(
      (q) => q.questionId.toString() === id
    );
    if (existingAnswer) {
      existingAnswer.userAnswer = userAnswer;
    } else {
      analytics.questionAnswers.push({ questionId: id, userAnswer });
    }

    await analytics.save();
    res.json({ message: "Answer submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error submitting answer", details: error.message });
  }
};

// Add a note to a question
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params; // Question ID
    const { userId, subModuleId, note } = req.body;

    let analytics = await Analytics.findOne({ userId, subModuleId });
    if (!analytics)
      return res.status(404).json({ error: "Analytics record not found" });

    const questionAnswer = analytics.questionAnswers.find(
      (q) => q.questionId.toString() === id
    );
    if (!questionAnswer)
      return res.status(404).json({ error: "Question not found in analytics" });

    questionAnswer.notes = note;

    await analytics.save();
    res.json({ message: "Note added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding note", details: error.message });
  }
};

// Add a tag to a question
exports.addTag = async (req, res) => {
  try {
    const { id } = req.params; // Question ID
    const { userId, subModuleId, tag } = req.body;

    let analytics = await Analytics.findOne({ userId, subModuleId });
    if (!analytics)
      return res.status(404).json({ error: "Analytics record not found" });

    const questionAnswer = analytics.questionAnswers.find(
      (q) => q.questionId.toString() === id
    );
    if (!questionAnswer)
      return res.status(404).json({ error: "Question not found in analytics" });

    questionAnswer.tags = tag;

    await analytics.save();
    res.json({ message: "Tag added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding tag", details: error.message });
  }
};

// // Get user analytics
// exports.getUserAnalytics = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const analytics = await Analytics.find({ userId }).populate(
//       "subModuleId questionAnswers.questionId"
//     );
//     res.json({ analytics });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching analytics", details: error.message });
//   }
// };
