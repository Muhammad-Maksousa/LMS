const InstituteService = require("../services/Institute");
const CredentialService = require("../services/credential");
const JoinRequistsService = require("../services/joinRequists");
const moment = require("moment");
const Roles = require("../helpers/roles");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  responseSender,
  updateResponseSender,
  ResponseSenderWithToken,
} = require("../helpers/wrappers/response-sender");
const { getScholarship } = require("./scholarship");
const CourseService = require("../services/course");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
module.exports = {
  add: async (req, res) => {
    let { body } = req;
    body.role = Roles.Institute;
    const credential = await new CredentialService({ ...body }).add();
    body.credentialId = credential._id;
    if (req.file) body.image = req.file.filename;
    const institute = await new InstituteService({ ...body }).add();
    responseSender(res, institute);
  },
  update: async (req, res) => {
    const { instituteId } = req;
    const body = req.body;
    if (req.body.file) body.image = req.body.file.filename;
    if (body.password || body.email) {
      await new CredentialService({ ...body }).changeCredential(
        institute.credentialId
      );
      //const institute = await new InstituteService({}).getProfile(instituteId);
    }
    const updatedInstitute = await new InstituteService({ ...body }).update(
      instituteId,
      body
    );
    updateResponseSender(res, "institute");
  },
  login: async (req, res) => {
    const { body } = req;
    const credential = await new CredentialService({ ...body }).login();
    const user = await new InstituteService({}).login(credential);
    ResponseSenderWithToken(res, user.info, user.token);
  },
  getProfile: async (req, res) => {
    const { instituteId } = req.params;
    const institute = await new InstituteService({}).getProfile(instituteId);
    responseSender(res, institute);
  },
  getAll: async (req, res) => {
    const institute = await new InstituteService({}).getAll();
    responseSender(res, institute);
  },
  acceptTeacherByAdmin: async (req, res) => {
    const { body } = req;
    const { instituteId } = req;
    body.startDate = moment(body.startDate, "DD/MM/YYYY");
    body.endDate = moment(body.endDate, "DD/MM/YYYY");
    const resulte = await new InstituteService({}).acceptTeacher(
      instituteId,
      body.teacherId,
      body.startDate,
      body.endDate
    );
    await new JoinRequistsService({}).removeTeacherToInstituteRequist(
      instituteId,
      body.teacherId
    );
    responseSender(res, resulte);
  },
  rejectTeacherByAdmin:async(req,res)=>{
    const {instituteId} = req
    const teacherId = req.body.teacherId
    const message = req.body.message
    await new InstituteService({}).rejectTeacher(instituteId,teacherId,message)
    await new JoinRequistsService({}).removeTeacherToInstituteRequist(instituteId,teacherId)
    responseSender(res,"the teacher reject successfully")
  },
  teacherToinstituteRequists: async (req, res) => {
    const { instituteId } = req;
    const resulte = await new JoinRequistsService(
      {}
    ).getTeacherToInstituteRequists(instituteId);
    responseSender(res, resulte);
  },
  getMyTeachers: async (req, res) => {
    const { instituteId } = req;
    const resulte = await new InstituteService({}).getMyTeachers(instituteId);
    responseSender(res, resulte);
  },
  getScholarshipRequests: async (req, res) => {
    const { instituteId } = req;
    const scholarshipId = req.params.id;
    const convertedInstituteId = instituteId.toString();
    const resulte = await new JoinRequistsService({}).getScholarshipRequests(
      convertedInstituteId,
      scholarshipId
    );
    responseSender(res, resulte);
  },
  approvOrRejecut: async (req, res) => {
    const { instituteId } = req;
    const scholarshipId = req.params.id;
    const userId = req.body.userId;
    const approve = req.body.approve;
    const convertedInstituteId = instituteId.toString();
    const message = req.body.message||null;
    const isApprove = await new InstituteService({}).acceptScholarshipStudenet(
      convertedInstituteId,
      scholarshipId,
      userId,
      approve,
      message
    );
    await new JoinRequistsService({}).remveUserToInstituteByGrant(
      convertedInstituteId,
      scholarshipId,
      userId
    );
    if (isApprove === 1)
      responseSender(res, "the student add to insitute successfully");
    else if (isApprove === 0)
      responseSender(res, "the join Request Rejected successfully ");
    else if (isApprove === 2)
      responseSender(res, "the student already member in institute");
  },
  deleteScholarshipStudent: async (req, res) => {
    const { instituteId } = req;
    const usersId = req.body.usersId;
    await new InstituteService({}).removeScholarshipStudent(
      instituteId,
      usersId
    );
    responseSender(res, " the student remove successfully");
  },
  addMyStudent: async (req, res) => {
    const { instituteId } = req;
    const usersId = req.body.usersId;
    const result = await new InstituteService({}).addMystudent(
      instituteId,
      usersId
    );
    if (result) responseSender(res, "the student added successfully");
    else responseSender(res, "the student already member in institute");
  },
  deleteMyStudent: async (req, res) => {
    const { instituteId } = req;
    const usersId = req.body.usersId;
    await new InstituteService({}).deleteMyStudent(instituteId, usersId);
    responseSender(res, "the student remove successfully");
  },
  deleteSubscripStudent: async (req, res) => {
    const { instituteId } = req;
    const usersId = req.body.usersId;
    await new InstituteService({}).deleteSubscripStudent(instituteId, usersId);
    responseSender(res, "the student remove successfully");
  },
  acceptCourse: async (req, res) => {
    const { instituteId } = req;
    const { body } = req;
    const updatedCourse = await new CourseService({}).changeStatus(
      body.courseId,
      body.status
    );
    await new JoinRequistsService({}).removeCourseToInstituteRequist(
      instituteId,
      body.courseId
    );
    responseSender(res, updatedCourse);
  },
  rejectCourse:async (req,res)=>{
    const { instituteId } = req;
    const { body } = req;
    const updatedCourse = await new CourseService({}).changeStatus(body.courseId,body.status);
    await new JoinRequistsService({}).removeCourseToInstituteRequist(instituteId, body.courseId);
    //send feedback to teacher
    responseSender(res, updatedCourse);
  },
  getAllCoursesRequists:async (req,res)=>{
    const {instituteId} = req;
    const requists = await new JoinRequistsService({}).getAllCoursesRequists(instituteId);
    responseSender(res,requists);
  }
};
