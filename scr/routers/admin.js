const express = require("express");
const router = express.Router();
const controller = require("./../controllers/admin");
const apiHandler = require("./../helpers/wrappers/api-handler");
const { verifyAdminToken } = require("../middleware/auth");

router.post("/",apiHandler(controller.add));
router.post("/login",apiHandler(controller.login));
router.put("/",apiHandler(verifyAdminToken),apiHandler(controller.update));
router.post("/rejectTeacher/:teacherId",apiHandler(verifyAdminToken),apiHandler(controller.rejectTeacher));
router.get("/acceptTeacher/:teacherId",apiHandler(verifyAdminToken),apiHandler(controller.acceptTeacher));
router.get("/getAllTeacherRequest",apiHandler(verifyAdminToken),apiHandler(controller.getAllTeacher))
router.get("/getProfile",apiHandler(verifyAdminToken),apiHandler(controller.getProfile))
module.exports = router;
