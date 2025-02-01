// courseControllers.js
const Subject = require("../models/Subject");
const Module = require("../models/Module");
const SubModule = require("../models/SubModule");
const Question = require("../models/Question");
const mongoose = require("mongoose");

/**
 * Get all subjects for the dashboard with optional search.
 */
exports.getSubjects = async (req, res) => {
  try {
    const { search } = req.query;

    // Build query for optional search
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Fetch all subjects at once
    //filter user query wala variable
    const subjects = await Subject.find().sort({
      name: 1,
    });

    res.json({
      subjects,
      totalSubjects: subjects.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch subjects",
      details: error.message,
    });
  }
};

exports.getSubModules = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ error: "Valid key is required" });
    }
    const subModules = await SubModule.find({ moduleId: key });
    if (!subModules) {
      return res.status(404).json({ error: "No sub-modules for this module" });
    }
    res.json({
      subModules,
      totalSubModules: subModules?.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch submodules",
      details: error.message,
    });
  }
};

exports.getModulesAndSubModules = async (req, res) => {
  try {
    const { subjectName } = req.params;

    // Validate subject name
    if (!subjectName || typeof subjectName !== "string") {
      return res.status(400).json({ error: "Valid subject name is required" });
    }

    // Find the subject by name (Exact match using regex)
    const subject = await Subject.findOne(
      { name: { $regex: new RegExp(`^${subjectName}$`, "i") } },
      "_id name description modules"
    ).populate({
      path: "modules",
      select: "_id name subModules ",
      populate: {
        path: "subModules",
        select: "_id name isPro questions difficulty",
      },
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const modulesWithSubModules = await Promise.all(
      subject.modules.map(async (module) => {
        const subModulesWithCounts = await Promise.all(
          module.subModules.map(async (subModule) => {
            // console.log(subModule);
            const questionCount = subModule.questions?.length || 0;
            return {
              id: subModule._id,
              name: subModule.name,
              isPro: subModule.isPro,
              difficulty: subModule.difficulty,
              questionCount,
            };
          })
        );

        return {
          name: module.name,
          id: module._id, // Include the module id
          subModules: subModulesWithCounts,
          totalSubModules: subModulesWithCounts.length,
        };
      })
    );

    res.json({
      subject: {
        id: subject._id,
        name: subject.name,
        description: subject.description,
      },
      modules: modulesWithSubModules,
      totalModules: subject.modules.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch modules and submodules",
      details: error.message,
    });
  }
};

/**
 * Get questions for a specific submodule with cursor-based pagination.
 */
exports.getQuestions = async (req, res) => {
  try {
    const { subjectName, subModuleId } = req.params;
    const { difficulty, lastQuestionId, limit = 10 } = req.query;

    // Validate subject name
    const subject = await Subject.findOne({
      name: { $regex: new RegExp(`^${subjectName}$`, "i") }, // Exact match regex
    });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Validate submodule ID
    if (!mongoose.Types.ObjectId.isValid(subModuleId)) {
      return res.status(400).json({ error: "Invalid submodule ID" });
    }

    // Find submodule and validate it belongs to a module under the subject
    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
      return res.status(404).json({ error: "Submodule not found" });
    }

    const module = await Module.findOne({
      _id: subModule.moduleId,
      subjectId: subject._id,
    });
    if (!module) {
      return res.status(404).json({
        error: "Submodule does not belong to the specified subject",
      });
    }

    // Build base query
    let query = { subModuleId };
    if (difficulty) {
      query.difficulty = difficulty.toLowerCase();
    }
    if (lastQuestionId) {
      query._id = { $gt: lastQuestionId };
    }

    // Validate limit
    const limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ error: "Invalid limit number" });
    }

    // Fetch questions using cursor-based pagination
    const questions = await Question.find(query)
      .select("questionText options difficulty")
      .sort({ _id: 1 })
      .limit(limitNumber + 1);

    const hasMore = questions.length > limitNumber;
    const finalQuestions = questions.slice(0, limitNumber);
    const lastQuestion = finalQuestions[finalQuestions.length - 1];
    const nextCursor = hasMore ? lastQuestion._id : null;

    const totalQuestions = await Question.countDocuments({ subModuleId });

    res.json({
      subModule: {
        id: subModule._id,
        name: subModule.name,
        isPro: subModule.isPro,
      },
      questions: finalQuestions,
      pagination: {
        hasMore,
        nextCursor,
        totalQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch questions",
      details: error.message,
    });
  }
};
