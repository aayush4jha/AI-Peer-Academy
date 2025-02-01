// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   subModuleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SubModule",
//     required: true,
//   },
//   questionText: { type: String, required: true },
//   options: [
//     {
//       optionText: { type: String, required: true },
//       isCorrect: { type: Boolean, default: false },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Question", questionSchema);

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      optionText: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
// const questionSchema = new mongoose.Schema({
//   subModuleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SubModule",
//     required: true,
//   },
//   questions: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "atomic", // Reference to the Question model
//     },
//   ], // An array of ObjectIds referencing questions
// });

// module.exports = {
//   Question: mongoose.model("Question", questionSchema),
//   atomic: mongoose.model("atomic", question),
// };

module.exports = mongoose.model("Question", questionSchema);
