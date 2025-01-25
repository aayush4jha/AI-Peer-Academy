const express = require("express");
const adminController = require("../controllers/adminControllers");
const router = express.Router();

router.post("/subjects", adminController.addSubject);
router.put("/subjects/:id", adminController.updateSubject);
router.delete("/subjects/:id", adminController.deleteSubject);

router.post("/modules", adminController.addModule);
// router.put("/modules/:id", adminController.updateModule);
router.delete("/modules/:id", adminController.deleteModule);

router.post("/sub-modules", adminController.addSubModule);
// router.put("/sub-modules/:id", adminController.updateSubModule);
router.delete("/sub-modules/:id", adminController.deleteSubModule);

router.post("/questions", adminController.addQuestion);
router.put("/questions/:id", adminController.updateQuestion);
router.delete("/questions/:id", adminController.deleteQuestion);

// Route to create submodule with questions
// router.post(
//   "/modules/:moduleId/submodules",
//   adminController.createSubmoduleWithQuestions
// );
// File upload route for creating submodule with questions
router.post("/submodules/upload", adminController.createSubmoduleWithQuestions);

// Route to get questions for a submodule
router.get("/submodules/:submoduleId", adminController.getSubmoduleQuestions);

// router.get("/analytics", adminController.getAllAnalytics);

module.exports = router;
