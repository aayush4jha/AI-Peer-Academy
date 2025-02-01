const Subject = require("../models/Subject");
const Module = require("../models/Module");
const SubModule = require("../models/SubModule");
const Question = require("../models/Question");
const path = require("path");
const mongoose = require("mongoose");
// const { Question, atomic } = require("../models/Question");
const multer = require("multer");
const csv = require("csv-parse");
const fs = require("fs");

// Add a subject
exports.addSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(name,description,"in add subject")
    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Subject name is required" });
    }

    const subject = new Subject({
      name: name.trim(),
      description: description ? description.trim() : undefined,
      modules: [], // Initialize empty modules array
    });
    await subject.save();
    res.status(201).json({ message: "Subject added successfully", subject });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding subject", details: error.message });
  }
};

// Update a subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate ID and required fields
    if (!id) {
      return res.status(400).json({ error: "Subject ID is required" });
    }
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Subject name is required" });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description ? description.trim() : undefined,
      },
      { new: true }
    );
    if (!updatedSubject)
      return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating subject", details: error.message });
  }
};

// Add a module
exports.addModule = async (req, res) => {
  try {
    const { name, subjectId } = req.body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Valid module name is required" });
    }
    if (!subjectId) {
      return res.status(400).json({ error: "Subject ID is required" });
    }

    // Check if subject exists
    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) {
      return res
        .status(404)
        .json({ error: "Subject not found. Please create the subject first" });
    }

    const module = new Module({
      name: name.trim(),
      subjectId,
      subModules: [], // Initialize empty subModules array
    });
    await module.save();
    // Update subject with new module reference
    subjectExists.modules.push(module._id);
    await subjectExists.save();

    res.status(201).json({ message: "Module added successfully", module });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding module", details: error.message });
  }
};

// Add a sub-module
exports.addSubModule = async (req, res) => {
  try {
    const { name, moduleId, isPro, difficulty } = req.body;
    console.log(name, moduleId, isPro, difficulty);
    if (
      !name ||
      typeof name !== "string" ||
      name.trim() === "" ||
      !difficulty
    ) {
      return res
        .status(400)
        .json({ error: "Valid sub-module name is required" });
    }
    if (!moduleId) {
      return res.status(400).json({ error: "Module ID is required" });
    }

    // Check if module exists
    const moduleExists = await Module.findById(moduleId);
    if (!moduleExists) {
      return res
        .status(404)
        .json({ error: "Module not found. Please create the module first" });
    }

    // Create a new SubModule instance
    const subModule = new SubModule({
      name: name.trim(),
      moduleId,
      isPro: Boolean(isPro),
      difficulty,
      questions: [], // Initialize empty questions array
    });
    await subModule.save();

    // Update module with new subModule reference
    moduleExists.subModules.push(subModule._id);
    await moduleExists.save();

    res
      .status(201)
      .json({ message: "Sub-module added successfully", subModule });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding sub-module", details: error.message });
  }
};

// Add a question
exports.addQuestion = async (req, res) => {
  try {
    const { subModuleId, questionText, options } = req.body;

    if (!subModuleId || !questionText || !options) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
      return res.status(404).json({ error: "Sub-module not found" });
    }

    const question = new Question({
      subModuleId,
      questionText: questionText.trim(),
      options: options.map((opt) => ({
        optionText: opt.optionText.trim(),
        isCorrect: Boolean(opt.isCorrect),
      })),
    });

    await question.save();

    // Update subModule with new question reference
    subModule.questions.push(question._id);
    await subModule.save();

    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding question", details: error.message });
  }
};
// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, options, difficulty, subModuleId } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Question ID is required" });
    }

    // Build update object with validation
    const updateData = {};

    if (questionText) {
      if (typeof questionText !== "string" || questionText.trim() === "") {
        return res
          .status(400)
          .json({ error: "Valid question text is required" });
      }
      updateData.questionText = questionText.trim();
    }

    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res
          .status(400)
          .json({ error: "At least two options are required" });
      }
      if (!options.some((opt) => opt.isCorrect)) {
        return res
          .status(400)
          .json({ error: "At least one correct option must be marked" });
      }
      updateData.options = options.map((opt) => ({
        ...opt,
        text: opt.text.trim(),
      }));
    }

    if (difficulty) {
      const validDifficulties = ["easy", "medium", "hard"];
      if (!validDifficulties.includes(difficulty.toLowerCase())) {
        return res.status(400).json({
          error: "Invalid difficulty level. Must be easy, medium, or hard",
        });
      }
      updateData.difficulty = difficulty.toLowerCase();
    }

    if (subModuleId) {
      const subModuleExists = await SubModule.findById(subModuleId);
      if (!subModuleExists) {
        return res.status(404).json({ error: "Sub-module not found" });
      }
      updateData.subModuleId = subModuleId;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedQuestion)
      return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating question", details: error.message });
  }
};

/// Delete subject with cascading delete
exports.deleteSubject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const subject = await Subject.findById(id).session(session);
    if (!subject) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Subject not found" });
    }

    // Delete all related content
    const modules = await Module.find({
      _id: { $in: subject.modules },
    }).session(session);
    const subModuleIds = modules.reduce(
      (acc, module) => [...acc, ...module.subModules],
      []
    );
    const subModules = await SubModule.find({
      _id: { $in: subModuleIds },
    }).session(session);

    // Delete questions
    for (const subModule of subModules) {
      await Question.deleteMany({ _id: { $in: subModule.questions } }).session(
        session
      );
    }

    // Delete submodules
    await SubModule.deleteMany({ _id: { $in: subModuleIds } }).session(session);

    // Delete modules
    await Module.deleteMany({ _id: { $in: subject.modules } }).session(session);

    // Delete subject
    await Subject.findByIdAndDelete(id).session(session);

    await session.commitTransaction();

    res.json({
      message: "Subject and all related content deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ error: "Error deleting subject", details: error.message });
  } finally {
    session.endSession();
  }
};

// Delete a module with cascading delete
exports.deleteModule = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const module = await Module.findById(id).session(session);
    if (!module) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Module not found" });
    }

    // Find the parent subject to update its modules array
    const subject = await Subject.findById(module.subjectId).session(session);
    if (subject) {
      // Remove the module reference from the subject
      subject.modules = subject.modules.filter(
        (moduleId) => moduleId.toString() !== id.toString()
      );
      await subject.save({ session });
    }

    // Delete all questions from all submodules
    for (const subModuleId of module.subModules) {
      const subModule = await SubModule.findById(subModuleId).session(session);
      if (subModule) {
        await Question.deleteMany({
          _id: { $in: subModule.questions },
        }).session(session);
      }
    }

    // Delete all submodules
    await SubModule.deleteMany({
      _id: { $in: module.subModules },
    }).session(session);

    // Delete the module itself
    await Module.findByIdAndDelete(id).session(session);

    await session.commitTransaction();

    res.json({
      message: "Module and all related content deleted successfully",
      deletedData: {
        moduleId: id,
        subModulesCount: module.subModules.length,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      error: "Error deleting module",
      details: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Delete a sub-module with cascading delete
exports.deleteSubModule = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const subModule = await SubModule.findById(id).session(session);
    if (!subModule) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Sub-module not found" });
    }

    // Find the parent module to update its subModules array
    const module = await Module.findById(subModule.moduleId).session(session);
    if (module) {
      // Remove the submodule reference from the module
      module.subModules = module.subModules.filter(
        (subModuleId) => subModuleId.toString() !== id.toString()
      );
      await module.save({ session });
    }

    // Delete all questions associated with this submodule
    await Question.deleteMany({
      _id: { $in: subModule.questions },
    }).session(session);

    // Delete the submodule itself
    await SubModule.findByIdAndDelete(id).session(session);

    await session.commitTransaction();

    res.json({
      message: "Sub-module and all related content deleted successfully",
      deletedData: {
        subModuleId: id,
        questionsCount: subModule.questions.length,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      error: "Error deleting sub-module",
      details: error.message,
    });
  } finally {
    session.endSession();
  }
};
// Delete a question (remains the same as it has no dependencies)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Question ID is required" });
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion)
      return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting question", details: error.message });
  }
};

// Imports remain the same, but ensure mongoose is properly imported

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/json" || file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JSON and CSV files are allowed."));
    }
  },
}).single("file");

// Helper function to process JSON file
const processJSONFile = async (filePath, subModuleId, session) => {
  try {
    const fileData = JSON.parse(await fs.promises.readFile(filePath, "utf8"));
    if (!Array.isArray(fileData.questions)) {
      throw new Error("Invalid JSON format: questions array not found");
    }

    const questions = [];
    let i = 0;
    for (const questionData of fileData.questions) {
      const question = new Question({
        subModuleId,
        questionText: questionData.questionText,
        options: questionData.options.map((opt) => ({
          optionText: opt.optionText,
          isCorrect: Boolean(opt.isCorrect),
        })),
      });
      console.log("questions beech mein = ", questions);
      await question.save({ session });
      questions.push(question._id);
      console.log("questions baad mein= ", questions);
      console.log(i++);
    }

    // Update submodule with questions
    const result = await SubModule.findByIdAndUpdate(
      subModuleId,
      { $push: { questions: { $each: questions } } },
      { session, new: true }
    );
    console.log(result);

    return questions;
  } catch (error) {
    console.log("error", error);
    throw new Error(`Error processing JSON file: ${error.message}`);
  }
};

// Helper function to process CSV file
const processCSVFile = async (filePath, subModuleId, session) => {
  try {
    const questions = [];
    const records = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv.parse({ columns: true, delimiter: "," }))
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });

    for (const record of records) {
      const options = [];
      for (let i = 1; i <= 4; i++) {
        if (record[`option${i}`]) {
          options.push({
            optionText: record[`option${i}`].trim(),
            isCorrect: record[`isCorrect${i}`]?.toLowerCase() === "true",
          });
        }
      }

      const question = new Question({
        subModuleId,
        questionText: record.questionText.trim(),
        options,
      });
      await question.save({ session });
      questions.push(question._id);
    }

    // Update submodule with questions
    await SubModule.findByIdAndUpdate(
      subModuleId,
      { $push: { questions: { $each: questions } } },
      { session, new: true }
    );

    return questions;
  } catch (error) {
    throw new Error(`Error processing CSV file: ${error.message}`);
  }
};

exports.createSubmoduleWithQuestions = async (req, res) => {
  console.log("backend fxn ke andar aaya");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Handle file upload first
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      throw new Error("Question file is required");
    }

    console.log(req.body);
    const { name, moduleId, difficulty } = req.body;
    const isPro = req.body.isPro === "true"; // or 'false'

    // Validate inputs
    if (!name || !moduleId || !difficulty) {
      throw new Error("Missing required fields");
    }

    // Check if module exists

    let moduleExists = null;
    try {
      moduleExists = await Module.findById(moduleId).session(session);
    } catch (err) {
      console.error("Error with session while querying module:", err);
    }
    if (!moduleExists) {
      console.log("Module not found");
      throw new Error("Module not found");
    }

    // Create submodule
    const submodule = new SubModule({
      name: name.trim(),
      moduleId,
      difficulty,
      isPro: Boolean(isPro),
      questions: [],
    });
    await submodule.save({ session });

    // Process questions based on file type
    let questionIds;

    if (req.file.mimetype === "application/json") {
      questionIds = await processJSONFile(
        req.file.path,
        submodule._id,
        session
      );
      console.log("Hello");
      console.log(questionIds);
    } else {
      questionIds = await processCSVFile(req.file.path, submodule._id, session);
    }

    // Update module with new submodule
    moduleExists.subModules.push(submodule._id);
    await moduleExists.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    console.log("path ke baad");
    // Fetch populated submodule
    const populatedSubmodule = await SubModule.findById(submodule._id)
      .populate("questions")
      .lean();

    res.status(201).json({
      message: "Submodule created successfully with questions",
      submodule: populatedSubmodule,
      questionsCount: questionIds.length,
    });
  } catch (error) {
    await session.abortTransaction();

    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Failed to create submodule with questions",
      details: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Get submodule questions
exports.getSubmoduleQuestions = async (req, res) => {
  try {
    const { submoduleId } = req.params;
    console.log("id fetched", submoduleId);
    const submodule = await SubModule.findById(submoduleId).populate(
      "questions"
    );

    if (!submodule) {
      console.log("submodule not found");
      return res.status(404).json({ error: "Submodule not found" });
    }

    res.json({
      submodule: {
        name: submodule.name,
        difficulty: submodule.difficulty,
        isPro: submodule.isPro,
        questions: submodule.questions,
      },
    });
    console.log("chala gya");
  } catch (error) {
    res.status(500).json({
      error: "Error fetching submodule questions",
      details: error.message,
    });
  }
};
