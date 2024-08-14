const express = require("express");
const router = express.Router();
const course = require("./../controllers/course");
const { verifyUserToken,verifyTeacherToken } = require("../middleware/auth");
const upload = require('../helpers/uploadSingleImage');
const apiHandler = require("../helpers/wrappers/api-handler");
router.route("/").get(apiHandler(course.getAllCourse))
router.post("/",upload.single("image"),apiHandler(verifyTeacherToken),apiHandler(course.createCourse));
router
.route("/:id")
.delete(apiHandler(course.deleteCourse))
.get(apiHandler(course.getCourse))
.patch(apiHandler(course.updateCourse));
router.get("/allByTeacher",apiHandler(course.getAllCoursesByTeacherId));
router.get("/getallUsersOfCourse/:id",apiHandler(course.getAllUsersOfCourse));
router.get("/instituteCourse/:id",apiHandler(course.getAllCousreByInstitute));
router.get("/getRate/:courseId",apiHandler(course.getRate));
module.exports = router;
