const router = require("express").Router();
const controller = require("../controllers/user");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");


router.post("/", apiHandler(controller.add));
router.post("/login", apiHandler(controller.login));
router.put("/update", apiHandler(controller.update));
router.post("/enroll",apiHandler(controller.enroll));
router.post("/finishedCourse",apiHandler(controller.finishedCourse));

module.exports = router;