const CredentialService = require("../services/credential");
const UserService = require("../services/user");
const CourseService = require("../services/course");
const InstituteService = require("../services/Institute");
const TeacherService = require("../services/teacher");
const AdminService = require("../services/admin")
const {
  responseSender,
  updateResponseSender,
  ResponseSenderWithToken,
} = require("../helpers/wrappers/response-sender");
const moment = require("moment");
const User = require("../models/user");
const Course = require("../models/course");
const JoinRequistsService = require("../services/joinRequists");
module.exports = {
  add: async (req, res) => {
    const { body } = req;
    const credential = await new CredentialService({ ...body }).add();
    body.credentialId = credential._id;
    if (req.file) body.image = req.file.filename;
    if (body.birthDate) body.birthDate = moment(body.birthDate, "DD/MM/YYYY");
    const user = await new UserService({ ...body }).add();
    responseSender(res, user);
  },
  update: async (req, res) => {
    const { id: UserId } = req.params;
    const { body } = req;
    if (req.file) body.image = req.file.filename;
    if (body.password || body.email) {
      const user = await new UserService({}).getProfile(UserId);
      await new CredentialService(body).changeCredential(user.credentialId);
    }
    const updateedUser = await new UserService(body).update(UserId, body);
    updateResponseSender(res, "User");
  },
  login: async (req, res) => {
    const { body } = req;
    const credential = await new CredentialService({ ...body }).login();
    const user = await new UserService({}).login(credential);
    ResponseSenderWithToken(res, user.info, user.token);
  },
  enroll: async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req;
    const course = await new CourseService({}).getById(courseId);
    let user=1;
    if (course.instituteId) {
      const UserexistInInstitute = await new UserService({}).isMyInstitute(userId, course.instituteId);
      if (UserexistInInstitute)
        user = await new UserService({}).enroll(courseId, userId, 0);
      else
        user = await new UserService({}).enroll(courseId, userId, course.cost);
      await new InstituteService({}).updateWallet(course.instituteId, course.cost*(40/100));
      await new TeacherService({}).updateWallet(course.Teacher_ID[0], course.cost*(20/100));
      await new AdminService({}).updateWallet(course.cost*(40/100));
    } else {
      user = await new UserService({}).enroll(courseId, userId, course.cost);
      await new TeacherService({}).updateWallet(course.Teacher_ID[0], course.cost *(40/100));
      await new AdminService({}).updateWallet(course.cost*(60/100));
    }
    responseSender(res, user);
  },
  getMyEnrolledCourses: async (req, res) => {
    const { userId } = req;
    const enrolledCourses = await new UserService({}).getMyEnrolledCourses(
      userId
    );
    responseSender(res, enrolledCourses);
  },
  finishedCourse: async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req;
    const user = await new UserService({}).finishCourse(courseId, userId);
    responseSender(res, user);
  },
  getMyFinishedCourses: async (req, res) => {
    const { userId } = req;
    const finishedCourses = await new UserService({}).getMyFinishedCourses(
      userId
    );
    responseSender(res, finishedCourses);
  },
  getProfile: async (req, res) => {
    const { userId } = req;
    const user = await new UserService({}).getProfile(userId);
    responseSender(res, user);
  },
  addToWishList: async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req;
    const wishlist = await new UserService({}).addToWishList(userId, courseId);
    responseSender(res, wishlist);
  },
  deleteFromWishList: async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req;
    const wishlist = await new UserService({}).deleteFromWishList(
      userId,
      courseId
    );
    responseSender(res, wishlist);
  },
  getWishList: async (req, res) => {
    const { userId } = req;
    const wishlist = await new UserService({}).getWishList(userId);
    responseSender(res, wishlist);
  },
  addToProgress: async (req, res) => {
    const { userId } = req;
    const { courseId } = req.params;
    let model;
    let doneId;
    if (req.query.videoId) {
      console.log(
        "we here in video -----------------------------------------------------------------------------"
      );
      doneId = req.query.videoId;
      model = "Video";
    } else if (req.query.articleId) {
      console.log(
        "we here in article -----------------------------------------------------------------------------"
      );
      doneId = req.query.articleId;
      model = "Article";
    } else if (req.query.quizId) {
      console.log(
        "we here in quiz -----------------------------------------------------------------------------"
      );
      if (req.query.passed === "true") {
        doneId = req.query.quizId;
        model = "Quiz";
      } else {
        model = "fail";
      }
    }
    const progress = await new UserService({}).addToProgress(
      userId,
      courseId,
      doneId,
      model
    );
    responseSender(res, progress);
    console.log(
      "the progress is ---- --------------- ------------- ------------ ---------- ------: " +
      progress +
      progress.done +
      progress.doneModel
    );
  },
  rate: async (req, res) => {
    let { body } = req;
    body.userId = req.userId;
    body.courseId = req.params.courseId;
    const rate = await new CourseService({}).rate(body);
    await new CourseService({}).updateRate(body.courseId);
    responseSender(res, rate);
  },
  joinScholarship: async (req, res) => {
    const { userId } = req;
    const instituteId = req.params.id;
    const scholarshipId = req.params.scholarshipId;
    const isAdd = await new JoinRequistsService({}).userToInstituteByGrant(
      userId,
      instituteId,
      scholarshipId
    );
    if (isAdd) responseSender(res, "Your Requist Has Been Sent");
    else
      responseSender(res, "You have already registered for the scholarship.");
  },
  SubscribeToInstitute: async (req, res) => {
    const { userId } = req;
    const instituteId = req.params.id;
    const result = await new UserService({}).subscribeToInstitute(
      userId,
      instituteId
    );
    if (result === 1)
      responseSender(res, "you became a student at the institution");
    else if (result === 0)
      responseSender(res, "you already member in institute");
    else if (result === 2) responseSender(res, "you don't have enough money");
  },
  GetAllMessage: async (req, res) => {
    const { userId } = req;
    const result = await new UserService({}).getAllMessage(userId)
    responseSender(res, result)
  },
  DeleteMessage: async (req, res) => {
    const { userId } = req;
    const messageId = req.params.id
    await new UserService({}).deleteMessage(userId, messageId)
    responseSender(res, "the message deleted successfully")
  },
  getMessage: async (req, res) => {
    const { userId } = req;
    const messageId = req.params.id
    const result = await new UserService({}).getMessage(userId, messageId)
    responseSender(res, result)
  },
  getMyRequest: async (req, res) => {
    const { userId } = req;
    const result = await new UserService({}).getMyRequest(userId);
    responseSender(res, result)
  },
  getMyProgress: async (req, res) => {
    const { userId } = req
    const courseId = req.params.id
    const result = await new UserService({}).getMyProgress(userId, courseId)
    responseSender(res, result)
  },
  isMyInstitute: async (req, res) => {
    const { instituteId } = req;
    const { userId } = req;
    const user = await new UserService({}).isMyInstitute(userId, instituteId);
    responseSender(res, user);
  }
};
