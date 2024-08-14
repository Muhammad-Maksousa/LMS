const express = require("express");
const router = express.Router();
const controller = require("./../controllers/teacher");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyTeacherToken } = require("../middleware/auth");
const upload = require('../helpers/uploadSingleImage');

router.post("/", upload.any() ,apiHandler(controller.add));
router.post("/login", apiHandler(controller.login));
router.put("/",apiHandler(verifyTeacherToken) ,upload.any(), apiHandler(controller.update));
router.get("/profile/:id",apiHandler(controller.getProfile));
router.get("/all",apiHandler(controller.getAll));
router.get("/join/:instituteId",apiHandler(verifyTeacherToken),apiHandler(controller.joinToInstitute));
router.get("/myInstitutes",apiHandler(verifyTeacherToken),apiHandler(controller.myInstitutes));
router.get("/getAllMessage",apiHandler(verifyTeacherToken),apiHandler(controller.getAllMessage))
router.get("/getMessage/:id",apiHandler(verifyTeacherToken),apiHandler(controller.getMessage))
router.delete("/deleteMessage/:id",apiHandler(verifyTeacherToken),apiHandler(controller.deleteMessage))

module.exports = router;
