const { duration } = require("moment");
const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "the course must hava name"],
  },
  rate: {
    type: Number,
  },
  cost: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, "the course must have duration"],
  },
  language: {
    type: [String],
    required: true,
    enum: {
      values: ["English", "Spanish", "French", "German", "Arabic"],
      message: '({VALUE}) is not valid language',
    },
  },
  Education_Level: {
    type: String,
    default: "for any one",
    enum: {
      values: [
        "Elementary",
        "Secondary",
        "High level",
        "Beginner",
        "Intermediate",
        "Advanced",
        "for any one",
      ],
      message: '({VALUE}) is not valid for Education_Level just this values is true: 1- Elementary 2- Secondary 3- High level 4- Beginner 5- Intermediate 6- Advanced'
    },
  },
  Teacher_ID: {
    type: Number,
  },
  Categories: {
    type: String,
  },
  plan: Array,
  subtitle: {
    type: String,
  },
  managment: String,
  what_you_will_learn: String,
  Image: String,
});
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
