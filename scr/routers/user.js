const router = require("express").Router();
const controller = require("../controllers/user");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");
const upload = require("../helpers/uploadSingleImage");


router.post("/", upload.single('image'), apiHandler(controller.add));
router.post("/login", apiHandler(controller.login));
router.put("/update/:id", upload.single('image'),apiHandler(controller.update));
router.post("/enroll", apiHandler(controller.enroll));
router.post("/finishedCourse", apiHandler(controller.finishedCourse));
router.get("/profile/:id",apiHandler(controller.getProfile));

module.exports = router;