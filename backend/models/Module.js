const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  subModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubModule",
    },
  ],
});

module.exports = mongoose.model("Module", moduleSchema);
