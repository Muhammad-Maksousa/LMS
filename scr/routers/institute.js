const express = require("express");
const router = express.Router();
const controller = require("./../controllers/institute");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyTeacherToken ,verifyInstituteAdminToken} = require("../middleware/auth");
const upload = require('../helpers/uploadSingleImage');

router.post("/", upload.single("image") ,apiHandler(controller.add));
router.post("/login", apiHandler(controller.login));
router.put("/",upload.single("image"), apiHandler(controller.update));
router.get("/profile/:id",apiHandler(controller.getProfile));
router.get("/all",apiHandler(controller.getAll));
router.get("/acceptTeacher",apiHandler(verifyInstituteAdminToken),apiHandler(controller.acceptTeacherByAdmin));
router.get("/teacherRequists",apiHandler(verifyInstituteAdminToken),apiHandler(controller.teacherToinstituteRequists));
router.get("/getMyTeachers",apiHandler(verifyInstituteAdminToken),apiHandler(controller.getMyTeachers));

module.exports = router;
