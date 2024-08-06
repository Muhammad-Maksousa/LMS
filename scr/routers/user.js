const router = require("express").Router();
const controller = require("../controllers/user");
const apiHandler = require("../helpers/wrappers/api-handler");
const { verifyUserToken } = require("../middleware/auth");
const upload = require("../helpers/uploadSingleImage");

router.post("/", upload.single("image"), apiHandler(controller.add));
router.post("/login", apiHandler(controller.login));
router.put("/update/:id",apiHandler(verifyUserToken),upload.single("image"),apiHandler(controller.update));
router.post("/enroll/:courseId",apiHandler(verifyUserToken),apiHandler(controller.enroll));
router.post("/finishedCourse/:courseId",apiHandler(verifyUserToken),apiHandler(controller.finishedCourse));
router.post("/rate/:courseId",apiHandler(verifyUserToken),apiHandler(controller.rate));

router.get("/finishedCourses",apiHandler(verifyUserToken),apiHandler(controller.getMyFinishedCourses));
router.get("/enrolledCourses",apiHandler(verifyUserToken),apiHandler(controller.getMyEnrolledCourses));
router.get("/profile",apiHandler(verifyUserToken),apiHandler(controller.getProfile));
router.get("/wishlist/:courseId",apiHandler(verifyUserToken),apiHandler(controller.addToWishList));
router.get("/wishlist",apiHandler(verifyUserToken),apiHandler(controller.getWishList));
router.delete("/wishlist/:courseId",apiHandler(verifyUserToken),apiHandler(controller.deleteFromWishList));
router.patch("/course/progress/:courseId",apiHandler(verifyUserToken),apiHandler(controller.addToProgress));
module.exports = router;
