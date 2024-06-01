const mongoose = require("mongoose");
const quizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  qustions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
  mark: {
    type: Number,
    default: 100,
  },
});
const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
