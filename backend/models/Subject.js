const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],
});

module.exports = mongoose.model("Subject", subjectSchema);
