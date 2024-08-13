const {
  responseSender,
  updateResponseSender,
  ResponseSenderWithToken,
} = require("../helpers/wrappers/response-sender");
const Course = require("./../models/course");
const CourseService = require("../services/course");
const JoinRequistsService = require("../services/joinRequists");
const ApiFeatuers = require("./../services/ApiFeatuers");
module.exports = {
  getAllCourse: async (req, res) => {
    const featuers = new ApiFeatuers(
      Course.find({ $or: [{ status: "public" }, { status: "private" }] })
        .populate("video")
        .populate("article")
        .populate("quiz"),
      req.query
    )
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
    const course = await Course.findById(req.params.id)
      .populate("video")
      .populate("article")
      .populate("quiz");
    res.status(200).json({
      status: "sucsess",
      data: {
        course,
      },
    });
  },
  createCourse: async (req, res) => {
    let { body } = req;
    const { teacherId } = req;
    body.Teacher_ID = [teacherId];
    let newCourse = await Course.create(req.body);
    if (body.instituteId) {
      await new JoinRequistsService({}).addCourse(
        teacherId,
        body.instituteId,
        newCourse.id
      );
      newCourse = await Course.findByIdAndUpdate(
        newCourse.id,
        { status: "pending" },
        { new: true }
      );
    }
    responseSender(res, newCourse);
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
  getAllCoursesByTeacherId: async (req, res) => {
    const { teacherId } = req.params;
    const courses = await new CourseService({}).getAllCoursesByTeacherId(
      teacherId
    );
    responseSender(res, courses);
  },
  getAllUsersOfCourse: async (req, res) => {
    const { id } = req.params;
    const users = await new CourseService({}).getAllUsersOfCourse(id);
    responseSender(res, users);
  },
  getAllCousreByInstitute: async (req, res) => {
    const instituteId = req.params.id;
    const result = await new CourseService({}).getInstituteCourse(instituteId);
    res.status(200).json({
      status: "success",
      data: { result },
    });
  },
};
