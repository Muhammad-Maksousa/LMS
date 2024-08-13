const express = require("express");
const router = express.Router();
const controller = require("./../controllers/institute");
const apiHandler = require("../helpers/wrappers/api-handler");
const {
  verifyTeacherToken,
  verifyInstituteAdminToken,
} = require("../middleware/auth");
const upload = require("../helpers/uploadSingleImage");
const { route } = require("./user");

router.post("/", upload.single("image"), apiHandler(controller.add));
router.post("/login", apiHandler(controller.login));
router.post("/acceptCourse",apiHandler(verifyInstituteAdminToken),apiHandler(controller.acceptCourse));
router.put("/", upload.single("image"), apiHandler(verifyInstituteAdminToken),apiHandler(controller.update));
router.get("/profile/:instituteId",apiHandler(controller.getProfile));
router.get("/all", apiHandler(controller.getAll));
router.get("/acceptTeacher",apiHandler(verifyInstituteAdminToken),apiHandler(controller.acceptTeacherByAdmin));
router.get("/teacherRequists",apiHandler(verifyInstituteAdminToken),apiHandler(controller.teacherToinstituteRequists));
router.get("/getMyTeachers",apiHandler(verifyInstituteAdminToken),apiHandler(controller.getMyTeachers));
router.get("/allCourseRequists",apiHandler(verifyInstituteAdminToken),apiHandler(controller.getAllCoursesRequists));
router.get(
  "/ScholarshipRequest/:id",
  apiHandler(verifyInstituteAdminToken),
  apiHandler(controller.getScholarshipRequests)
);
router.post(
  "/acceptStudent/:id",
  apiHandler(verifyInstituteAdminToken),
  apiHandler(controller.approvOrRejecut)
);
router.delete(
  "/removeStudentScholarship",
  apiHandler(verifyInstituteAdminToken),
  apiHandler(controller.deleteScholarshipStudent)
);
router.post(
  "/addMyStudent",
  apiHandler(verifyInstituteAdminToken),
  apiHandler(controller.addMyStudent)
);
router.delete(
  "/deletMyStudent",
  apiHandler(verifyInstituteAdminToken),
  apiHandler(controller.deleteMyStudent)
);
module.exports = router;
