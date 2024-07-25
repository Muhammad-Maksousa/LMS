const responseSender = require("../helpers/wrappers/response-sender");
const Course = require("./../models/course");
const CourseService = require("../services/course");
const ApiFeatuers = require("./../services/ApiFeatuers");
module.exports = {
  getAllCourse: async (req, res) => {
    const featuers = new ApiFeatuers(Course.find().populate('video').populate('article').populate('quiz'), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();
    const courses = await featuers.query;
    console.log("COurses found", courses);
    res.status(200).json({
      status: "success",
      result: courses.length,
      data: {
        courses,
      },
    });
  },
  getCourse: async (req, res) => {
    const course = await Course.findById(req.params.id).populate('video').populate('article').populate('quiz');
    res.status(200).json({
      status: "sucsess",
      data: {
        course,
      },
    });
  },
  createCourse: async (req, res) => {
    const newCourse = await Course.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newCourse,
      },
    });
  },
  deleteCourse: async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "sucsess",
      data: null,
    });
  },
  updateCourse: async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValdiators: true,
    });
    res.status(200).json({
      status: "sucsess",
      data: { course },
    });
  },
  getAllCoursesByTeacherId:async (req,res)=>{
    const { teacherId } = req.params;
    const courses = await new CourseService({}).getAllCoursesByTeacherId(teacherId);
    responseSender(res,courses);
  }
};
