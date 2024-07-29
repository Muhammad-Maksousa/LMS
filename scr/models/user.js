const Course = require("./../models/course");
const mongoose = require("mongoose");
const courseProgressSchema = new mongoose.Schema({
  courseID: mongoose.Types.ObjectId,
  done: [mongoose.Types.ObjectId],
  doneModel: {
    type: [String],
    enum: ["Video", "Article", "Quiz"]
  },
  percent: Number,
},{_id:false});
module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      credentialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "credential",
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
      },
      birthDate: {
        type: Date,
        required: false,
      },
      finishedCourses: {
        type: Array,
        ref: "Course",
      },
      enrolledCourses: {
        type: Array,
        ref: "Course",
      },
      wishlist: {
        type: Array,
        ref: "Course",
      },
      progress: [courseProgressSchema],
      wallet: {
        type: Number,
        required: false,
        default:0
    },
  },
    {
      timestamps: true,
      strictPopulate: false,
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  module.exports = User;
};
